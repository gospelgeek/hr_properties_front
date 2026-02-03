import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import PropertyDetails from '../components/Properties/PropertyDetails';
import DeletePropertyButton from '../components/Properties/DeletePropertyButton';
import Loader from '../components/UI/Loader';
import ObligationCard from '../components/Finance/ObligationCard';
import RentalCard from '../components/Rentals/RentalCard';
import { getProperty, deleteProperty } from '../api/properties.api';
import { getPropertyObligations } from '../api/finance.api';
import { getPropertyRentals } from '../api/rentals.api';

const PropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [obligations, setObligations] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      const data = await getProperty(id);
      setProperty(data);
      
      // Load obligations
      try {
        const oblData = await getPropertyObligations(id);
        setObligations(Array.isArray(oblData) ? oblData : oblData.results || []);
      } catch (err) {
        console.error('Error loading obligations:', err);
      }
      
      // Load rentals if rental property
      if (data.use === 'arrendamiento') {
        try {
          const rentalsData = await getPropertyRentals(id);
          setRentals(Array.isArray(rentalsData) ? rentalsData : rentalsData.results || []);
        } catch (err) {
          console.error('Error loading rentals:', err);
        }
      }
    } catch (error) {
      console.error('Error loading property:', error);
      toast.error('Error loading property');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProperty(id);
      toast.success('Property deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Error deleting property');
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <p className="text-base-content/60 text-lg">Property not found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Back to properties</span>
        </Link>
      </div>

      <PropertyDetails property={property} />

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Link
          to={`/edit/${id}`}
          className="flex-1 sm:flex-none bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-center"
        >
          Edit Property
        </Link>
        <DeletePropertyButton propertyId={id} onDelete={handleDelete} />
      </div>

      {/* Financial Obligations Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Financial Obligations</h2>
          <Link
            to={`/property/${id}/add-obligation`}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Obligation
          </Link>
        </div>
        {obligations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-600">No registered obligations</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {obligations.map((obligation) => (
              <ObligationCard key={obligation.id} obligation={obligation} propertyId={id} />
            ))}
          </div>
        )}
      </div>

      {/* Rentals Section (only for rental properties) */}
      {property.use === 'arrendamiento' && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Rentals</h2>
            <Link
              to={`/property/${id}/add-rental`}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Rental
            </Link>
          </div>
          {rentals.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600">No registered rentals</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rentals.map((rental) => (
                <RentalCard key={rental.id} rental={rental} propertyId={id} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyPage;
