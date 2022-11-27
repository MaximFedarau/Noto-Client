module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@components': './src/components',
            '@constants': './src/constants',
            '@screens': './src/screens',
            '@assets': './assets',
            '@navigation': './src/navigation',
            '@types': './src/types',
            '@utils': './src/utils',
            '@store': './src/store',
          },
        },
      ],
      [
        'transform-inline-environment-variables',
        {
          include: ['API_URL'],
        },
      ],
    ],
  };
};
