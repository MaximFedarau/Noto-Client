//Types
import { ReactElement } from 'react';

//Constants
import { NAVIGATION_AUTH_NAMES } from '@app-types/enum';
import { SPRING_WOOD } from '@constants/colors';

//Screens
import SignIn from '@screens/SignIn/SignIn.screen';

//React Navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function AuthStack(): ReactElement {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: SPRING_WOOD,
        },
      }}
    >
      <Stack.Screen name={NAVIGATION_AUTH_NAMES.SIGN_IN} component={SignIn} />
    </Stack.Navigator>
  );
}
