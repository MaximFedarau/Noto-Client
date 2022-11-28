import React, { ReactElement } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { Formik } from 'formik';
import { AxiosError } from 'axios';

import FormField from '@components/Auth/Defaults/FormField/FormField.component';
import FormButtons from '@components/Auth/Defaults/FormButtons/FormButtons.component';
import Spinner from '@components/Auth/Defaults/Spinner/Spinner.component';
import {
  AuthFormContainer,
  AuthFormFieldsContainer,
  AuthFormContentContainer,
} from '@components/Default/View/View.component';
import { AuthNavigationText } from '@components/Default/Text/Text.component';
import {
  NavigationAuthName,
  NavigationProps,
  NavigationName,
  ToastType,
  SignInData,
  AuthTokens,
} from '@types';
import { signInFormValidationSchema } from '@constants/validationSchemas';
import { showToast, createAPIInstance } from '@utils';

export default function Form(): ReactElement {
  const navigation = useNavigation<NavigationProps>();
  const fontInitialValues: SignInData = {
    nickname: '',
    password: '',
  };

  const [isLoading, setIsLoading] = React.useState(false);

  // go to the sign up screen
  const onNavigationTextHandler = () => {
    if (!isLoading) navigation.replace(NavigationAuthName.SIGN_UP);
  };

  // submitting (log in)
  const onFormSubmitHandler = async ({ nickname, password }: SignInData) => {
    setIsLoading(true);
    const instance = createAPIInstance();

    try {
      const { data } = await instance.post<AuthTokens>('/auth/login', {
        nickname: nickname.trim(),
        password,
      });
      await SecureStore.setItemAsync('accessToken', data.accessToken); // saving access token to secure store
      await SecureStore.setItemAsync('refreshToken', data.refreshToken); // saving refresh token to secure store
      showToast(
        ToastType.SUCCESS,
        'Congratulations!',
        'You have successfully signed in.',
      );
      handleReturnToHome(); // going to the home screen
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

  // returning home
  const handleReturnToHome = () => {
    navigation.navigate(NavigationName.NOTES_OVERVIEW);
  };

  return (
    <AuthFormContainer>
      <Formik
        initialValues={fontInitialValues}
        onSubmit={onFormSubmitHandler}
        validationSchema={signInFormValidationSchema}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ values, errors, handleChange, handleSubmit }) => (
          <AuthFormContentContainer>
            <AuthFormFieldsContainer>
              <FormField
                onChangeText={handleChange('nickname')}
                placeholder="Nickname:"
                error={!values.nickname ? errors.nickname : undefined}
              >
                {values.nickname}
              </FormField>
              <FormField
                onChangeText={handleChange('password')}
                placeholder="Password:"
                error={!values.password ? errors.password : undefined}
                secureTextEntry
              >
                {values.password}
              </FormField>
            </AuthFormFieldsContainer>
            <AuthNavigationText onPress={onNavigationTextHandler}>
              Sign Up
            </AuthNavigationText>
            {isLoading ? (
              <Spinner />
            ) : (
              <FormButtons
                onSubmit={handleSubmit}
                onHomeReturn={handleReturnToHome}
              >
                Sign In
              </FormButtons>
            )}
          </AuthFormContentContainer>
        )}
      </Formik>
    </AuthFormContainer>
  );
}