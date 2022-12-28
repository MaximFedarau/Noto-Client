import React, { FC, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { setItemAsync } from 'expo-secure-store';
import { Formik, FormikErrors } from 'formik';

import { AuthFormField } from '@components/Auth/FormField';
import { FormButtons } from '@components/Auth/FormButtons';
import { Spinner, FormContainer, NavigationText } from '@components/Default';
import {
  NavigationAuthName,
  NavigationProps,
  NavigationName,
  ToastType,
  AuthData,
  AuthTokens,
  SignUpData,
  AxiosMessageError,
} from '@types';
import { signInSchema, signUpSchema } from '@constants';
import { showToast, createAPIInstance } from '@utils';

interface Props {
  hasAccount: boolean;
}

export const AuthForm: FC<Props> = ({ hasAccount }) => {
  const instance = createAPIInstance();
  const initialValues: AuthData = {
    nickname: '',
    password: '',
    ...(!hasAccount && { confirmPassword: '' }),
  };

  const navigation = useNavigation<NavigationProps>();
  const [isLoading, setIsLoading] = useState(false);

  const navigateAuth = () =>
    navigation.replace(
      hasAccount ? NavigationAuthName.SIGN_UP : NavigationAuthName.SIGN_IN,
    );
  const navigateHome = () => navigation.navigate(NavigationName.NOTES_OVERVIEW);

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
      showToast(
        ToastType.SUCCESS,
        'Congratulations!',
        `You have successfully ${hasAccount ? 'signed in' : 'signed up'}.`,
      );

      if (hasAccount || !id) navigateHome();
      else navigation.replace(NavigationAuthName.AVATAR_PICKER, { id });
    } catch (error) {
      const { response } = error as AxiosMessageError;
      setIsLoading(false);
      showToast(
        ToastType.ERROR,
        `${hasAccount ? 'Sign In' : 'Sign Up'} Error`,
        response && response.data
          ? response.data.message
          : 'Something went wrong:(',
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
