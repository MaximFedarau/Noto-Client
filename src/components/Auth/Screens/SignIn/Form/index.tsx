import React, { FC, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { setItemAsync } from 'expo-secure-store';
import { Formik } from 'formik';
import { AxiosError } from 'axios';

import FormField from '@components/Auth/Default/FormField';
import FormButtons from '@components/Auth/Default/FormButtons';
import Spinner from '@components/Auth/Default/Spinner';
import {
  FormContainer,
  FormFieldsContainer,
  FormContentContainer,
} from '@components/Default/View/View.component';
import { NavigationText } from '@components/Default/Text/Text.component';
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

const Form: FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const fontInitialValues: SignInData = {
    nickname: '',
    password: '',
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleNavigateSignUp = () => {
    if (!isLoading) navigation.replace(NavigationAuthName.SIGN_UP);
  };

  const handleReturnToHome = () =>
    navigation.navigate(NavigationName.NOTES_OVERVIEW);

  const onFormSubmitHandler = async ({ nickname, password }: SignInData) => {
    setIsLoading(true);
    const instance = createAPIInstance();

    try {
      const { data } = await instance.post<AuthTokens>('/auth/login', {
        nickname: nickname.trim(),
        password,
      });
      await setItemAsync('accessToken', data.accessToken); // saving access token to secure store
      await setItemAsync('refreshToken', data.refreshToken); // saving refresh token to secure store
      showToast(
        ToastType.SUCCESS,
        'Congratulations!',
        'You have successfully signed in.',
      );
      handleReturnToHome();
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
    <FormContainer>
      <Formik
        initialValues={fontInitialValues}
        onSubmit={onFormSubmitHandler}
        validationSchema={signInFormValidationSchema}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ values, errors, handleChange, handleSubmit }) => (
          <FormContentContainer>
            <FormFieldsContainer>
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
            </FormFieldsContainer>
            <NavigationText onPress={handleNavigateSignUp}>
              Sign Up
            </NavigationText>
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
          </FormContentContainer>
        )}
      </Formik>
    </FormContainer>
  );
};

export default Form;
