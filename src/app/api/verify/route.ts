import { NextRequest, NextResponse } from 'next/server';
import { verifySubscriber, getSubscriberByToken } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get token from query parameters
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.json({ error: 'Verification token is required' }, { status: 400 });
    }
    
    // Get subscriber by token
    const subscriber = await getSubscriberByToken(token);
    
    if (!subscriber.data) {
      return NextResponse.json({ error: 'Invalid verification token' }, { status: 400 });
    }
    
    // Check if already verified
    if (subscriber.data.verified) {
      return NextResponse.redirect(new URL('/?verified=already', request.url));
    }
    
    // Verify subscriber
    const result = await verifySubscriber(token);
    
    if (result.error) {
      console.error('Error verifying subscriber:', result.error);
      return NextResponse.json({ error: 'Failed to verify subscription' }, { status: 500 });
    }
    
    // Redirect to success page
    return NextResponse.redirect(new URL('/?verified=success', request.url));
    
  } catch (error) {
    console.error('Error in verify API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
