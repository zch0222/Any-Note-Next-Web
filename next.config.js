const {join} = require("path");
/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript:{
      ignoreBuildErrors:true
    },
    eslint:{
        ignoreDuringBuilds:true
    },
    swcMinify: true,
    async redirects() {
        return [
            {
                source: '/',
                destination: '/about',
                permanent: true,
            },
        ]
    },
    sassOptions: {
        includePaths: [join(__dirname, 'styles')],
    },
    async rewrites() {
        return [
            {
                source: '/proxy',
                destination: 'http://111.229.158.174:8089',
            },
        ]
    },
    // output: 'export',
}

module.exports = nextConfig
