export interface Property {
  property_id: number;
  name?: string;
  address: string;
  city?: string;
  state?: string;
  postal_code?: string;
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  monthly_rent: number;
  tenant_name: string;
}

export type IncomeCategory = 'rent' | 'late fee' | 'deposit';

export interface IncomeRecord {
  income_id?: number;
  property_id?: number;
  amount: number;
  payment_date: string;
  category: IncomeCategory;
}

export interface ExpenseRecord {
  expense_id?: number;
  property_id?: number;
  amount: number;
  expense_date: string;
  category: string;
  vendor: string;
}

export interface PropertyFormData {
  address: string;
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  monthly_rent: number;
  tenant_name: string;
}

export interface IncomeFormData {
  amount: number;
  payment_date: string;
  category: IncomeCategory;
}

export interface ExpenseFormData {
  amount: number;
  expense_date: string;
  category: string;
  vendor: string;
}
