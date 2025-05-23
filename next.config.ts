import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
 // config
 experimental: {
    serverComponentsExternalPackages: ['pdf-parse'],
 }
};
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
