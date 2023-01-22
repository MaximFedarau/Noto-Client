import React, { FC, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { setItemAsync, getItemAsync } from 'expo-secure-store';
import { Formik, FormikErrors } from 'formik';
import { useDispatch } from 'react-redux';
import { AxiosError } from 'axios';

import { AuthFormField } from '@components/Auth/FormField';
import { FormButtons } from '@components/Auth/FormButtons';
import { Spinner, FormContainer, NavigationText } from '@components/Default';
import {
  NavigationAuthName,
  AuthStackScreenProps,
  NavigationName,
  ToastType,
  AuthData,
  AuthTokens,
  SignUpData,
} from '@types';
import { setProfile, clearUser, setIsAuth } from '@store/user';
import { signInSchema, signUpSchema } from '@constants';
import { showToast, createAPIInstance, getPublicData } from '@utils';

interface Props {
  hasAccount: boolean;
}

type ScreenProps =
  | AuthStackScreenProps<NavigationAuthName.SIGN_IN>
  | AuthStackScreenProps<NavigationAuthName.SIGN_UP>;

export const AuthForm: FC<Props> = ({ hasAccount }) => {
  const instance = createAPIInstance();
  const initialValues: AuthData = {
    nickname: '',
    password: '',
    ...(!hasAccount && { confirmPassword: '' }),
  };

  const dispatch = useDispatch();

  const navigation = useNavigation<ScreenProps['navigation']>();

  const [isLoading, setIsLoading] = useState(false);

  const navigateAuth = () =>
    navigation.replace(
      hasAccount ? NavigationAuthName.SIGN_UP : NavigationAuthName.SIGN_IN,
    );
  const navigateHome = () =>
    navigation.navigate(NavigationName.RECORDS_OVERVIEW);

  const signUp = async ({ nickname, password }: AuthData) => {
    const { data: signUpData } = await instance.post<{ id: string }>(
      '/auth/signup',
      {
        nickname: nickname.trim(),
        password,
      },
    );
    return signUpData.id;
  };

  const getProfile = async () => {
    try {
      const accessToken = await getItemAsync('accessToken');
      const refreshToken = await getItemAsync('refreshToken');
      if (accessToken && refreshToken) {
        const data = await getPublicData();
        dispatch(setIsAuth(data ? true : false));
        dispatch(data ? setProfile(data) : clearUser());
      } else throw new Error('Invalid token.');
    } catch (error) {
      let message = 'Something went wrong:(';
      if (error instanceof Error) message = error.message || message; // if error.message is empty
      if (!hasAccount) message = message.trim() + ' Please, sign in later.'; // if sign up is successful (account is created), but can't get profile
      throw new Error(message);
    }
  };

  const onSubmit = async ({ nickname, password }: AuthData) => {
    setIsLoading(true);

    try {
      let id = '';
      if (!hasAccount) id = await signUp({ nickname, password });

      const { data } = await instance.post<AuthTokens>('/auth/login', {
        nickname: nickname.trim(),
        password,
      });
      await setItemAsync('accessToken', data.accessToken);
      await setItemAsync('refreshToken', data.refreshToken);
      await getProfile();
      showToast(
        ToastType.SUCCESS,
        'Congratulations!',
        `You have successfully ${hasAccount ? 'signed in' : 'signed up'}.`,
      );

      if (!id) navigateHome();
      else navigation.replace(NavigationAuthName.AVATAR_PICKER, { id });
    } catch (error) {
      let message = 'Something went wrong:(';
      if (error instanceof AxiosError)
        message = error.response?.data.message || message;
      else if (error instanceof Error) message = error.message || message;
      setIsLoading(false);
      showToast(
        ToastType.ERROR,
        `${hasAccount ? 'Sign In' : 'Sign Up'} Error`,
        message,
      );
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={hasAccount ? signInSchema : signUpSchema}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ values, errors, handleChange, handleSubmit }) => (
        <FormContainer>
          <AuthFormField
            onChangeText={handleChange('nickname')}
            placeholder="Nickname:"
            error={errors.nickname}
          >
            {values.nickname}
          </AuthFormField>
          <AuthFormField
            onChangeText={handleChange('password')}
            placeholder="Password:"
            error={errors.password}
            secureTextEntry
          >
            {values.password}
          </AuthFormField>
          {!hasAccount && (
            <AuthFormField
              onChangeText={handleChange('confirmPassword')}
              placeholder="Confirm password:"
              error={(errors as FormikErrors<SignUpData>).confirmPassword}
              secureTextEntry
            >
              {(values as SignUpData).confirmPassword}
            </AuthFormField>
          )}
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <NavigationText onPress={navigateAuth}>
                {hasAccount ? 'Sign Up' : 'Sign In'}
              </NavigationText>
              <FormButtons onSubmit={handleSubmit} onHomeReturn={navigateHome}>
                {hasAccount ? 'Sign In' : 'Sign Up'}
              </FormButtons>
            </>
          )}
        </FormContainer>
      )}
    </Formik>
  );
};
