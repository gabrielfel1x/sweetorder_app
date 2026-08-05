import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-6c6725674d9e493b9e62fa70cc59fd66.r2.dev",
      },
    ],
    // Cota de otimização de imagem do Vercel esgotada (retornando 402 Payment
    // Required em /_next/image para o site inteiro). Sem isso, nenhuma imagem
    // remota (logo ou produto) carrega em produção até o reset da cota/upgrade
    // do plano. As imagens do R2 já são servidas via HTTPS, então não há perda
    // de segurança, só perde o resize/reencode automático do Vercel.
    unoptimized: true,
  },
};

export default nextConfig;
