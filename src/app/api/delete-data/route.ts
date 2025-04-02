import { NextRequest, NextResponse } from 'next/server';
import { deleteSubscriber, getSubscriberByToken, logConsent } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get token from query parameters
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }
    
    // Get subscriber by token
    const subscriber = await getSubscriberByToken(token);
    
    if (!subscriber.data) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }
    
    // Get IP address and user agent for GDPR compliance
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Delete subscriber data
    const result = await deleteSubscriber(token);
    
    if (result.error) {
      console.error('Error deleting subscriber data:', result.error);
      return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
    }
    
    // Log consent for GDPR compliance
    await logConsent(subscriber.data.id, 'data_delete', ip, userAgent);
    
    // Redirect to deletion confirmation page
    return NextResponse.redirect(new URL('/unsubscribe?status=deleted', request.url));
    
  } catch (error) {
    console.error('Error in delete-data API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
