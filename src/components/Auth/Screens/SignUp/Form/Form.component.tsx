import React, { ReactElement } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { Formik } from 'formik';
import { AxiosError } from 'axios';

import FormField from '@components/Auth/Defaults/FormField/FormField.component';
import Spinner from '@components/Auth/Defaults/Spinner/Spinner.component';
import FormButtons from '@components/Auth/Defaults/FormButtons/FormButtons.component';
import {
  AuthFormContainer,
  AuthFormFieldsContainer,
  AuthFormContentContainer,
} from '@components/Default/View/View.component';
import { AuthNavigationText } from '@components/Default/Text/Text.component';
import {
  NavigationProps,
  NavigationAuthName,
  NavigationName,
  ToastType,
  SignUpData,
  AuthTokens,
} from '@types';
import { signUpFormValidationSchema } from '@constants/validationSchemas';
import { showToast, createAPIInstance } from '@utils';

export default function Form(): ReactElement {
  const navigation = useNavigation<NavigationProps>();

  const formInitialValues: SignUpData = {
    nickname: '',
    password: '',
    confirmPassword: '',
  };

  const [isLoading, setIsLoading] = React.useState(false);

  //going to the sign in screen
  const onNavigationTextHandler = () => {
    if (!isLoading) navigation.replace(NavigationAuthName.SIGN_IN);
  };

  // submit hanlder (sign up  + log in)
  async function onFormSubmitHandler({ nickname, password }: SignUpData) {
    setIsLoading(true); // setting that the form is loading
    const instance = createAPIInstance();
    const trimmedNickname = nickname.trim(); // trimming the nickname

    try {
      const { data: signUpData } = await instance.post<{ id: string }>(
        `/auth/signup`,
        {
          nickname: trimmedNickname,
          password,
        },
      );
      const { id } = signUpData;

      const { data } = await instance // in any case we login user
        .post<AuthTokens>(`/auth/login`, {
          nickname: trimmedNickname,
          password,
        });
      await SecureStore.setItemAsync('accessToken', data.accessToken); // saving access token to secure store
      await SecureStore.setItemAsync('refreshToken', data.refreshToken); // saving refresh token to secure store
      showToast(
        ToastType.SUCCESS,
        'Congratulations!',
        'You have successfully signed up.',
      );
      navigation.replace(NavigationAuthName.AVATAR_PICKER, {
        id,
      });
    } catch (error) {
      const { response } = error as AxiosError<{ message: string }>;
      setIsLoading(false);
      showToast(
        ToastType.ERROR,
        'Sign Up Error',
        response && response?.data
          ? response.data.message
          : 'Something went wrong:(',
      );
    }
  }

  // returning to the main screen
  const handleReturnToHome = () => {
    navigation.navigate(NavigationName.NOTES_OVERVIEW);
  };

  return (
    <AuthFormContainer>
      <Formik
        initialValues={formInitialValues}
        onSubmit={onFormSubmitHandler}
        validationSchema={signUpFormValidationSchema}
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
            </AuthFormFieldsContainer>
            <AuthNavigationText onPress={onNavigationTextHandler}>
              Sign In
            </AuthNavigationText>
            {isLoading ? (
              <Spinner />
            ) : (
              <FormButtons
                onSubmit={handleSubmit}
                onHomeReturn={handleReturnToHome}
              >
                Sign Up
              </FormButtons>
            )}
          </AuthFormContentContainer>
        )}
      </Formik>
    </AuthFormContainer>
  );
}
