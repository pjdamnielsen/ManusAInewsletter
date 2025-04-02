import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose prose-lg">
        <p className="mb-4">
          Last updated: April 2, 2025
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
        <p>
          This Privacy Policy explains how we collect, use, store, protect, and share your personal information through our newsletter subscription service. We are committed to protecting your personal data and being transparent about how we use it.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
        <p>We collect the following information when you subscribe to our newsletter:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Email address (required)</li>
          <li>First name (optional)</li>
          <li>Last name (optional)</li>
          <li>IP address (automatically collected)</li>
          <li>Browser user agent (automatically collected)</li>
          <li>Timestamp of subscription and consent</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
        <p>We use your personal information for the following purposes:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>To send you the newsletter you subscribed to</li>
          <li>To personalize communication with you</li>
          <li>To maintain records of your consent</li>
          <li>To comply with legal obligations</li>
          <li>To improve our services</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Legal Basis for Processing</h2>
        <p>
          We process your personal data based on the consent you provide when subscribing to our newsletter. You can withdraw this consent at any time by clicking the unsubscribe link in any email we send you or by contacting us directly.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Retention</h2>
        <p>
          We will retain your personal information only for as long as necessary to fulfill the purposes for which we collected it, including to satisfy any legal, accounting, or reporting requirements. If you unsubscribe, we will retain minimal information to record your request and avoid contacting you again.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Rights</h2>
        <p>Under GDPR, you have the following rights:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Right to access your personal data</li>
          <li>Right to rectification of inaccurate personal data</li>
          <li>Right to erasure ("right to be forgotten")</li>
          <li>Right to restriction of processing</li>
          <li>Right to data portability</li>
          <li>Right to object to processing</li>
          <li>Right not to be subject to automated decision-making</li>
        </ul>
        <p>
          To exercise any of these rights, please contact us using the details provided below.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Cookies</h2>
        <p>
          Our website uses cookies to enhance your browsing experience and to remember your cookie consent preferences. You can control cookies through your browser settings and our cookie consent banner.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage. Your data is stored in Supabase with appropriate security measures in place.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Third-Party Services</h2>
        <p>
          We use the following third-party services to process your data:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Supabase - for database storage</li>
          <li>Resend - for email delivery</li>
        </ul>
        <p>
          These services are GDPR-compliant and process data according to their respective privacy policies and our data processing agreements with them.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">10. International Transfers</h2>
        <p>
          Your personal data may be transferred to, and processed in, countries other than the country in which you are resident. These countries may have data protection laws that are different from the laws of your country. We ensure that appropriate safeguards are in place to protect your personal data.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">11. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time in response to changing legal, technical, or business developments. When we update our Privacy Policy, we will take appropriate measures to inform you, consistent with the significance of the changes we make.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">12. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or our data practices, please contact us at:
        </p>
        <p>
          Email: pj@dam-nielsen
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
