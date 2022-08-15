import React, { ReactElement } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';

import FormField from '@components/Auth/Defaults/FormField/FormField.component';
import FormButtons from '@components/Auth/Defaults/FormButtons/FormButtons.component';
import Spinner from '@components/Auth/Defaults/Spinner/Spinner.component';
import {
  AuthFormContainer,
  AuthFormFieldsContainer,
  AuthFormContentContainer,
} from '@components/Default/View/View.component';
import { AuthNavigationText } from '@components/Default/Text/Text.component';
import { NAVIGATION_NAMES, NAVIGATION_AUTH_NAMES } from '@app-types/enum';
import { NavigationProps, SignInFormData } from '@app-types/types';
import { signInFormValidationSchema } from '@constants/validationSchemas';
import { showingSubmitError } from '@utils/toastInteraction/showingSubmitError';
import { createAPIInstance } from '@utils/requests/instance';

export default function Form(): ReactElement {
  const navigation = useNavigation<NavigationProps>();
  const fontInitialValues: SignInFormData = {
    nickname: '',
    password: '',
  };

  const [isLoading, setIsLoading] = React.useState(false);

  // go to the sign up screen
  const onNavigationTextHandler = () => {
    if (!isLoading) navigation.replace(NAVIGATION_AUTH_NAMES.SIGN_UP);
  };

  // submitting (log in)
  const onFormSubmitHandler = ({ nickname, password }: SignInFormData) => {
    setIsLoading(true);
    const instance = createAPIInstance();
    instance
      .post<{ accessToken: string; refreshToken: string }>('/auth/login', {
        nickname: nickname.trim(),
        password,
      })
      .then(async (res) => {
        if (!res || !res.data) return; //checking is the response is undefined - type checking
        await SecureStore.setItemAsync('accessToken', res.data.accessToken); // saving access token to secure store
        await SecureStore.setItemAsync('refreshToken', res.data.refreshToken); // saving refresh token to secure store
        handleReturnToHome(); // going to the home screen
      })
      .catch((error) => {
        //handling possible errors
        showingSubmitError(
          'Login Error',
          error.response.data
            ? error.response.data.message
            : 'Something went wrong:(',
          undefined,
          () => {
            setIsLoading(false);
          },
        );
      });
  };

  // returning home
  const handleReturnToHome = () => {
    navigation.navigate(NAVIGATION_NAMES.NOTES_OVERVIEW);
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
