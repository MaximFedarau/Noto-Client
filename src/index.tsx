import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthStack, MainBottomTabs } from '@navigation';
import { NotesManaging } from '@screens/NotesManaging';
import { OSLO_GRAY, SPRING_WOOD } from '@constants/colors';
import { NavigationName } from '@types';

const Stack = createNativeStackNavigator();

const Navigator: FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name={NavigationName.NOTES_OVERVIEW}
      component={MainBottomTabs}
    />
    <Stack.Screen
      name={NavigationName.NOTES_MANAGING}
      component={NotesManaging}
      options={{
        headerShown: true,
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerTintColor: OSLO_GRAY,
        headerTitleStyle: { fontFamily: 'Roboto-Regular' },
        headerStyle: { backgroundColor: SPRING_WOOD },
        contentStyle: { backgroundColor: SPRING_WOOD },
      }}
    />
    <Stack.Screen name={NavigationName.AUTH} component={AuthStack} />
  </Stack.Navigator>
);

export default Navigator;
