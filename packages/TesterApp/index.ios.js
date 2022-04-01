import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppRegistry } from 'react-native';
import { ChunkManager } from 'rn-fast-pack/client';
import { name as appName } from './app.json';
import App from './src/App';

ChunkManager.configure({
  storage: AsyncStorage,
  resolveRemoteChunk: async (chunkId) => {
    return {
      url: `http://localhost:5000/${chunkId}`,
    };
  },
});

AppRegistry.registerComponent(appName, () => App);
