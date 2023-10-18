/** @type {import('next').NextConfig} */

// https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
const nextConfig = {
  webpack: (config, context) => {
    if (config.plugins) {
      config.plugins.push(
        new context.webpack.IgnorePlugin({
          resourceRegExp: /^(lokijs|pino-pretty|encoding)$/,
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig;
