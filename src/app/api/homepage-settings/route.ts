import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return default homepage settings
    return NextResponse.json({
      heroImageUrl: '',
      heroImageHint: '',
    });
    
  } catch (error) {
    console.error('Error fetching homepage settings:', error);
    
    return NextResponse.json({
      heroImageUrl: '',
      heroImageHint: '',
    });
  }
}