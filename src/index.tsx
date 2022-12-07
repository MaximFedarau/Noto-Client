import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthStack, MainBottomTabs } from '@navigation';
import { RecordsManaging } from '@screens/RecordsManaging';
import { COLORS, FONTS } from '@constants';
import { NavigationName } from '@types';

const Stack = createNativeStackNavigator();

const Navigator: FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name={NavigationName.NOTES_OVERVIEW}
      component={MainBottomTabs}
    />
    <Stack.Screen
      name={NavigationName.RECORDS_MANAGING}
      component={RecordsManaging}
      options={{
        headerShown: true,
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerTintColor: COLORS.osloGray,
        headerTitleStyle: { fontFamily: FONTS.families.primary },
        headerStyle: { backgroundColor: COLORS.springWood },
        contentStyle: { backgroundColor: COLORS.springWood },
      }}
    />
    <Stack.Screen name={NavigationName.AUTH} component={AuthStack} />
  </Stack.Navigator>
);

export default Navigator;
