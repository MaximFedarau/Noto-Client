module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@components': './components',
            '@constants': './constants',
            '@screens': './screens',
            '@assets': './assets',
            '@navigation': './navigation',
            '@app-types': './types',
            '@utils': './utils',
          },
        },
      ],
    ],
  };
};
