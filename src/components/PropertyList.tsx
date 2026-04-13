import React from 'react';
import { Property } from '../types';
import { Home, Bed, Bath, User, Trash2, Edit2 } from 'lucide-react';

interface PropertyListProps {
  properties: Property[];
  selectedPropertyId: string | null;
  onSelect: (id: string) => void;
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const PropertyList: React.FC<PropertyListProps> = ({ 
  properties, 
  selectedPropertyId, 
  onSelect, 
  onEdit, 
  onDelete,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-2xl"></div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <Home className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium">No properties found</p>
        <p className="text-gray-400 text-sm">Add your first property to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {properties.map(property => (
        <div 
          key={property.id}
          onClick={() => onSelect(property.id)}
          className={`group relative p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedPropertyId === property.id 
              ? 'bg-gray-900 border-gray-900 text-white shadow-lg' 
              : 'bg-white border-gray-100 hover:border-gray-300 text-gray-900'
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-lg truncate pr-16">{property.address}</h3>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={(e) => { e.stopPropagation(); onEdit(property); }}
                className={`p-1.5 rounded-lg transition-colors ${
                  selectedPropertyId === property.id ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(property.id); }}
                className={`p-1.5 rounded-lg transition-colors ${
                  selectedPropertyId === property.id ? 'hover:bg-red-900 text-red-300' : 'hover:bg-red-50 text-red-600'
                }`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="flex items-center gap-2 opacity-80">
              <Home size={14} />
              <span>{property.propertyType}</span>
            </div>
            <div className="flex items-center gap-2 opacity-80">
              <User size={14} />
              <span className="truncate">{property.tenantName}</span>
            </div>
            <div className="flex items-center gap-4 opacity-80">
              <div className="flex items-center gap-1">
                <Bed size={14} />
                <span>{property.bedrooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath size={14} />
                <span>{property.bathrooms}</span>
              </div>
            </div>
            <div className="font-bold text-right">
              ${property.monthlyRent.toLocaleString()}/mo
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertyList;
