import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Servimos las imágenes remotas sin pasar por el optimizador de Next
    // (/\_next/image). Esto evita errores 400 en producción cuando el
    // backend que sirve las fotos tiene CORS, latencia o respuestas
    // lentas. Trade-off: no hay conversión automática a WebP/AVIF ni
    // resize en el edge — el navegador recibe la imagen tal cual sale
    // del origen.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com", pathname: "/**" },
      { protocol: "https", hostname: "mildeseosapp.s3.amazonaws.com", pathname: "/**" },
      { protocol: "https", hostname: "static.wixstatic.com", pathname: "/**" },
      { protocol: "https", hostname: "st2.depositphotos.com", pathname: "/**" },
      { protocol: "https", hostname: "edificacionesdinamicas.com", pathname: "/**" },
      { protocol: "https", hostname: "videocdn.cdnpk.net", pathname: "/**" },
    ],
  },
};

export default nextConfig;
