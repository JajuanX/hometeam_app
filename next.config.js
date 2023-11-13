/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    images: {
		domains: ['firebasestorage.googleapis.com', 'lh3.googleusercontent.com', 'graph.facebook.com'],
	}
}

module.exports = nextConfig
