export interface Property {
  id: string;
  address: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  monthlyRent: number;
  tenantName: string;
}

export type IncomeCategory = 'rent' | 'late fee' | 'deposit';

export interface IncomeRecord {
  id: string;
  propertyId: string;
  amount: number;
  paymentDate: string;
  category: IncomeCategory;
}

export interface ExpenseRecord {
  id: string;
  propertyId: string;
  amount: number;
  expenseDate: string;
  category: string;
  vendor: string;
}

export interface PropertyFormData extends Omit<Property, 'id'> {}
export interface IncomeFormData extends Omit<IncomeRecord, 'id' | 'propertyId'> {}
export interface ExpenseFormData extends Omit<ExpenseRecord, 'id' | 'propertyId'> {}
