import React, { FC, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { setItemAsync } from 'expo-secure-store';
import { Formik } from 'formik';
import { AxiosError } from 'axios';

import FormField from '@components/Auth/Default/FormField';
import FormButtons from '@components/Auth/Default/FormButtons';
import Spinner from '@components/Auth/Default/Spinner';
import { FormContainer } from '@components/Default/View/View.component';
import { NavigationText } from '@components/Default/Text/Text.component';
import {
  NavigationAuthName,
  NavigationProps,
  NavigationName,
  ToastType,
  SignInData,
  AuthTokens,
} from '@types';
import { signInSchema } from '@constants/validationSchemas';
import { showToast, createAPIInstance } from '@utils';

const Form: FC = () => {
  const instance = createAPIInstance();
  const initialValues: SignInData = {
    nickname: '',
    password: '',
  };

  const navigation = useNavigation<NavigationProps>();
  const [isLoading, setIsLoading] = useState(false);

  const navigateSignUp = () => navigation.replace(NavigationAuthName.SIGN_UP);
  const navigateHome = () => navigation.navigate(NavigationName.NOTES_OVERVIEW);

  const onSubmit = async ({ nickname, password }: SignInData) => {
    setIsLoading(true);

    try {
      const { data } = await instance.post<AuthTokens>('/auth/login', {
        nickname: nickname.trim(),
        password,
      });
      await setItemAsync('accessToken', data.accessToken);
      await setItemAsync('refreshToken', data.refreshToken);
      showToast(
        ToastType.SUCCESS,
        'Congratulations!',
        'You have successfully signed in.',
      );
      navigateHome();
    } catch (error) {
      const { response } = error as AxiosError<{ message: string }>;
      setIsLoading(false);
      showToast(
        ToastType.ERROR,
        'Login Error',
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
      validationSchema={signInSchema}
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
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <NavigationText onPress={navigateSignUp}>Sign Up</NavigationText>
              <FormButtons onSubmit={handleSubmit} onHomeReturn={navigateHome}>
                Sign In
              </FormButtons>
            </>
          )}
        </FormContainer>
      )}
    </Formik>
  );
};

export default Form;
