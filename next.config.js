const {join} = require("path");
/** @type {import('next').NextConfig} */
const nextConfig = {
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
}

module.exports = nextConfig
