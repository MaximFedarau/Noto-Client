//Types
import React, { ReactElement } from 'react';
import { NAVIGATION_NAMES } from '@app-types/enum';

//Constants
import { initDbDrafts } from '@utils/db/drafts/init';

//Expo
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';

//Navigation
import MainBottomTabs from '@navigation/MainBottomTabs/MainBottomTabs.navigation';

//Screens
import Error from '@screens/Error/Error.screen';

//React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
