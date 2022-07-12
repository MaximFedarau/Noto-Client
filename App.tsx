//Types
import React, { ReactElement } from 'react';

//Constants
import { NAVIGATION_NAMES } from './constants/data';

//Expo
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';

//Navigation
import MainBottomTabs from './navigation/MainBottomTabs/MainBottomTabs.navigation';

//React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App(): ReactElement | null {
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name={NAVIGATION_NAMES.NOTES_OVERVIEW}
            component={MainBottomTabs}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
