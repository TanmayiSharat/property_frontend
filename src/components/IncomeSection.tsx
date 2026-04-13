import React, { useState } from 'react';
import { IncomeRecord, IncomeFormData, IncomeCategory } from '../types';
import { Plus, Trash2, Calendar } from 'lucide-react';

interface IncomeSectionProps {
  records: IncomeRecord[];
  onAdd: (data: IncomeFormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
}

const IncomeSection: React.FC<IncomeSectionProps> = ({ records, onAdd, onDelete, isLoading }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<IncomeFormData>({
    amount: 0,
    payment_date: new Date().toISOString().split('T')[0],
    category: 'rent' as IncomeCategory,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAdd(formData);
    setIsAdding(false);
    setFormData({
      amount: 0,
      payment_date: new Date().toISOString().split('T')[0],
      category: 'rent' as IncomeCategory,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Income Records</h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
        >
          <Plus size={16} />
          {isAdding ? 'Cancel' : 'Add Record'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Amount
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={formData.payment_date}
                onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as IncomeCategory })}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="rent">Rent</option>
                <option value="late fee">Late Fee</option>
                <option value="deposit">Deposit</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Save Record
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-12 bg-gray-50 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : (records ?? []).length === 0 ? (
        <p className="text-center py-8 text-gray-400 text-sm italic">No income records yet</p>
      ) : (
        <div className="overflow-hidden border border-gray-100 rounded-xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(records ?? []).map((record, index) => {
                const recordId = String(record.income_id ?? record.id ?? index);
                const paymentDate = record.payment_date ?? record.paymentDate ?? '';
                const amount = record.amount ?? 0;

                return (
                  <tr key={recordId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-300" />
                        {paymentDate ? new Date(paymentDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-[10px] font-bold uppercase">
                        {record.category ?? 'N/A'}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-semibold text-gray-900">
                      ${amount.toLocaleString()}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onDelete(recordId)}
                        className="text-gray-300 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IncomeSection;
