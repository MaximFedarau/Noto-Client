import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainBottomTabs from '@navigation/MainBottomTabs/MainBottomTabs.navigation';
import AuthStack from '@navigation/AuthStack/AuthStack.navigation';
import NotesManaging from '@screens/NotesManaging/NotesManaging.screen';
import { OSLO_GRAY, SPRING_WOOD } from '@constants/colors';
import { NAVIGATION_NAMES } from '@app-types/enum';

const Stack = createNativeStackNavigator();

const Navigator: FC = () => (
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
);

export default Navigator;
