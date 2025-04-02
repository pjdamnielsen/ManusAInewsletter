import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber, getSubscriberByEmail, logConsent } from '@/lib/supabase';
import { sendConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, consent } = await request.json();
    
    // Validate input
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    if (!consent) {
      return NextResponse.json({ error: 'Consent is required' }, { status: 400 });
    }
    
    // Check if subscriber already exists
    const existingSubscriber = await getSubscriberByEmail(email);
    
    if (existingSubscriber.data) {
      return NextResponse.json({ error: 'Email is already subscribed' }, { status: 400 });
    }
    
    // Get IP address and user agent for GDPR compliance
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Add subscriber to database
    const result = await addSubscriber(email, firstName, lastName);
    
    if (result.error) {
      console.error('Error adding subscriber:', result.error);
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }
    
    // Log consent for GDPR compliance
    if (result.data && result.data[0]) {
      await logConsent(result.data[0].id, 'subscribe', ip, userAgent);
    }
    
    // Send confirmation email
    if (result.data && result.data[0]) {
      const emailResult = await sendConfirmationEmail(
        email,
        firstName,
        result.data[0].verification_token
      );
      
      if (!emailResult.success) {
        console.error('Error sending confirmation email:', emailResult.error);
        // We don't want to fail the subscription if email fails, just log it
      }
    }
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Subscription successful. Please check your email to confirm your subscription.',
      data: {
        email,
        firstName,
        lastName,
        subscriberId: result.data?.[0]?.id,
      }
    });
    
  } catch (error) {
    console.error('Error in subscribe API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
