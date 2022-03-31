import path from 'path';
import { Fallback } from '../../../types';
import { getPlatform } from './getPlatform';
import { getFallbackFromOptions } from './internal/getFallbackFromOptions';
import { parseCliOptions } from './internal/parseCliOptions';

const platform = getPlatform({
  //@ts-ignore
  fallback: process.env.PLATFORM,
});

export function getEntry(
  options: Fallback<string> = { fallback: `./index.${platform}.js` }
): string {
  const cliOptions = parseCliOptions();
  if (!cliOptions) {
    return getFallbackFromOptions(options);
  }

  if ('bundle' in cliOptions.arguments) {
    const { entryFile } = cliOptions.arguments.bundle;
    return path.isAbsolute(entryFile) || entryFile.startsWith('./')
      ? entryFile
      : `./${entryFile}`;
  } else {
    return getFallbackFromOptions(options);
  }
}
