import React, { FC, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getItemAsync, deleteItemAsync } from 'expo-secure-store';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useDispatch, useSelector } from 'react-redux';

import { Loading, Notes, Drafts } from '@screens';
import { Avatar, IconButton, RightHeader } from '@components';
import { COLORS, FONTS, SIZES } from '@constants';
import { NavigationProps, NavigationName, NavigationNotesName } from '@types';
import { getPublicData } from '@utils';
import {
  setProfile,
  setIsAuth,
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
  const focus = useIsFocused();

  const [isLoading, setIsLoading] = useState(true);

  const navigateToAuth = () => {
    navigation.navigate(NavigationName.AUTH);
  };

  const logOut = async () => {
    await deleteItemAsync('accessToken');
    await deleteItemAsync('refreshToken');
    dispatch(setIsAuth(false));
    dispatch(clearUser());
  };

  const checkIsAuth = async () => {
    try {
      const accessToken = await getItemAsync('accessToken');
      const refreshToken = await getItemAsync('refreshToken');
      if (accessToken && refreshToken) {
        const data = await getPublicData();
        dispatch(setIsAuth(data ? true : false));
        dispatch(data ? setProfile(data) : clearUser());
      } else {
        dispatch(setIsAuth(false));
        dispatch(clearUser());
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (focus) checkIsAuth();
    else setIsLoading(false);
  }, [focus]);

  if (isLoading) return <Loading />;

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
