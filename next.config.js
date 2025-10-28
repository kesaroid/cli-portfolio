/**
 * Keep legacy icon URLs working after moving to /icons.
 */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/favicon.ico', destination: '/icons/favicon.ico' },
      { source: '/favicon-16x16.png', destination: '/icons/favicon-16x16.png' },
      { source: '/favicon-32x32.png', destination: '/icons/favicon-32x32.png' },
      { source: '/favicon-96x96.png', destination: '/icons/favicon-96x96.png' },
      { source: '/manifest.json', destination: '/icons/manifest.json' },
      { source: '/browserconfig.xml', destination: '/icons/browserconfig.xml' },
      { source: '/robots.txt', destination: '/icons/robots.txt' },
      { source: '/apple-icon.png', destination: '/icons/apple-icon.png' },
      { source: '/apple-icon-precomposed.png', destination: '/icons/apple-icon-precomposed.png' },
      { source: '/apple-icon-57x57.png', destination: '/icons/apple-icon-57x57.png' },
      { source: '/apple-icon-60x60.png', destination: '/icons/apple-icon-60x60.png' },
      { source: '/apple-icon-72x72.png', destination: '/icons/apple-icon-72x72.png' },
      { source: '/apple-icon-76x76.png', destination: '/icons/apple-icon-76x76.png' },
      { source: '/apple-icon-114x114.png', destination: '/icons/apple-icon-114x114.png' },
      { source: '/apple-icon-120x120.png', destination: '/icons/apple-icon-120x120.png' },
      { source: '/apple-icon-144x144.png', destination: '/icons/apple-icon-144x144.png' },
      { source: '/apple-icon-152x152.png', destination: '/icons/apple-icon-152x152.png' },
      { source: '/apple-icon-180x180.png', destination: '/icons/apple-icon-180x180.png' },
      { source: '/android-icon-36x36.png', destination: '/icons/android-icon-36x36.png' },
      { source: '/android-icon-48x48.png', destination: '/icons/android-icon-48x48.png' },
      { source: '/android-icon-72x72.png', destination: '/icons/android-icon-72x72.png' },
      { source: '/android-icon-96x96.png', destination: '/icons/android-icon-96x96.png' },
      { source: '/android-icon-144x144.png', destination: '/icons/android-icon-144x144.png' },
      { source: '/android-icon-192x192.png', destination: '/icons/android-icon-192x192.png' },
      { source: '/ms-icon-70x70.png', destination: '/icons/ms-icon-70x70.png' },
      { source: '/ms-icon-144x144.png', destination: '/icons/ms-icon-144x144.png' },
      { source: '/ms-icon-150x150.png', destination: '/icons/ms-icon-150x150.png' },
      { source: '/ms-icon-310x310.png', destination: '/icons/ms-icon-310x310.png' },
    ];
  },
};

module.exports = nextConfig;
