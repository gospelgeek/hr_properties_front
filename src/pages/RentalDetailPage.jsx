import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/UI/Loader";
import PaymentForm from "../components/Finance/PaymentForm";
import { useAuth } from "../context/AuthContext";
import PaymentEditModal from "../components/Finance/PaymentEditModal";
import {
  getPropertyRental,
  addPaymentToRental,
  getRentalPaymentsDirect,
  deleteRentalPayment,
  updateRentalPayment
} from "../api/rentals.api";
import { getProperty, openProtectedMedia } from "../api/properties.api";

const toCents = (value) => {
  const numeric = Number(value || 0);
  if (!Number.isFinite(numeric)) return 0;
  return Math.round(numeric * 100);
};

const fromCents = (value) => value / 100;

const formatApiError = (error, formatCurrency, fallbackMessage) => {
  const responseData = error?.response?.data;

  if (!responseData) {
    return fallbackMessage;
  }

  if (typeof responseData === "string") {
    return responseData;
  }

  if (typeof responseData.error === "string") {
    if (responseData.error === "Payment exceeds the rental expected amount") {
      return `${responseData.error}. Pending: ${formatCurrency(responseData.pending)}. Attempted: ${formatCurrency(responseData.attempted)}.`;
    }

    return responseData.error;
  }

  if (typeof responseData.detail === "string") {
    return responseData.detail;
  }

  const entries = Object.entries(responseData)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}: ${value.join(", ")}`;
      }

      if (value && typeof value === "object") {
        return `${key}: ${JSON.stringify(value)}`;
      }

      return `${key}: ${String(value)}`;
    })
    .join(" | ");

  return entries || fallbackMessage;
};

const normalizePaymentsPayload = (paymentsResponse, rentalData) => {
  const paymentsArray = Array.isArray(paymentsResponse)
    ? paymentsResponse
    : Array.isArray(paymentsResponse?.payments)
      ? paymentsResponse.payments
      : Array.isArray(paymentsResponse?.results)
        ? paymentsResponse.results
        : [];

  const expectedTotalFromApi = paymentsResponse?.expected_total;
  const expectedTotalCents = toCents(
    expectedTotalFromApi ?? rentalData?.total_amount ?? rentalData?.amount,
  );

  const totalPaidFromApi = paymentsResponse?.total_paid;
  const computedTotalPaidCents = paymentsArray.reduce(
    (sum, payment) => sum + toCents(payment.amount),
    0,
  );
  const totalPaidCents =
    totalPaidFromApi != null ? toCents(totalPaidFromApi) : computedTotalPaidCents;

  const pendingFromApi = paymentsResponse?.pending;
  const pendingCents =
    pendingFromApi != null
      ? Math.max(0, toCents(pendingFromApi))
      : Math.max(0, expectedTotalCents - totalPaidCents);

  const isFullyPaidFromApi = paymentsResponse?.is_fully_paid;

  const paymentStatus =
    paymentsResponse?.payment_status ??
    paymentsResponse?.paymentStatus ??
    paymentsResponse?.summary?.payment_status ??
    paymentsResponse?.summary?.paymentStatus ??
    {};
  const monthlyAmountFromApi =
    paymentStatus?.monthly_amount ?? paymentStatus?.monthlyAmount;
  const overdueAmountFromApi =
    paymentStatus?.overdue_amount ?? paymentStatus?.overdueAmount;
  const isUpToDateFromApi =
    paymentStatus?.is_up_to_date ?? paymentStatus?.isUpToDate;
  const statusLabelFromApi =
    paymentStatus?.status_label ?? paymentStatus?.statusLabel;

  return {
    payments: paymentsArray,
    summary: {
      expectedTotal: fromCents(expectedTotalCents),
      totalPaid: fromCents(totalPaidCents),
      pending: fromCents(pendingCents),
      isFullyPaid:
        typeof isFullyPaidFromApi === "boolean"
          ? isFullyPaidFromApi
          : pendingCents <= 0,
      paymentStatus: {
        monthlyAmount:
          monthlyAmountFromApi != null
            ? fromCents(toCents(monthlyAmountFromApi))
            : fromCents(toCents(rentalData?.amount)),
        overdueAmount:
          overdueAmountFromApi != null
            ? Math.max(0, fromCents(toCents(overdueAmountFromApi)))
            : 0,
        isUpToDate:
          typeof isUpToDateFromApi === "boolean"
            ? isUpToDateFromApi
            : statusLabelFromApi === "up_to_date" || statusLabelFromApi === "fully_paid"
              ? true
              : overdueAmountFromApi != null
                ? toCents(overdueAmountFromApi) <= 0
                : pendingCents <= 0,
      },
    },
  };
  
};

const RentalDetailPage = () => {
  const { id, rentalId } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [property, setProperty] = useState(null);
  const [rental, setRental] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [expandedPaymentId, setExpandedPaymentId] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [isSavingPayment, setIsSavingPayment] = useState(false);
  const [paymentSummary, setPaymentSummary] = useState({
    expectedTotal: 0,
    totalPaid: 0,
    pending: 0,
    isFullyPaid: false,
    paymentStatus: {
      monthlyAmount: 0,
      overdueAmount: 0,
      isUpToDate: false,
    },
  });
console.log('paymentSummary:', paymentSummary);
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Si es admin y tiene propertyId, carga todo incluyendo property details
      if (isAdmin() && id) {
        const [propData, rentalData, paymentsData] = await Promise.all([
          getProperty(id),
          getPropertyRental(id, rentalId),
          getRentalPaymentsDirect(rentalId),
        ]);
        
        console.log('rentalData:', rentalData);
        console.log('paymentsData:', paymentsData);
        setProperty(propData);
        setRental(rentalData);

        const normalized = normalizePaymentsPayload(paymentsData, rentalData);
        setPayments(normalized.payments);
        setPaymentSummary(normalized.summary);
      } else {
        // Si es cliente, usa solo el endpoint de payments que ya incluye todo
        const paymentsData = await getRentalPaymentsDirect(rentalId);
        

      

        // El endpoint devuelve { payments: [...], count, total_paid, expected_total, pending, is_fully_paid, payment_status, rental: {...} }
        setRental(paymentsData.rental);

        // Extraer info de property del objeto rental
        setProperty({
          id: paymentsData.rental.property?.id || paymentsData.rental.property,
          name: paymentsData.rental.property?.address || "Property",
          address: paymentsData.rental.property?.address || "",
        });

        const normalized = normalizePaymentsPayload(paymentsData, paymentsData.rental);
        setPayments(normalized.payments);
        setPaymentSummary(normalized.summary);
        console.log('normalized.summary:', normalized.summary);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error(formatApiError(error, formatCurrency, "Error loading rental"));
      navigate(`/rentals`);
    } finally {
      setLoading(false);
    }
  }, [id, rentalId, isAdmin, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddPayment = async (data) => {
    try {
      setIsSubmitting(true);
      // Si data ya es FormData,mandar directo
      if (data instanceof FormData) {
        await addPaymentToRental(id, rentalId, data);
      } else {
        // Si no, es JSON normal
        await addPaymentToRental(id, rentalId, data);
      }

      toast.success("Payment added successfully");
      setShowPaymentForm(false);
      loadData();
    } catch (error) {
      console.error("Error adding payment:", error);
      toast.error(formatApiError(error, formatCurrency, "Error adding payment"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    if (!confirm("Are you sure you want to delete this payment?")) return;

    try {
      await deleteRentalPayment(id, rentalId, paymentId);
      toast.success("Payment deleted successfully");
      loadData();
    } catch (error) {
      console.error("Error deleting payment:", error);
      toast.error(formatApiError(error, formatCurrency, "Error deleting payment"));
    }
  };
const handleEditPayment = (payment) => setEditingPayment(payment);
   const handleSavePayment = async (updatedPayment) => {
    try {
      const propertyId = id || rental?.property;
      if (!propertyId || !rentalId || !editingPayment?.id) {
        toast.error('Missing payment reference');
        return;
      }

      setIsSavingPayment(true);
      await updateRentalPayment(propertyId, rentalId, editingPayment.id, updatedPayment);
      await loadData();
      toast.success('Payment updated successfully');
      setEditingPayment(null);
    } catch (error) {
      toast.error(formatApiError(error, formatCurrency, 'Error updating payment'));
    } finally {
      setIsSavingPayment(false);
    }
  };

  const handleOpenDocument = async (url) => {
    try {
      await openProtectedMedia(url);
    } catch (error) {
      console.error("Error opening protected document:", error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <Loader />;
  if (!rental) return null;

  const pendingCents = Math.max(0, toCents(paymentSummary.pending));

  const pending = fromCents(pendingCents);
  const isCompleted =
    typeof paymentSummary.isFullyPaid === "boolean"
      ? paymentSummary.isFullyPaid
      : pendingCents <= 0;
  const monthlyAmount =
    paymentSummary.paymentStatus?.monthlyAmount || fromCents(toCents(rental.amount));
  const overdueAmount = Math.max(
    0,
    paymentSummary.paymentStatus?.overdueAmount || 0,
  );
  const isUpToDate = !!paymentSummary.paymentStatus?.isUpToDate;

  const getStatus = () => {
    // Si no hay tenant o fechas, está disponible
    if (!rental.tenant || !rental.check_out) {
      return { text: "Available", color: "bg-blue-100 text-blue-800" };
    }

    const today = new Date();
    const checkOut = new Date(rental.check_out);
    const diffDays = Math.ceil((checkOut - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0)
      return { text: "Completed", color: "bg-gray-100 text-gray-800" };
    if (diffDays <= 15)
      return { text: "About to end", color: "bg-yellow-100 text-yellow-800" };
    return { text: "Active", color: "bg-green-100 text-green-800" };
  };

  const status = getStatus();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() =>
              navigate(id && isAdmin() ? `/property/${id}` : `/rentals/`)
            }
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {id && isAdmin() ? "Back to Property" : "Back to Rentals"}
          </button>

          {id && isAdmin() && (
            <button
              onClick={() =>
                navigate(`/property/${id}/rentals/${rentalId}/edit`)
              }
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Rental
            </button>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Rental Detail
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Property:{" "}
          <span className="font-semibold">
            {property?.name || property?.address}
          </span>
        </p>
        {!isAdmin() && (
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <svg
                className="w-4 h-4 inline mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              You are viewing this rental in read-only mode. Contact the
              administrator to make changes.
            </p>
          </div>
        )}
      </div>

      {/* Rental Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {rental.tenant_name ||
                rental.tenant?.name ||
                rental.tenant?.email ||
                rental.tenant?.phone1 ||
                "No Tenant"}
            </h2>
            <p className="text-gray-600">
              {"Property address: " + rental.property_address ||
                "Property address Not Specified"}
            </p>
            <p className="text-gray-600">
              {rental.rental_type === "monthly" ? "Monthly Rental" : "Airbnb"}
            </p>
          </div>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${status.color}`}
          >
            {status.text}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {rental.check_in && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Check-in</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(rental.check_in)}
              </p>
            </div>
          )}
          {rental.check_out && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Check-out</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(rental.check_out)}
              </p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600 mb-1">Monthly Amount</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(monthlyAmount)}
            </p>
          </div>

          {rental.people_count && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Number of People</p>
              <p className="text-lg font-semibold text-gray-900">
                {rental.people_count}
              </p>
            </div>
          )}
        </div>

        {rental.rental_type === "monthly" &&
          rental.monthly_records?.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">
                Monthly Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Deposit</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(rental.monthly_records[0]?.deposit_amount)}
                    {rental.monthly_records[0]?.is_refundable && (
                      <span className="ml-2 text-sm text-green-600">
                        (Refundable)
                      </span>
                    )}
                  </p>
                </div>
                {/*console.log('rental.monthly_records:', rental)*/}
                {rental.monthly_records[0]?.url_files && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Files</p>
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenDocument(rental.monthly_records[0].url_files)
                      }
                      className="cursor-pointer text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      View Files
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        {rental.rental_type === "airbnb" &&
          rental.airbnb_records?.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">
                Airbnb Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rental.airbnb_records[0]?.deposit_amount && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Deposit</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(rental.airbnb_records[0].deposit_amount)}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                  <p
                    className={`text-lg font-semibold ${rental.airbnb_records[0]?.is_paid ? "text-green-600" : "text-red-600"}`}
                  >
                    {rental.airbnb_records[0]?.is_paid ? "Paid" : "Pending"}
                  </p>
                </div>
              </div>
            </div>
          )}

        <div className="pt-4 border-t border-gray-200 mt-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700">Payment Status</p>
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-full ${isUpToDate ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {isUpToDate ? "Up to Date" : "Overdue"}
            </span>
          </div>
          {isUpToDate ? (
            <p className="text-sm text-green-600 font-medium">The payment is up to date</p>
          ) : (
            <p className="text-sm text-red-600 font-medium">
              The payment is overdue. Amount due: {formatCurrency(overdueAmount)}
            </p>
          )}
        </div>
      </div>

      {/* Payment Form - Only for Admin */}
      {isAdmin() && !isCompleted && status.text !== "Completed" && (
        <div className="mb-6">
          {showPaymentForm ? (
            <div>
              <PaymentForm
                onSubmit={handleAddPayment}
                isLoading={isSubmitting}
                maxAmount={Number(pending.toFixed(2))}
              />
              <button
                onClick={() => setShowPaymentForm(false)}
                className="mt-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors px-4 py-2 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowPaymentForm(true)}
              className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors py-3 font-medium flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Payment
            </button>
          )}
        </div>
      )}

      {/* Lista de Pagos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Payment History ({payments.length})
          </h3>
        </div>
        {payments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No payments recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className={`border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer`}
                onClick={() =>
                  setExpandedPaymentId(
                    expandedPaymentId === payment.id ? null : payment.id,
                  )
                }
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-gray-900">
                        {rental.property_name || "Obligación"}
                      </p>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                        {rental.rental_type || "Payment Method"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      Date: {payment.date}
                    </p>
                    {/* Mostrar nombre de la obligación aquí */}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </p>
                    {/* Botón de eliminar solo en modo expandido y si es admin */}
                    {expandedPaymentId === payment.id && isAdmin() && (
                      <div className="flex items-center gap-1">
                        {console.log('Payment to edit:', payment)}
                       <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditPayment(payment);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Payment"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePayment(payment.id);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Payment"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Detalles adicionales */}
                {expandedPaymentId === payment.id && (
                  <div className="mt-4 border-t pt-3 text-sm text-gray-700 space-y-1">
                    <div>
                      <span className="font-medium">Tenant:</span>{" "}
                      {rental.tenant_name ||
                        rental.tenant?.name ||
                        rental.tenant?.email ||
                        rental.tenant?.phone1 ||
                        "No Tenant"}
                    </div>
                    {rental.check_in && (
                      <div>
                        <span className="font-medium">
                          {rental.rental_type == "monthly"
                            ? "Move In:"
                            : "Check In:"}
                        </span>{" "}
                        {rental.check_in}
                      </div>
                    )}
                    {rental.check_out && (
                      <div>
                        <span className="font-medium">
                          {rental.rental_type == "monthly"
                            ? "Move Out:"
                            : "Check Out:"}
                        </span>{" "}
                        {rental.check_out}
                      </div>
                    )}
                    {payment.voucher_url && (
                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenDocument(payment.voucher_url)
                          }
                          className="cursor-pointer text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          View Voucher
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
        {editingPayment && (
        <PaymentEditModal
          payment={editingPayment}
          onClose={() => setEditingPayment(null)}
          onSave={handleSavePayment}
          isLoading={isSavingPayment}
        />
      )}
    </div>
  );
};

export default RentalDetailPage;
