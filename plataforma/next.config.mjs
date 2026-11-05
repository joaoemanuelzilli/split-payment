/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@electric-sql/pglite'],
  outputFileTracingIncludes: { '/**': ['./data/base-nichos-split.json'] },
  poweredByHeader: false,
};
export default nextConfig;
