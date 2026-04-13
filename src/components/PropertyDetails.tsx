import React, { useState, useEffect } from 'react';
import { Property, IncomeRecord, ExpenseRecord, IncomeFormData, ExpenseFormData } from '../types';
import { apiService } from '../api/apiService';
import IncomeSection from './IncomeSection';
import ExpenseSection from './ExpenseSection';
import { MapPin, User, Home, Bed, Bath, AlertCircle } from 'lucide-react';

interface PropertyDetailsProps {
  propertyId: string | null;
  onDataChange: () => void;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  propertyId,
  onDataChange,
  onSuccess,
  onError,
}) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [income, setIncome] = useState<IncomeRecord[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propertyId) {
      loadData();
    } else {
      setProperty(null);
      setIncome([]);
      setExpenses([]);
    }
  }, [propertyId]);

  const loadData = async () => {
    if (!propertyId) return;

    setIsLoading(true);
    setError(null);

    try {
      const [propData, incomeData, expenseData] = await Promise.all([
        apiService.getProperty(propertyId),
        apiService.getIncomeByProperty(propertyId),
        apiService.getExpensesByProperty(propertyId),
      ]);

      setProperty(propData);
      setIncome(Array.isArray(incomeData) ? incomeData : []);
      setExpenses(Array.isArray(expenseData) ? expenseData : []);
    } catch (err) {
      setError('Failed to load property details. Please check your API connection.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddIncome = async (data: IncomeFormData) => {
    if (!propertyId) return;

    try {
      await apiService.addIncome(propertyId, data);
      await loadData();
      onDataChange();
      onSuccess('Income record added');
    } catch (err) {
      onError('Failed to add income record');
    }
  };

  const handleDeleteIncome = async (id: string) => {
    try {
      await apiService.deleteIncome(id);
      await loadData();
      onDataChange();
      onSuccess('Income record deleted');
    } catch (err) {
      onError('Failed to delete income record');
    }
  };

  const handleAddExpense = async (data: ExpenseFormData) => {
    if (!propertyId) return;

    try {
      await apiService.addExpense(propertyId, data);
      await loadData();
      onDataChange();
      onSuccess('Expense record added');
    } catch (err) {
      onError('Failed to add expense record');
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await apiService.deleteExpense(id);
      await loadData();
      onDataChange();
      onSuccess('Expense record deleted');
    } catch (err) {
      onError('Failed to delete expense record');
    }
  };

  if (!propertyId) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-white rounded-2xl border border-gray-100">
        <Home size={48} className="mb-4 opacity-20" />
        <p className="text-lg font-medium">Select a property</p>
        <p className="text-sm">Choose a property from the list to view details and financial records</p>
      </div>
    );
  }

  if (isLoading && !property) {
    return (
      <div className="space-y-8 p-8 bg-white rounded-2xl border border-gray-100">
        <div className="h-24 bg-gray-50 animate-pulse rounded-xl"></div>
        <div className="h-64 bg-gray-50 animate-pulse rounded-xl"></div>
        <div className="h-64 bg-gray-50 animate-pulse rounded-xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-center gap-3">
        <AlertCircle size={24} />
        <p>{error}</p>
      </div>
    );
  }

  if (!property) return null;

  const monthlyRent = property.monthly_rent ?? 0;
  const propertyType = property.property_type ?? 'N/A';
  const tenantName = property.tenant_name ?? 'N/A';
  const bedrooms = property.bedrooms ?? 'N/A';
  const bathrooms = property.bathrooms ?? 'N/A';

  const totalIncome = (income ?? []).reduce((sum, record) => sum + (record.amount ?? 0), 0);
  const totalExpenses = (expenses ?? []).reduce((sum, record) => sum + (record.amount ?? 0), 0);
  const netCashFlow = totalIncome - totalExpenses;

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">
              <MapPin size={14} />
              Property Details
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">{property.address ?? 'No address available'}</h2>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                <Home size={16} className="text-gray-400" />
                {propertyType}
              </div>

              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                <Bed size={16} className="text-gray-400" />
                {bedrooms} Beds
              </div>

              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                <Bath size={16} className="text-gray-400" />
                {bathrooms} Baths
              </div>

              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                <User size={16} className="text-gray-400" />
                {tenantName}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center items-end border-l border-gray-100 pl-6">
            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Monthly Rent</div>
            <div className="text-4xl font-black text-gray-900">
              ${monthlyRent.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-50">
          <div className="p-4 bg-green-50 rounded-xl">
            <div className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1">
              Total Income
            </div>
            <div className="text-xl font-bold text-green-700">
              ${totalIncome.toLocaleString()}
            </div>
          </div>

          <div className="p-4 bg-red-50 rounded-xl">
            <div className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-1">
              Total Expenses
            </div>
            <div className="text-xl font-bold text-red-700">
              ${totalExpenses.toLocaleString()}
            </div>
          </div>

          <div className="p-4 bg-gray-900 rounded-xl text-white">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Net Cash Flow
            </div>
            <div className="text-xl font-bold">
              ${netCashFlow.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <IncomeSection
            records={income ?? []}
            onAdd={handleAddIncome}
            onDelete={handleDeleteIncome}
            isLoading={isLoading}
          />
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <ExpenseSection
            records={expenses ?? []}
            onAdd={handleAddExpense}
            onDelete={handleDeleteExpense}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
