const { webpack } = require("next/dist/compiled/webpack/webpack");
/** @type {import('next').NextConfig} */

// https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
const nextConfig = {
  // webpack: (config, context) => {
  //   if (config.plugins) {
  //     config.plugins.push(
  //       new context.webpack.IgnorePlugin({
  //         resourceRegExp: /^(lokijs|pino-pretty|encoding)$/,
  //       })
  //     );
  //   }
  //   return config;
  // },
  // webpack: (config, { isServer }) => {
  //   config.externals.push("pino-pretty", "lokijs", "encoding");
  //   if (!isServer) {
  //     config.resolve.fallback = {
  //       fs: false,
  //       net: false,
  //       tls: false,
  //     };
  //   }
  //   return config;
  // },
  webpack: (config, { isServer }) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          // fixes proxy-agent dependencies
          net: false,
          dns: false,
          tls: false,
          assert: false,
          // fixes next-i18next dependencies
          path: false,
          fs: false,
          // fixes mapbox dependencies
          events: false,
          // fixes sentry dependencies
          process: false,
        },
      };
    }
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, "");
      })
    );

    return config;
  },
};

module.exports = nextConfig;
