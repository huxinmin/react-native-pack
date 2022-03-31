import webpack from 'webpack';
import { getWebpackConfig } from '../commands/utils/getWebpackConfig';

const webpackConfigOutterPath = process.argv[2];
const webpackConfig = getWebpackConfig(
  webpackConfigOutterPath
) as webpack.Configuration;
const watchOptions = webpackConfig.watchOptions ?? {};
const compiler = webpack(webpackConfig);

compiler.hooks.watchRun.tap('compilerWorker', () => {
  process.send?.({ event: 'watchRun' });
});

compiler.watch(watchOptions, (error) => {
  if (error) {
    console.error(error);
    process.exit(2);
  }
});
