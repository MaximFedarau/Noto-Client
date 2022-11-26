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
import { NavigationProps, SignUpFormData, AuthTokens } from '@app-types/types';
import {
  NAVIGATION_NAMES,
  NAVIGATION_AUTH_NAMES,
  TOAST_TYPE,
} from '@app-types/enum';
import { signUpFormValidationSchema } from '@constants/validationSchemas';
import { showToast } from '@utils/toasts/showToast';
import { createAPIInstance } from '@utils/requests/instance';

export default function Form(): ReactElement {
  const navigation = useNavigation<NavigationProps>();

  const formInitialValues: SignUpFormData = {
    nickname: '',
    password: '',
    confirmPassword: '',
  };

  const [isLoading, setIsLoading] = React.useState(false);

  //going to the sign in screen
  const onNavigationTextHandler = () => {
    if (!isLoading) navigation.replace(NAVIGATION_AUTH_NAMES.SIGN_IN);
  };

  // submit hanlder (sign up  + log in)
  async function onFormSubmitHandler({ nickname, password }: SignUpFormData) {
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
        TOAST_TYPE.SUCCESS,
        'Congratulations!',
        'You have successfully signed up.',
      );
      navigation.replace(NAVIGATION_AUTH_NAMES.AVATAR_PICKER, {
        id,
      });
    } catch (error) {
      const { response } = error as AxiosError<{ message: string }>;
      setIsLoading(false);
      showToast(
        TOAST_TYPE.ERROR,
        'Sign Up Error',
        response && response?.data
          ? response.data.message
          : 'Something went wrong:(',
      );
    }
  }

  // returning to the main screen
  const handleReturnToHome = () => {
    navigation.navigate(NAVIGATION_NAMES.NOTES_OVERVIEW);
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
