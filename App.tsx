import React, { FC, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen';
import Toast from 'react-native-toast-message';

import Navigator from './src';
import Error from '@screens/Error/Error.screen';
import { initDbDrafts } from '@utils';
import { store } from '@store/store';

/* App initialization order
1) preventAutoHideAsync()
2) useFonts()
3) useEffect() with database initialization
4) useEffect() with fonts
5) hideAsync()
*/

preventAutoHideAsync();

const App: FC = () => {
  const [isSetupError, setIsSetupError] = React.useState(false);
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
  });

  const initDrafts = useCallback(async () => {
    try {
      await initDbDrafts();
    } catch (error) {
      setIsSetupError(true);
      console.error(error, 'App setup');
    }
  }, []);

  const fontsLoadingHandler = useCallback(async () => {
    if (fontsLoaded) await hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    initDrafts();
  }, []);

  useEffect(() => {
    fontsLoadingHandler();
  }, [fontsLoaded]);

  if (!fontsLoaded || isSetupError) return <Error />;

  return (
    <>
      <StatusBar style="dark" animated />
      <Provider store={store}>
        <NavigationContainer>
          <Navigator />
        </NavigationContainer>
      </Provider>
      <Toast />
    </>
  );
};

export default App;
