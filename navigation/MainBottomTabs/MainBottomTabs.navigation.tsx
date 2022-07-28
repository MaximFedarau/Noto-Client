//Types
import React, { ReactElement } from 'react';
import { NavigationProps, PublicUserData } from '@app-types/types';

//Constants
import {
  OSLO_GRAY,
  SPRING_WOOD,
  CYBER_YELLOW,
  SOFT_BLUE,
} from '@constants/colors';
import { NAVIGATION_NAMES, NAVIGATION_NOTES_NAMES } from '@app-types/enum';
import { getPublicData } from '@utils/auth/get/publicData';

//Expo
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

//Screens
import Loading from '@screens/Loading/Loading.screen';
import Notes from '@screens/Notes/Notes.screen';
import NotesManaging from '@screens/NotesManaging/NotesManaging.screen';
import Drafts from '@screens/Drafts/Drafts.screen';

//Components
import IconButton from '@components/Default/IconButton/IconButton.component';
import { Pressable, Image } from 'react-native';

import { RightHeaderView } from '@components/Default/View/View.component';

//React Navigation
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const BottomTab = createBottomTabNavigator();

export default function MainBottomTabs(): ReactElement {
  // * Variables
  const navigation = useNavigation<NavigationProps>();

  // * States
  const [isAuth, setIsAuth] = React.useState(false);
  const [publicData, setPublicData] = React.useState<
    PublicUserData | undefined
  >(undefined);
  const [isLoading, setIsLoading] = React.useState(true);

  // * Methods
  function navigateToAuth() {
    navigation.navigate(NAVIGATION_NAMES.AUTH);
  }

  // * Effects
  React.useEffect(() => {
    async function checkIsAuth() {
      // await SecureStore.deleteItemAsync('accessToken');
      // await SecureStore.deleteItemAsync('refreshToken');
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (accessToken && refreshToken) {
        setIsAuth(true);
        const data = await getPublicData(accessToken, refreshToken);
        if (data) {
          // if there is a data we set it
          setPublicData(data);
        } else {
          // if there is no data we delete the tokens (in function) and remove all states
          setIsAuth(false);
          setPublicData(undefined);
        }
      } else {
        //if there is no tokens we remove all states
        setIsAuth(false);
        setPublicData(undefined);
      }
    }
    checkIsAuth().finally(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <Loading />;

  return (
    <BottomTab.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerTintColor: OSLO_GRAY,
        headerTitleStyle: {
          fontFamily: 'Roboto-Regular',
        },
        headerStyle: { backgroundColor: SPRING_WOOD },
        headerShadowVisible: false,
        tabBarStyle: { backgroundColor: SPRING_WOOD, justifyContent: 'center' },
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
            const { avatar } = publicData || {};
            return (
              <RightHeaderView>
                {!avatar ? (
                  <IconButton
                    iconName="person"
                    size={32}
                    color={!isAuth ? tintColor : SOFT_BLUE}
                    onPress={!isAuth ? navigateToAuth : null}
                  />
                ) : (
                  <Image
                    source={{ uri: avatar }}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                    }}
                  />
                )}
              </RightHeaderView>
            );
          },
          title:
            publicData && publicData.nickname
              ? `${publicData.nickname}'s Notes`
              : 'Notes',
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
            const { avatar } = publicData || {};
            return (
              <RightHeaderView>
                {!avatar ? (
                  <IconButton
                    iconName="person"
                    size={32}
                    color={!isAuth ? tintColor : SOFT_BLUE}
                    onPress={!isAuth ? navigateToAuth : null}
                  />
                ) : (
                  <Image
                    source={{ uri: avatar }}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                    }}
                  />
                )}
              </RightHeaderView>
            );
          },
          title: 'Loading...',
        }}
      />
    </BottomTab.Navigator>
  );
}
