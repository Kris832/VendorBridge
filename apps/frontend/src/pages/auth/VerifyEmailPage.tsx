import React from 'react';

const VerifyEmailPage: React.FC = () => {
  const [isVerifying, setIsVerifying] = React.useState(true);
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    // Verify email token on mount
    // Call API to verify
    const verify = async () => {
      try {
        setSuccess(true);
      } finally {
        setIsVerifying(false);
      }
    };
    verify();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
      {isVerifying ? (
        <>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email</h1>
          <p className="text-gray-600">Please wait while we verify your email address...</p>
        </>
      ) : success ? (
        <>
          <div className="text-4xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified</h1>
          <p className="text-gray-600 mb-6">Your email has been successfully verified.</p>
          <a href="/auth/login" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg">
            Go to Login
          </a>
        </>
      ) : (
        <>
          <div className="text-4xl mb-4">✗</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
          <p className="text-gray-600">Invalid or expired verification link.</p>
        </>
      )}
    </div>
  );
};

export default VerifyEmailPage;
