import React from 'react';

type CookieConsentProps = {
  onAccept: () => void;
  onDecline: () => void;
};

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onDecline }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4 shadow-md z-50">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0 md:mr-4">
          <p className="text-sm text-gray-700">
            This website uses cookies to ensure you get the best experience on our website. 
            By continuing to use this site, you consent to the use of cookies in accordance with our 
            <a href="/privacy-policy" className="text-blue-600 hover:underline ml-1">Privacy Policy</a>.
          </p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={onDecline}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-200"
          >
            Decline
          </button>
          <button 
            onClick={onAccept}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
