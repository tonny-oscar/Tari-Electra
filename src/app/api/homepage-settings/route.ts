import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const doc = await adminDb.collection('homepageSettings').doc('main').get();
    
    if (doc.exists) {
      return NextResponse.json(doc.data());
    }
    
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