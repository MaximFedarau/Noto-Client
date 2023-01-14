import React, { FC, useEffect, useState, PropsWithChildren } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen';
import { ThemeProvider } from 'styled-components/native';

import Navigator from './src';
import { Loading, Error } from '@screens';
import { initDbDrafts } from '@utils';
import { THEME } from '@constants';
import { store } from '@store';

const ThemeContainer: FC<PropsWithChildren> = ({ children }) => (
  <ThemeProvider theme={THEME}>{children}</ThemeProvider>
);

preventAutoHideAsync();

const App: FC = () => {
  const [isSetupError, setIsSetupError] = useState(false);
  const [databaseInitialized, setDatabaseInitialized] = useState(false);
  const [fontsLoaded, fontsError] = useFonts({
    'Roboto-Regular': require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
  });

  const initDrafts = async () => {
    try {
      await initDbDrafts();
    } catch (error) {
      setIsSetupError(true);
      console.error(error, 'App setup');
    } finally {
      setDatabaseInitialized(true); // anyway, db is initialized, so we show either app screen or error screen
    }
  };

  useEffect(() => {
    initDrafts();
  }, []);

  useEffect(() => {
    if (fontsLoaded && databaseInitialized) hideAsync();
  }, [fontsLoaded, databaseInitialized]);

  if (fontsError || isSetupError)
    return (
      <ThemeContainer>
        <Error />
      </ThemeContainer>
    );

  return (
    <>
      <StatusBar style="dark" animated />
      <Provider store={store}>
        <NavigationContainer>
          <ThemeContainer>
            {fontsLoaded ? <Navigator /> : <Loading />}
          </ThemeContainer>
        </NavigationContainer>
      </Provider>
      <Toast />
    </>
  );
};

export default App;
