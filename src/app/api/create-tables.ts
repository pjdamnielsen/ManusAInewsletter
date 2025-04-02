import { createClient } from '@supabase/supabase-js';

// This script is for creating the necessary tables in Supabase
// It should be run once to set up the database structure

export async function createTables() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Create subscribers table
  const createSubscribersTable = await supabase.rpc('execute_sql', {
    sql: `
    CREATE TABLE IF NOT EXISTS subscribers (
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
    `
  });

  if (createSubscribersTable.error) {
    console.error('Error creating subscribers table:', createSubscribersTable.error);
    return { success: false, error: createSubscribersTable.error };
  }

  // Create consent_logs table
  const createConsentLogsTable = await supabase.rpc('execute_sql', {
    sql: `
    CREATE TABLE IF NOT EXISTS consent_logs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      subscriber_id UUID REFERENCES subscribers(id) ON DELETE CASCADE,
      action TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    `
  });

  if (createConsentLogsTable.error) {
    console.error('Error creating consent_logs table:', createConsentLogsTable.error);
    return { success: false, error: createConsentLogsTable.error };
  }

  // Enable RLS
  const enableRLS = await supabase.rpc('execute_sql', {
    sql: `
    ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
    ALTER TABLE consent_logs ENABLE ROW LEVEL SECURITY;
    `
  });

  if (enableRLS.error) {
    console.error('Error enabling RLS:', enableRLS.error);
    return { success: false, error: enableRLS.error };
  }

  // Create policies
  const createPolicies = await supabase.rpc('execute_sql', {
    sql: `
    -- Policy for subscribers table
    CREATE POLICY IF NOT EXISTS "Public can insert their own subscriber data" ON subscribers
      FOR INSERT WITH CHECK (true);
      
    CREATE POLICY IF NOT EXISTS "Subscribers can view their own data" ON subscribers
      FOR SELECT USING (verification_token::text = current_setting('request.jwt.claims', true)::json->>'verification_token');
      
    CREATE POLICY IF NOT EXISTS "Subscribers can update their own data" ON subscribers
      FOR UPDATE USING (verification_token::text = current_setting('request.jwt.claims', true)::json->>'verification_token');
      
    CREATE POLICY IF NOT EXISTS "Subscribers can delete their own data" ON subscribers
      FOR DELETE USING (verification_token::text = current_setting('request.jwt.claims', true)::json->>'verification_token');

    -- Policy for consent_logs table
    CREATE POLICY IF NOT EXISTS "Public can insert consent logs" ON consent_logs
      FOR INSERT WITH CHECK (true);
      
    CREATE POLICY IF NOT EXISTS "Subscribers can view their own consent logs" ON consent_logs
      FOR SELECT USING (subscriber_id IN (
        SELECT id FROM subscribers WHERE verification_token::text = current_setting('request.jwt.claims', true)::json->>'verification_token'
      ));
    `
  });

  if (createPolicies.error) {
    console.error('Error creating policies:', createPolicies.error);
    return { success: false, error: createPolicies.error };
  }

  return { success: true };
}
