export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.redirect(new URL('/admin/document-preview', 'http://localhost:3000'));
}
