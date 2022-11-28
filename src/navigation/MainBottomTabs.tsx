import React, { FC, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '@screens/Loading/Loading.screen';
import Notes from '@screens/Notes/Notes.screen';
import Drafts from '@screens/Drafts/Drafts.screen';
import IconButton from '@components/Default/IconButton/IconButton.component';
import Avatar from '@components/Navigation/Avatar/Avatar.component';
import { RightHeaderView } from '@components/Default/View/View.component';
import {
  OSLO_GRAY,
  SPRING_WOOD,
  CYBER_YELLOW,
  SOFT_BLUE,
} from '@constants/colors';
import { sizes } from '@constants/sizes';
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

  const [isLoading, setIsLoading] = React.useState(true);

  const navigateToAuth = () => {
    navigation.navigate(NavigationName.AUTH);
  };

  const logOut = async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    dispatch(setIsAuth(false));
    dispatch(clearUser());
  };

  const checkIsAuth = async () => {
    const accessToken = await SecureStore.getItemAsync('accessToken');
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    if (accessToken && refreshToken) {
      const data = await getPublicData();
      dispatch(setIsAuth(data ? true : false));
      dispatch(data ? setProfile(data) : clearUser());
    } else {
      dispatch(setIsAuth(false));
      dispatch(clearUser());
    }
  };

  useEffect(() => {
    if (focus) {
      try {
        checkIsAuth();
      } finally {
        setIsLoading(false);
      }
    } else setIsLoading(false);
  }, [focus]);

  if (isLoading) return <Loading />;

  return (
    <BottomTab.Navigator
      screenOptions={{
        headerTintColor: OSLO_GRAY,
        headerTitleStyle: { fontFamily: 'Roboto-Regular' },
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: SPRING_WOOD },
        headerShadowVisible: false,
        tabBarStyle: { backgroundColor: SPRING_WOOD },
        tabBarActiveTintColor: CYBER_YELLOW,
        tabBarShowLabel: false,
      }}
      sceneContainerStyle={{ backgroundColor: SPRING_WOOD }}
    >
      <BottomTab.Screen
        name={NavigationNotesName.NOTES}
        component={Notes}
        options={{
          tabBarIcon: (props) => <Ionicons name="document" {...props} />,
          headerRight: ({ tintColor }) => {
            return (
              <RightHeaderView>
                {avatar ? (
                  <Avatar
                    size={sizes.SIDE_ICON_SIZE}
                    image={avatar}
                    onPress={logOut}
                  />
                ) : (
                  <IconButton
                    iconName="person"
                    size={sizes.SIDE_ICON_SIZE}
                    color={isAuth ? SOFT_BLUE : tintColor}
                    onPress={isAuth ? logOut : navigateToAuth}
                  />
                )}
              </RightHeaderView>
            );
          },
          tabBarActiveTintColor: isAuth ? SOFT_BLUE : CYBER_YELLOW,
          title: nickname ? `${nickname}'s Notes` : 'Notes',
        }}
      />
      <BottomTab.Screen
        name={NavigationNotesName.DRAFTS}
        component={Drafts}
        options={{
          tabBarIcon: (props) => <Ionicons name="archive" {...props} />,
          headerRight: ({ tintColor }) => {
            return (
              <RightHeaderView>
                {avatar ? (
                  <Avatar
                    size={sizes.SIDE_ICON_SIZE}
                    image={avatar}
                    onPress={logOut}
                  />
                ) : (
                  <IconButton
                    iconName="person"
                    size={sizes.SIDE_ICON_SIZE}
                    color={isAuth ? SOFT_BLUE : tintColor}
                    onPress={isAuth ? logOut : navigateToAuth}
                  />
                )}
              </RightHeaderView>
            );
          },
          title: 'Drafts',
        }}
      />
    </BottomTab.Navigator>
  );
};
