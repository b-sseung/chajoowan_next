/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://b-seung.github.io/commision-0003' : '', // production 일때 prefix 경로
  trailingSlash: true, // 빌드 시 폴더 구조 그대로 생성하도록
  images: { unoptimized: true },
};

export default nextConfig;
