const withTM = require('next-transpile-modules')(['gsap', 'react-timezone-select']);

module.exports = withTM({
	webpack(config) {
		config.module.rules.push({
			test: /\.(jpg|gif|svg|eot|ttf|woff|woff2)$/,
			use: ['@svgr/webpack'],
		});
		return config;
	},
});

module.exports = {
    images: {
        domains: ['images.unsplash.com'],
    },
}
