## Why

metro is recommend to use with react-native, and integrate react-native out-of-box, but metro has some shortcomings:

- the official documents is too brief to understand, let alone to customized or optimize performance
- sometimes too slow
- can't split code
- without treeshaking
- can't optimize image
- ...

so, I usually look forward to one way to use webpack in react-native,yeh, it come true.

inspired by [repack](https://github.com/callstack/repack), I make some progress for more easy using and high speed.

# Intro

<p align="center">
A Webpack-based toolkit to build your React Native application with full support of Webpack ecosystem.
</p>

---

rn-fast-pack uses Webpack 5 and React Native CLI's plugin system to allow you to bundle your application using Webpack and allow to easily switch from Metro.

## Features

- [x] Webpack ecosystem, plugins and utilities
- [x] Build bundle for iOS, Android and out-of-tree platforms
- [x] Development server with support for:
  - Remote JS debugging
  - Source Map symbolication
  - Hot Module Replacement and React Refresh
  - Reloading application from CLI using `r` key
- [x] Built-in Hot Module Replacement + React Refresh support
- [x] Flipper support:
  - Crash Reporter,
  - Application logs
  - Layout
  - Network
  - Hermes debugger
  - React DevTools
  - Development server (debugging/verbose) logs
- [x] Hermes support:
  - Running the production/development bundle using Hermes engine
  - Transforming production bundle into bytecode bundle
  - Inspecting running Hermes engine with Flipper
- [x] [Code splitting]:
  - Dynamic `import()` support with and without `React.lazy()` (recommended).
  - Arbitrary scripts (only for advanced users).
- [x] Web Dashboard with compilation status, server logs and artifacts.

# Minimum requirements

```
react-native >= 0.62.0
Node >= 12
```

## Useage

```sh
yarn add -D rn-fast-pack
```

Add the following content to react-native.config.js (or create it if it doesn't exist):

```
module.exports = {
  commands: require('rn-fast-pack/commands')
};
```

open `project.pbxproj` and find `Bundle React Native code and images phase`, Add `export BUNDLE_COMMAND=webpack-bundle` to the phase.
After the change, the content of this phase should look similar to:

```sh
export NODE_BINARY=node
export BUNDLE_COMMAND=webpack-bundle
../node_modules/react-native/scripts/react-native-xcode.sh
```

open `android/app/build.gradle` and add bundleCommand: `webpack-bundle` to `project.ext.react`.

```
project.ext.react = [
    enableHermes: false,
    bundleCommand: "webpack-bundle"
]
```

then you can create one new webpack.config.js(optional)

```
// can be empty
module.exports = {}
```

everything is done. then you can use:

```sh
react-native webpack-start
# or
react-native webpack-bundle
```

if you want to use back to metro in case, you can set package.json scripts as blow:

```sh
"start:webpack": "react-native webpack-start",
"start:metro": "react-native start",
"bundle:metro:ios": "react-native bundle --entry-file index.ios.js --platform ios --dev false --bundle-output ./ios/main.jsbundle --assets-dest ./ios"
"bundle:webpack:ios": "react-native webpack-bundle --entry-file index.ios.js --platform ios --dev false --bundle-output ./ios/main.jsbundle --assets-dest ./ios"
```

# Attention

react-native 0.62 bundle name is index.android.bundle or index.ios.bundle, but from 0.63 has changed into index.bundle. you can customize it by setting webpack config:

```sh
react-native webpack-start --webpackPath ...
```

your webpack.config.js looks like:

```sh
module.exports = {
  output: {
    filename: `index.${platform}.bundle`, // index.bundle
  },
}
```

# Code splitting

rn-fast-pack use webpack splitchunks to split code as default:

```sh
splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    }
```

but you can customize as you need.

```sh
// StudentSide.js
import * as React from 'react';
import { View, Text } from 'react-native';

export default function StudentSide({ user }) {
  return (
    <View style={{ flex: 1 }}>
      <Text>Hello {user.name}!</Text>
      <Text>You are a student.</Text>
      {/* ...more student related code */}
    </View>
  )
}
```

```sh
// TeacherSide.js
import * as React from 'react';
import { View, Text } from 'react-native';

export default function TeacherSide({ user }) {
  return (
    <View style={{ flex: 1 }}>
      <Text>Hello {user.name}!</Text>
      <Text>You are a teacher.</Text>
      {/* ...more teacher related code */}
    </View>
  )
}
```

```sh
// Home.js
import * as React from 'react';
import { Text } from 'react-native';

const StudentSide = React.lazy(
  () => import(/* webpackChunkName: "student" */ './StudentSide.js')
);

const TeacherSide = React.lazy(
  () => import(/* webpackChunkName: "teacher" */ './TeacherSide.js')
);

export function Home({ user }) {
  const Side = React.useMemo(
    () => user.role === 'student'
      ? <StudentSide user={user} />
      : <TeacherSize user={user} />,
    [user]
  );

  return (
    <React.Suspense fallback={<Text>Loading...</Text>}>
      <Side />
    </React.Suspense>
  )
}
```

```sh
// index.js
import { AppRegistry } from 'react-native';
import { ChunkManager } from '@callstack/repack/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from './src/App'; // Your application's root component
import { name as appName } from './app.json';

ChunkManager.configure({
  storage: AsyncStorage, // optional
  resolveRemoteChunk: async (chunkId) => {
    // Feel free to use any kind of remote config solution to obtain
    // a base URL for the chunks, if you don't know where they will
    // be hosted.

    return {
      url: `http://my-domain.dev/${chunkId}`,
    };
  },
});

AppRegistry.registerComponent(appName, () => App);
```

## TodoList

- [ ] image optimize
- [ ] load babel
- [x] webpack plugin merge
- [ ] android optimize
- [ ] ios optimize
- [ ] local or remote chunk switch easily
- [ ] switch back to metro easily
- [ ] tar/zip replace resource
