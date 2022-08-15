import React, { ReactElement, useEffect } from 'react';
import { NavigationProps } from '@app-types/types';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { Pressable } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '@screens/Loading/Loading.screen';
import Notes from '@screens/Notes/Notes.screen';
import NotesManaging from '@screens/NotesManaging/NotesManaging.screen';
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
import { NAVIGATION_NAMES, NAVIGATION_NOTES_NAMES } from '@app-types/enum';
import { getPublicData } from '@utils/requests/get/publicData';
import {
  publicDataInitialState,
  setPublicData,
  setIsAuth,
} from '@store/publicData/publicData.slice';
import {
  publicDataAuthSelector,
  publicDataAvatarSelector,
  publicDataNicknameSelector,
} from '@store/publicData/publicData.selector';
import Toast from 'react-native-toast-message';

const BottomTab = createBottomTabNavigator();

export default function MainBottomTabs(): ReactElement {
  const dispatch = useDispatch();
  const nickname = useSelector(publicDataNicknameSelector);
  const isAuth = useSelector(publicDataAuthSelector);

  const navigation = useNavigation<NavigationProps>();
  const focus = useIsFocused();

  const [isLoading, setIsLoading] = React.useState(true);

  function navigateToAuth() {
    navigation.navigate(NAVIGATION_NAMES.AUTH);
  }

  async function logOut() {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    dispatch(setIsAuth(false));
    dispatch(setPublicData(publicDataInitialState));
  }

  useEffect(() => {
    const checkIsAuth = async () => {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (accessToken && refreshToken) {
        const data = await getPublicData();
        if (data) {
          // if there is a data we set it
          dispatch(setIsAuth(true));
          dispatch(setPublicData(data));
        } else {
          // if there is no data we delete the tokens (in function) and change all data
          dispatch(setIsAuth(false));
          dispatch(setPublicData(publicDataInitialState));
        }
      } else {
        //if there is no tokens we change all data
        dispatch(setIsAuth(false));
        dispatch(setPublicData(publicDataInitialState));
      }
    };
    if (focus) {
      checkIsAuth().finally(() => {
        setIsLoading(false);
      });
      return;
    }
    setIsLoading(false);
  }, [focus]);

  if (isLoading) return <Loading />;

  return (
    <>
      <BottomTab.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerTintColor: OSLO_GRAY,
          headerTitleStyle: {
            fontFamily: 'Roboto-Regular',
          },
          headerStyle: { backgroundColor: SPRING_WOOD },
          headerShadowVisible: false,
          tabBarStyle: {
            backgroundColor: SPRING_WOOD,
            justifyContent: 'center',
          },
          tabBarActiveTintColor: CYBER_YELLOW,
        }}
        sceneContainerStyle={{
          backgroundColor: SPRING_WOOD,
        }}
      >
        <BottomTab.Screen
          name={NAVIGATION_NOTES_NAMES.NOTES}
          component={Notes}
          options={{
            tabBarIcon: ({ color, size }) => {
              return <Ionicons name="document" size={size} color={color} />;
            },
            tabBarLabel: () => null,
            headerRight: ({ tintColor }) => {
              const avatar = useSelector(publicDataAvatarSelector);
              return (
                <RightHeaderView>
                  {avatar ? (
                    <Avatar size={32} image={avatar} onPress={logOut} />
                  ) : (
                    <IconButton
                      iconName="person"
                      size={32}
                      color={isAuth ? SOFT_BLUE : tintColor}
                      onPress={isAuth ? logOut : navigateToAuth}
                    />
                  )}
                </RightHeaderView>
              );
            },
            title: nickname ? `${nickname}'s Notes` : 'Notes',
          }}
        />
        <BottomTab.Screen
          name={NAVIGATION_NOTES_NAMES.NOTES_MANAGING}
          component={NotesManaging}
          options={{
            title: 'Manage Note',
            headerTitleAlign: 'center',
            headerTintColor: OSLO_GRAY,
            headerTitleStyle: {
              fontFamily: 'Roboto-Regular',
            },
            headerStyle: { backgroundColor: SPRING_WOOD },
            headerShadowVisible: false,
            unmountOnBlur: true,
            tabBarLabel: () => null,
            tabBarIcon: ({ color, size }) => {
              return (
                <Ionicons name="add-circle-sharp" size={size} color={color} />
              );
            },
            tabBarButton: (props) => {
              function onButtonClickHandler() {
                navigation.navigate(NAVIGATION_NOTES_NAMES.NOTES_MANAGING);
              }
              return <Pressable {...props} onPress={onButtonClickHandler} />;
            },
          }}
        />
        <BottomTab.Screen
          name={NAVIGATION_NOTES_NAMES.DRAFTS}
          component={Drafts}
          options={{
            tabBarIcon: ({ color, size }) => {
              return <Ionicons name="archive" size={size} color={color} />;
            },
            tabBarLabel: () => null,
            headerRight: ({ tintColor }) => {
              const avatar = useSelector(publicDataAvatarSelector);
              return (
                <RightHeaderView>
                  {avatar ? (
                    <Avatar size={32} image={avatar} onPress={logOut} />
                  ) : (
                    <IconButton
                      iconName="person"
                      size={32}
                      color={isAuth ? SOFT_BLUE : tintColor}
                      onPress={isAuth ? logOut : navigateToAuth}
                    />
                  )}
                </RightHeaderView>
              );
            },
            title: 'Loading...',
          }}
        />
      </BottomTab.Navigator>
      <Toast />
    </>
  );
}
