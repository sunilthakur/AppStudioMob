import React from 'react';
// import { Provider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import App from './src';
import { theme } from './src/core/theme';

const Main = () => (
  <SafeAreaProvider theme={theme}>
    <App />
  </SafeAreaProvider>
);

export default Main;

