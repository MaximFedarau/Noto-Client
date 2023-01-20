import React, { FC } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';

import { Notes, Drafts } from '@screens';
import { COLORS } from '@constants';
import { NavigationNotesName } from '@types';
import { userIsAuthSelector } from '@store/user';

const BottomTab = createBottomTabNavigator();

export const MainBottomTabs: FC = () => {
  const isAuth = useSelector(userIsAuthSelector);

  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: COLORS.springWood },
        tabBarActiveTintColor: COLORS.cyberYellow,
        tabBarShowLabel: false,
        headerShown: false,
      }}
      sceneContainerStyle={{ backgroundColor: COLORS.springWood }}
    >
      <BottomTab.Screen
        name={NavigationNotesName.NOTES}
        component={Notes}
        options={{
          tabBarIcon: (props) => <Ionicons name="document" {...props} />,
          tabBarActiveTintColor: isAuth ? COLORS.softBlue : COLORS.cyberYellow,
        }}
      />
      <BottomTab.Screen
        name={NavigationNotesName.DRAFTS}
        component={Drafts}
        options={{
          tabBarIcon: (props) => <Ionicons name="archive" {...props} />,
        }}
      />
    </BottomTab.Navigator>
  );
};
