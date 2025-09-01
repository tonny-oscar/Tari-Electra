export async function GET() {
  const manifest = {
    name: 'Tari Electra - Electrical Solutions',
    short_name: 'Tari Electra',
    description: 'Professional electrical solutions and sub-metering services',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16 32x32',
        type: 'image/x-icon',
      },
      {
        src: '/tari-logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  };

  return Response.json(manifest);
}