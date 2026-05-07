import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignoramos errores de ESLint durante el build para que despliegue con éxito
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignoramos errores de TypeScript durante el build
    ignoreBuildErrors: true,
  },
  images: {
    // Para desarrollo local con Strapi, a veces Next.js bloquea IPs privadas.
    // Si tienes problemas visualizando imágenes en local, puedes usar unoptimized: true.
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
