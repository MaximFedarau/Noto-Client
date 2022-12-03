import React, { FC, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { setItemAsync } from 'expo-secure-store';
import { Formik } from 'formik';
import { AxiosError } from 'axios';

import FormField from '@components/Auth/Default/FormField';
import Spinner from '@components/Auth/Default/Spinner';
import FormButtons from '@components/Auth/Default/FormButtons';
import { FormContainer } from '@components/Default/View/View.component';
import { NavigationText } from '@components/Default/Text/Text.component';
import {
  NavigationProps,
  NavigationAuthName,
  NavigationName,
  ToastType,
  SignUpData,
  AuthTokens,
} from '@types';
import { signUpSchema } from '@constants/validationSchemas';
import { showToast, createAPIInstance } from '@utils';

const Form: FC = () => {
  const instance = createAPIInstance();
  const initialValues: SignUpData = {
    nickname: '',
    password: '',
    confirmPassword: '',
  };

  const navigation = useNavigation<NavigationProps>();
  const [isLoading, setIsLoading] = useState(false);

  const navigateSignIn = () => navigation.replace(NavigationAuthName.SIGN_IN);
  const navigateHome = () => navigation.navigate(NavigationName.NOTES_OVERVIEW);

  const onSubmit = async ({ nickname, password }: SignUpData) => {
    setIsLoading(true);
    const trimmedNickname = nickname.trim();

    try {
      const { data: signUpData } = await instance.post<{ id: string }>(
        '/auth/signup',
        {
          nickname: trimmedNickname,
          password,
        },
      );
      const { id } = signUpData;

      const { data } = await instance.post<AuthTokens>('/auth/login', {
        nickname: trimmedNickname,
        password,
      });
      await setItemAsync('accessToken', data.accessToken);
      await setItemAsync('refreshToken', data.refreshToken);
      showToast(
        ToastType.SUCCESS,
        'Congratulations!',
        'You have successfully signed up.',
      );
      navigation.replace(NavigationAuthName.AVATAR_PICKER, { id });
    } catch (error) {
      const { response } = error as AxiosError<{ message: string }>;
      setIsLoading(false);
      showToast(
        ToastType.ERROR,
        'Sign Up Error',
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
      validationSchema={signUpSchema}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ values, errors, handleChange, handleSubmit }) => (
        <FormContainer>
          <FormField
            onChangeText={handleChange('nickname')}
            placeholder="Nickname:"
            error={errors.nickname}
          >
            {values.nickname}
          </FormField>
          <FormField
            onChangeText={handleChange('password')}
            placeholder="Password:"
            error={errors.password}
            secureTextEntry
          >
            {values.password}
          </FormField>
          <FormField
            onChangeText={handleChange('confirmPassword')}
            placeholder="Confirm password:"
            error={errors.confirmPassword}
            secureTextEntry
          >
            {values.confirmPassword}
          </FormField>
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <NavigationText onPress={navigateSignIn}>Sign In</NavigationText>
              <FormButtons onSubmit={handleSubmit} onHomeReturn={navigateHome}>
                Sign Up
              </FormButtons>
            </>
          )}
        </FormContainer>
      )}
    </Formik>
  );
};

export default Form;
