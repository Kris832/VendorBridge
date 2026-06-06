import React from 'react';

const ProfilePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Profile information will be displayed here</p>
      </div>
    </div>
  );
};

export default ProfilePage;
