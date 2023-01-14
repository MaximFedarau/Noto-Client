import React, { FC } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { deleteItemAsync } from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useDispatch, useSelector } from 'react-redux';

import { Notes, Drafts } from '@screens';
import { Avatar, IconButton, RightHeader } from '@components';
import { COLORS, FONTS, SIZES } from '@constants';
import { NavigationProps, NavigationName, NavigationNotesName } from '@types';
import {
  clearUser,
  userIsAuthSelector,
  userAvatarSelector,
  userNicknameSelector,
} from '@store/user';

const BottomTab = createBottomTabNavigator();

export const MainBottomTabs: FC = () => {
  const dispatch = useDispatch();
  const nickname = useSelector(userNicknameSelector);
  const avatar = useSelector(userAvatarSelector);
  const isAuth = useSelector(userIsAuthSelector);

  const navigation = useNavigation<NavigationProps>();

  const navigateToAuth = () => navigation.navigate(NavigationName.AUTH);

  const logOut = async () => {
    await deleteItemAsync('accessToken');
    await deleteItemAsync('refreshToken');
    dispatch(clearUser());
  };

  return (
    <BottomTab.Navigator
      screenOptions={{
        headerTintColor: COLORS.osloGray,
        headerTitleStyle: { fontFamily: FONTS.families.primary },
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: COLORS.springWood },
        headerShadowVisible: false,
        tabBarStyle: { backgroundColor: COLORS.springWood },
        tabBarActiveTintColor: COLORS.cyberYellow,
        tabBarShowLabel: false,
        headerRight: ({ tintColor }) => {
          return (
            <RightHeader>
              {avatar ? (
                <Avatar size={SIZES['4xl']} image={avatar} onPress={logOut} />
              ) : (
                <IconButton
                  iconName="person"
                  size={SIZES['4xl']}
                  color={isAuth ? COLORS.softBlue : tintColor}
                  onPress={isAuth ? logOut : navigateToAuth}
                />
              )}
            </RightHeader>
          );
        },
      }}
      sceneContainerStyle={{ backgroundColor: COLORS.springWood }}
    >
      <BottomTab.Screen
        name={NavigationNotesName.NOTES}
        component={Notes}
        options={{
          tabBarIcon: (props) => <Ionicons name="document" {...props} />,
          tabBarActiveTintColor: isAuth ? COLORS.softBlue : COLORS.cyberYellow,
          title: nickname ? `${nickname}'s Notes` : 'Notes',
        }}
      />
      <BottomTab.Screen
        name={NavigationNotesName.DRAFTS}
        component={Drafts}
        options={{
          tabBarIcon: (props) => <Ionicons name="archive" {...props} />,
          title: 'Drafts',
        }}
      />
    </BottomTab.Navigator>
  );
};
