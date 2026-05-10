/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  // Required for S3+CloudFront with OAC: emits each route as <route>/index.html
  // so CloudFront's default-root-object resolution works without URL rewrites.
  trailingSlash: true,

  images: {
    unoptimized: true,
  },

  reactStrictMode: true,
};

export default nextConfig;
