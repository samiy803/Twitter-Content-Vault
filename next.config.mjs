/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['sequelize'],
    },
    webpack: (config) => {
        config.externals.push("cozo-node")
        return config;
    },
};

export default nextConfig;
