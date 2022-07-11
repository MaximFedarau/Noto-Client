//Types
import { ReactElement } from 'react';

//Constants
import { OSLO_GRAY } from './constants/colors';

//Expo
import { StatusBar } from 'expo-status-bar';

//React Native
import { StyleSheet, Text, View } from 'react-native';

//React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const Test = () => <Text>1</Text>;

export default function App(): ReactElement {
  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTitleAlign: 'center',
            headerTintColor: OSLO_GRAY,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
