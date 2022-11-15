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
import { NavigationProps, SignUpFormData } from '@app-types/types';
import { NAVIGATION_NAMES, NAVIGATION_AUTH_NAMES } from '@app-types/enum';
import { signUpFormValidationSchema } from '@constants/validationSchemas';
import { showingSubmitError } from '@utils/toastInteraction/showingSubmitError';
import { showingSuccess } from '@utils/toastInteraction/showingSuccess';
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

      const res = await instance // in any case we login user
        .post<{ accessToken: string; refreshToken: string }>(`/auth/login`, {
          nickname: trimmedNickname,
          password,
        });
      if (!res || !res.data) return; //checking is the response is undefined - type checking
      await SecureStore.setItemAsync('accessToken', res.data.accessToken); // saving access token to secure store
      await SecureStore.setItemAsync('refreshToken', res.data.refreshToken); // saving refresh token to secure store
      showingSuccess('Congratulations!', 'You have successfully signed up.');
      navigation.replace(NAVIGATION_AUTH_NAMES.AVATAR_PICKER, {
        id,
      });
    } catch (error) {
      const { response } = error as AxiosError<{ message: string }>;
      showingSubmitError(
        'Sign Up Error',
        response && response?.data
          ? response.data.message
          : 'Something went wrong:(',
        undefined,
        () => {
          setIsLoading(false);
        },
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
