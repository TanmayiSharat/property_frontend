import React, { useState, useEffect } from 'react';
import { Property, PropertyFormData } from './types';
import { apiService } from './api/apiService';
import PropertyList from './components/PropertyList';
import PropertyForm from './components/PropertyForm';
import PropertyDetails from './components/PropertyDetails';
import { Plus, Building2, LayoutDashboard, AlertCircle } from 'lucide-react';

export default function App() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getProperties();
      setProperties(data);
    } catch (err) {
      setError('Failed to load properties. Please ensure VITE_API_BASE_URL is set correctly.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePropertySubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);
    try {
      if (editingProperty) {
        await apiService.updateProperty(String(editingProperty.property_id), data);
        showSuccess('Property updated successfully');
      } else {
        await apiService.createProperty(data);
        showSuccess('Property added successfully');
      }
      await loadProperties();
      setIsFormOpen(false);
      setEditingProperty(null);
    } catch (err) {
      showError('Failed to save property. Please check your API connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePropertyDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this property? This will also delete all associated records.')) return;
    
    try {
      await apiService.deleteProperty(id);
      showSuccess('Property deleted successfully');
      if (selectedPropertyId === id) setSelectedPropertyId(null);
      await loadProperties();
    } catch (err) {
      showError('Failed to delete property.');
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setIsFormOpen(true);
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setErrorMessage(null);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setSuccessMessage(null);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gray-900 p-1.5 rounded-lg">
              <Building2 className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-black tracking-tight">LandlordPro</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {successMessage && (
              <div className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium border border-green-100">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="bg-red-50 text-red-700 px-4 py-1.5 rounded-full text-sm font-medium border border-red-100">
                {errorMessage}
              </div>
            )}
            <button 
              onClick={() => { setEditingProperty(null); setIsFormOpen(true); }}
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all active:scale-95"
            >
              <Plus size={18} />
              Add Property
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Property List */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <LayoutDashboard size={16} />
                My Properties
              </h2>
              <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">
                {properties.length}
              </span>
            </div>

            {error && (
              <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-start gap-3 text-red-700 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <PropertyList 
              properties={properties}
              selectedPropertyId={selectedPropertyId}
              onSelect={setSelectedPropertyId}
              onEdit={handleEdit}
              onDelete={handlePropertyDelete}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column: Details or Form */}
          <div className="lg:col-span-8">
            {isFormOpen ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <PropertyForm 
                  property={editingProperty}
                  onSubmit={handlePropertySubmit}
                  onCancel={() => { setIsFormOpen(false); setEditingProperty(null); }}
                  isSubmitting={isSubmitting}
                />
              </div>
            ) : (
              <PropertyDetails 
                propertyId={selectedPropertyId} 
                onDataChange={loadProperties}
                onSuccess={showSuccess}
                onError={showError}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer / Info */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-200 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-gray-400 text-xs">
          <p>© 2026 LandlordPro MVP. Built for clarity and simplicity.</p>
          <div className="flex gap-6">
            <p>API Base: <code className="bg-gray-100 px-1.5 py-0.5 rounded">{import.meta.env.VITE_API_BASE_URL || 'Not Set'}</code></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
