import { createClient } from '@supabase/supabase-js';

// SQL script to create tables in Supabase
/*
-- Create subscribers table
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  consent_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  verification_token UUID DEFAULT uuid_generate_v4(),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create consent_logs table to track GDPR consent
CREATE TABLE consent_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscriber_id UUID REFERENCES subscribers(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'subscribe', 'unsubscribe', 'data_request', 'data_delete'
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_logs ENABLE ROW LEVEL SECURITY;

-- Policy for subscribers table
CREATE POLICY "Public can insert their own subscriber data" ON subscribers
  FOR INSERT WITH CHECK (true);
  
CREATE POLICY "Subscribers can view their own data" ON subscribers
  FOR SELECT USING (verification_token = current_setting('request.jwt.claims')::json->>'verification_token');
  
CREATE POLICY "Subscribers can update their own data" ON subscribers
  FOR UPDATE USING (verification_token = current_setting('request.jwt.claims')::json->>'verification_token');
  
CREATE POLICY "Subscribers can delete their own data" ON subscribers
  FOR DELETE USING (verification_token = current_setting('request.jwt.claims')::json->>'verification_token');

-- Policy for consent_logs table
CREATE POLICY "Public can insert consent logs" ON consent_logs
  FOR INSERT WITH CHECK (true);
  
CREATE POLICY "Subscribers can view their own consent logs" ON consent_logs
  FOR SELECT USING (subscriber_id IN (
    SELECT id FROM subscribers WHERE verification_token = current_setting('request.jwt.claims')::json->>'verification_token'
  ));
*/

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for subscriber management
export async function addSubscriber(email: string, firstName?: string, lastName?: string) {
  const { data, error } = await supabase
    .from('subscribers')
    .insert([
      { 
        email, 
        first_name: firstName, 
        last_name: lastName,
      }
    ])
    .select();
  
  return { data, error };
}

export async function verifySubscriber(token: string) {
  const { data, error } = await supabase
    .from('subscribers')
    .update({ verified: true })
    .match({ verification_token: token })
    .select();
  
  return { data, error };
}

export async function unsubscribe(token: string) {
  const { data, error } = await supabase
    .from('subscribers')
    .update({ is_active: false })
    .match({ verification_token: token })
    .select();
  
  return { data, error };
}

export async function deleteSubscriber(token: string) {
  const { data, error } = await supabase
    .from('subscribers')
    .delete()
    .match({ verification_token: token });
  
  return { data, error };
}

export async function logConsent(subscriberId: string, action: string, ipAddress?: string, userAgent?: string) {
  const { data, error } = await supabase
    .from('consent_logs')
    .insert([
      { 
        subscriber_id: subscriberId, 
        action,
        ip_address: ipAddress,
        user_agent: userAgent
      }
    ]);
  
  return { data, error };
}

export async function getSubscriberByEmail(email: string) {
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .eq('email', email)
    .single();
  
  return { data, error };
}

export async function getSubscriberByToken(token: string) {
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .eq('verification_token', token)
    .single();
  
  return { data, error };
}
