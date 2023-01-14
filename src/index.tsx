import React, { FC, useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { getItemAsync } from 'expo-secure-store';

import { AuthStack, MainBottomTabs } from '@navigation';
import { RecordsManaging, Loading } from '@screens';
import { setIsAuth, setProfile, clearUser } from '@store/user';
import { getPublicData, showToast } from '@utils';
import { COLORS, FONTS } from '@constants';
import { NavigationName, ToastType } from '@types';

const Stack = createNativeStackNavigator();

const Navigator: FC = () => {
  const dispatch = useDispatch();

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
};

export default Navigator;
