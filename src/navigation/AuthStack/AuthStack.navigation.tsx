import { ReactElement } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignIn from '@screens/SignIn/SignIn.screen';
import SignUp from '@screens/SignUp/SignUp.screen';
import AvatarPicker from '@screens/AvatarPicker/AvatarPicker.screen';
import { NAVIGATION_AUTH_NAMES } from '@app-types/enum';
import { SPRING_WOOD } from '@constants/colors';

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
      <Stack.Screen name={NAVIGATION_AUTH_NAMES.SIGN_UP} component={SignUp} />
      <Stack.Screen
        name={NAVIGATION_AUTH_NAMES.AVATAR_PICKER}
        component={AvatarPicker}
      />
    </Stack.Navigator>
  );
}
