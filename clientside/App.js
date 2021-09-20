
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigation from './navigations/app.navigation';

import AppContext from './context/App.Context';

const App = () => {

  return (
    <SafeAreaProvider>
      <AppContext>
        <AppNavigation />
      </AppContext>
    </SafeAreaProvider>
  );
};


export default App;
