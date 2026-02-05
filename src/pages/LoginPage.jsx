import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('client'); // 'client' or 'admin'
  const { loginClient, loginGoogle } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onClientLogin = async (data) => {
    const result = await loginClient(data.username, data.password);
    
    if (result.success) {
      toast.success('Login successful');
      reset();
      navigate('/rentals');
    } else {
      console.error('Login failed:', result.error);
      toast.error(result.error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await loginGoogle(credentialResponse.credential);
    
    if (result.success) {
      toast.success('Login successful');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  const handleGoogleError = () => {
    toast.error('Error logging in with Google');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Properties HR</h1>
          <p className="text-gray-600">Property and rental management</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('client')}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${
                activeTab === 'client'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Client
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${
                activeTab === 'admin'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Administrator
            </button>
          </div>

          <div className="p-8">
            {/* Client Login Form */}
            {activeTab === 'client' && (
              <form onSubmit={handleSubmit(onClientLogin)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User
                  </label>
                  <input
                    type="text"
                    {...register('username', { 
                      required: 'User is required',
                      pattern: {
                        value: /^[0-9]+$/,
                        message: 'Numbers only'
                      }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="3123456789"
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    {...register('password', { 
                      required: 'Password is required'
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••••"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors py-3 font-medium shadow-sm hover:shadow-md"
                >
                  Login
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/public-properties')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Continue as Guest →
                  </button>
                </div>
              </form>
            )}

            {/* Admin Google Login */}
            {activeTab === 'admin' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Acceso Administrativo
                  </h3>
                  <p className="text-sm text-gray-600">
                    Inicia sesión con tu cuenta de Google autorizada
                  </p>
                </div>

                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap
                    theme="outline"
                    size="large"
                    text="signin_with"
                    shape="rectangular"
                  />
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    <strong>Nota:</strong> Solo cuentas autorizadas pueden acceder como administrador.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>¿No tienes acceso? Contacta al administrador</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
