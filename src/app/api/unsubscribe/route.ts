import { NextRequest, NextResponse } from 'next/server';
import { unsubscribe, getSubscriberByToken, logConsent } from '@/lib/supabase';
import { sendUnsubscribeConfirmationEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    // Get token from query parameters
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.json({ error: 'Unsubscribe token is required' }, { status: 400 });
    }
    
    // Get subscriber by token
    const subscriber = await getSubscriberByToken(token);
    
    if (!subscriber.data) {
      return NextResponse.json({ error: 'Invalid unsubscribe token' }, { status: 400 });
    }
    
    // Check if already unsubscribed
    if (!subscriber.data.is_active) {
      return NextResponse.redirect(new URL('/unsubscribe?status=already', request.url));
    }
    
    // Get IP address and user agent for GDPR compliance
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Unsubscribe
    const result = await unsubscribe(token);
    
    if (result.error) {
      console.error('Error unsubscribing:', result.error);
      return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
    }
    
    // Log consent for GDPR compliance
    await logConsent(subscriber.data.id, 'unsubscribe', ip, userAgent);
    
    // Send unsubscribe confirmation email
    await sendUnsubscribeConfirmationEmail(
      subscriber.data.email,
      subscriber.data.first_name
    );
    
    // Redirect to unsubscribe confirmation page
    return NextResponse.redirect(new URL('/unsubscribe?status=success', request.url));
    
  } catch (error) {
    console.error('Error in unsubscribe API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
