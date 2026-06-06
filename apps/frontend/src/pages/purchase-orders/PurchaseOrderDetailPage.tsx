import React from 'react';
import { useParams } from 'react-router-dom';

const PurchaseOrderDetailPage: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Purchase Order Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">PO ID: {id}</p>
      </div>
    </div>
  );
};

export default PurchaseOrderDetailPage;
