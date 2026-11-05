/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['better-sqlite3'],
  outputFileTracingIncludes: { '/**': ['./data/base-nichos-split.json'] },
  poweredByHeader: false,
};
export default nextConfig;
