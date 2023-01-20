import React, { FC, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { getItemAsync, deleteItemAsync } from 'expo-secure-store';

import { Avatar, IconButton } from '@components';
import { AuthStack, MainBottomTabs } from '@navigation';
import { RecordsManaging, Loading } from '@screens';
import {
  setIsAuth,
  setProfile,
  clearUser,
  userIsAuthSelector,
  userAvatarSelector,
} from '@store/user';
import { getPublicData, showToast } from '@utils';
import { COLORS, FONTS, SIZES } from '@constants';
import {
  NavigationName,
  ToastType,
  NavigationProps,
  MAIN_NAVIGATOR_ID,
} from '@types';

const Stack = createNativeStackNavigator();

const Navigator: FC = () => {
  const dispatch = useDispatch();
  const avatar = useSelector(userAvatarSelector);
  const isAuth = useSelector(userIsAuthSelector);

  const navigation = useNavigation<NavigationProps>();

  const navigateToAuth = () => navigation.navigate(NavigationName.AUTH);

  const logOut = async () => {
    await deleteItemAsync('accessToken');
    await deleteItemAsync('refreshToken');
    dispatch(clearUser());
  };

  const [isLoading, setIsLoading] = useState(true);

  const getProfile = async () => {
    try {
      const accessToken = await getItemAsync('accessToken');
      const refreshToken = await getItemAsync('refreshToken');
      if (accessToken && refreshToken) {
        const data = await getPublicData();
        dispatch(setIsAuth(data ? true : false));
        dispatch(data ? setProfile(data) : clearUser());
      }
    } catch (error) {
      let message = 'Something went wrong:(';
      if (error instanceof Error) message = error.message || message; // if error.message is empty
      showToast(ToastType.ERROR, 'Profile Loading Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  // get profile, when the app starts
  useEffect(() => {
    getProfile();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <Stack.Navigator
      id={MAIN_NAVIGATOR_ID}
      screenOptions={{
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerTintColor: COLORS.osloGray,
        headerTitleStyle: { fontFamily: FONTS.families.primary },
        headerStyle: { backgroundColor: COLORS.springWood },
      }}
    >
      <Stack.Screen
        name={NavigationName.NOTES_OVERVIEW}
        component={MainBottomTabs}
        options={{
          headerRight: ({ tintColor }) => {
            return (
              <>
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
              </>
            );
          },
        }}
      />
      <Stack.Screen
        name={NavigationName.RECORDS_MANAGING}
        component={RecordsManaging}
        options={{
          contentStyle: { backgroundColor: COLORS.springWood },
          presentation: 'fullScreenModal',
        }}
      />
      <Stack.Screen
        name={NavigationName.AUTH}
        component={AuthStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default Navigator;
