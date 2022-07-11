//Types
import React, { ReactElement } from 'react';

//Constants
import { OSLO_GRAY, SPRING_WOOD } from './constants/colors';

//Expo
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

//React Native
import { Text } from 'react-native';

//React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const Test = () => <Text>1</Text>;

export default function App(): ReactElement | null {
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTitleAlign: 'center',
            headerTintColor: OSLO_GRAY,
            headerTitleStyle: {
              fontFamily: 'Roboto-Regular',
            },
            headerStyle: { backgroundColor: SPRING_WOOD },
            headerShadowVisible: false,
            headerRight: ({ tintColor }) => {
              return <Ionicons name="person" color={tintColor} size={24} />;
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={Test}
            options={{ title: 'Notes' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
