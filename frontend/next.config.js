/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.spoonacular.com', // << Novo domínio autorizado
        port: '',
        pathname: '/recipes/**',
      },
    ],
  },
};

module.exports = nextConfig;

