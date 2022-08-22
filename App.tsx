import React, { ReactElement } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import MainBottomTabs from '@navigation/MainBottomTabs/MainBottomTabs.navigation';
import AuthStack from '@navigation/AuthStack/AuthStack.navigation';
import NotesManaging from '@screens/NotesManaging/NotesManaging.screen';
import Error from '@screens/Error/Error.screen';
import { initDbDrafts } from '@utils/db/drafts/init';
import { store } from '@store/store';
import { NAVIGATION_NAMES } from '@app-types/enum';
import { OSLO_GRAY, SPRING_WOOD } from '@constants/colors';

const Stack = createNativeStackNavigator();

export default function App(): ReactElement | null {
  const [isSetupError, setIsSetupError] = React.useState<boolean>(false);

  React.useEffect(() => {
    initDbDrafts()
      .then((message) => {
        setIsSetupError(false);
        console.info(message);
      })
      .catch((error) => {
        console.error(error, 'App setup');
        setIsSetupError(true);
      });
  }, []);

  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
  });

  if (!fontsLoaded) return null;

  if (isSetupError) return <Error />;

  return (
    <>
      <StatusBar style="dark" animated />
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen
              name={NAVIGATION_NAMES.NOTES_OVERVIEW}
              component={MainBottomTabs}
            />
            <Stack.Screen
              name={NAVIGATION_NAMES.NOTES_MANAGING}
              component={NotesManaging}
              options={{
                headerShown: true,
                headerShadowVisible: false,
                headerTitleAlign: 'center',
                headerTintColor: OSLO_GRAY,
                headerTitleStyle: {
                  fontFamily: 'Roboto-Regular',
                },
                headerStyle: { backgroundColor: SPRING_WOOD },
                contentStyle: { backgroundColor: SPRING_WOOD },
              }}
            />
            <Stack.Screen name={NAVIGATION_NAMES.AUTH} component={AuthStack} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
      <Toast />
    </>
  );
}
