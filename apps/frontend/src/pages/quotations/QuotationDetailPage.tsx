import React from 'react';
import { useParams } from 'react-router-dom';

const QuotationDetailPage: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Quotation Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Quotation ID: {id}</p>
      </div>
    </div>
  );
};

export default QuotationDetailPage;
