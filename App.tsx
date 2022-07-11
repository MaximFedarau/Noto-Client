//Types
import React, { ReactElement } from 'react';

//Constants
import { OSLO_GRAY, SPRING_WOOD, CYBER_YELLOW } from './constants/colors';
import { NAVIGATION_NAMES } from './constants/data';

//Expo
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

//React Native
import { Text } from 'react-native';

//React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

const AllNotes = () => <Text>All Notes</Text>;
const Drafts = () => <Text>Drafts</Text>;

function BottomTabApp(): ReactElement {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerTintColor: OSLO_GRAY,
        headerTitleStyle: {
          fontFamily: 'Roboto-Regular',
        },
        headerStyle: { backgroundColor: SPRING_WOOD },
        headerShadowVisible: false,
        headerRight: ({ tintColor }) => {
          return (
            <Ionicons
              style={{ marginRight: 12 }}
              name="person"
              color={tintColor}
              size={24}
            />
          );
        },
        tabBarStyle: { backgroundColor: SPRING_WOOD, justifyContent: 'center' },
        tabBarActiveTintColor: CYBER_YELLOW,
      }}
      sceneContainerStyle={{
        backgroundColor: SPRING_WOOD,
      }}
    >
      <BottomTab.Screen
        name={NAVIGATION_NAMES.NOTES}
        component={AllNotes}
        options={{
          tabBarIcon: ({ color }) => {
            return <Ionicons name="document" size={32} color={color} />;
          },
          tabBarLabel: () => null,
          title: 'Notes',
        }}
      />
      <BottomTab.Screen
        name={NAVIGATION_NAMES.DRAFTS}
        component={Drafts}
        options={{
          tabBarIcon: ({ color }) => {
            return <Ionicons name="archive" size={32} color={color} />;
          },
          tabBarLabel: () => null,
          title: 'Drafts',
        }}
      />
    </BottomTab.Navigator>
  );
}

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
            component={BottomTabApp}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
