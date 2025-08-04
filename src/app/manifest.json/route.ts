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
        src: '/LOGO_1.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };

  return Response.json(manifest);
}