const { mergeWithCustomize } = require('webpack-merge');
const _ = require('lodash');

export function getWebpackConfig(webpackOutterConfigPath: string) {
  const webpackInternalConfig = require('../../webpack.internal.config');
  if (!webpackOutterConfigPath) {
    return webpackInternalConfig;
  }
  const webpackOutterConfig = require(webpackOutterConfigPath);

  const mergedConfig = mergeWithCustomize({
    //@ts-ignore
    customizeArray: (a, b) => {
      return _.uniq([...a, ...b]);
    },
  })(webpackInternalConfig, webpackOutterConfig);

  return webpackOutterConfigPath ? mergedConfig : webpackInternalConfig;
}
