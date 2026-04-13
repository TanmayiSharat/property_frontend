import {
  Property,
  PropertyFormData,
  IncomeRecord,
  IncomeFormData,
  ExpenseRecord,
  ExpenseFormData,
} from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || `API error: ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const apiService = {
  // Properties
  getProperties: (): Promise<Property[]> =>
    fetch(`${BASE_URL}/properties`).then((res) => handleResponse<Property[]>(res)),

  getProperty: (id: string): Promise<Property> =>
    fetch(`${BASE_URL}/properties/${id}`).then((res) => handleResponse<Property>(res)),

  createProperty: (data: PropertyFormData): Promise<Property> =>
    fetch(`${BASE_URL}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => handleResponse<Property>(res)),

  updateProperty: (id: string, data: PropertyFormData): Promise<Property> =>
    fetch(`${BASE_URL}/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => handleResponse<Property>(res)),

  deleteProperty: (id: string): Promise<void> =>
    fetch(`${BASE_URL}/properties/${id}`, {
      method: 'DELETE',
    }).then((res) => handleResponse<void>(res)),

  // Income
  getIncomeByProperty: (propertyId: string): Promise<IncomeRecord[]> =>
    fetch(`${BASE_URL}/income/${propertyId}`).then((res) => handleResponse<IncomeRecord[]>(res)),

  addIncome: (propertyId: string, data: IncomeFormData): Promise<IncomeRecord> =>
    fetch(`${BASE_URL}/income/${propertyId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => handleResponse<IncomeRecord>(res)),

  deleteIncome: (incomeId: string): Promise<void> =>
    fetch(`${BASE_URL}/income/${incomeId}`, {
      method: 'DELETE',
    }).then((res) => handleResponse<void>(res)),

  // Expenses
  getExpensesByProperty: (propertyId: string): Promise<ExpenseRecord[]> =>
    fetch(`${BASE_URL}/expense/${propertyId}`).then((res) => handleResponse<ExpenseRecord[]>(res)),

  addExpense: (propertyId: string, data: ExpenseFormData): Promise<ExpenseRecord> =>
    fetch(`${BASE_URL}/expense/${propertyId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => handleResponse<ExpenseRecord>(res)),

  deleteExpense: (expenseId: string): Promise<void> =>
    fetch(`${BASE_URL}/expense/${expenseId}`, {
      method: 'DELETE',
    }).then((res) => handleResponse<void>(res)),
};
