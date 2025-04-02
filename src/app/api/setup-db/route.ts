import { NextRequest, NextResponse } from 'next/server';
import { createTables } from './create-tables';

export async function GET(request: NextRequest) {
  try {
    const result = await createTables();
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Database tables created successfully' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error creating tables:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create database tables' 
    }, { status: 500 });
  }
}
