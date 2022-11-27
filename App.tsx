import React, { FC, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen';

import Navigator from './src';
import Loading from '@screens/Loading/Loading.screen';
import Error from '@screens/Error/Error.screen';
import { initDbDrafts } from '@utils';
import { store } from '@store/store';

preventAutoHideAsync();

const App: FC = () => {
  const [isSetupError, setIsSetupError] = React.useState(false);
  const [databaseInitialized, setDatabaseInitialized] = React.useState(false);
  const [fontsLoaded, fontsError] = useFonts({
    'Roboto-Regular': require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
  });

  const initDrafts = useCallback(async () => {
    try {
      await initDbDrafts();
    } catch (error) {
      setIsSetupError(true);
      console.error(error, 'App setup');
    } finally {
      setDatabaseInitialized(true); // anyway, db is initialized, so we show either app screen or error screen
    }
  }, []);

  useEffect(() => {
    initDrafts();
  }, []);

  useEffect(() => {
    if (fontsLoaded && databaseInitialized) hideAsync();
  }, [fontsLoaded, databaseInitialized]);

  if (!fontsLoaded) return <Loading />; // from Expo docs

  if (fontsError || isSetupError) return <Error />;

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
