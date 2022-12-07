import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SignIn, SignUp, AvatarPicker } from '@screens';
import { NavigationAuthName } from '@types';
import { COLORS } from '@constants';

const Stack = createNativeStackNavigator();

export const AuthStack: FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: COLORS.springWood },
    }}
  >
    <Stack.Screen name={NavigationAuthName.SIGN_IN} component={SignIn} />
    <Stack.Screen name={NavigationAuthName.SIGN_UP} component={SignUp} />
    <Stack.Screen
      name={NavigationAuthName.AVATAR_PICKER}
      component={AvatarPicker}
    />
  </Stack.Navigator>
);
