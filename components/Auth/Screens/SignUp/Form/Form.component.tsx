import React, { ReactElement } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

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
import { showingSubmitError } from '@utils/showingSubmitError';

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
    navigation.replace(NAVIGATION_AUTH_NAMES.SIGN_IN);
  };

  // submit hanlder (sign up + (optional?) image upload + log in)
  async function onFormSubmitHandler({ nickname, password }: SignUpFormData) {
    setIsLoading(true); // setting that the form is loading
    const trimmedNickname = nickname.trim(); // trimming the nickname

    // * section: sign up
    const signUpResponse = await axios
      .post<{ id: string }>(`${process.env.API_URL}/auth/signup`, {
        nickname: trimmedNickname,
        password,
      }) // signing up the user
      .catch((error) => {
        // catching possible errors
        showingSubmitError(
          'Sign Up Error',
          error.response.data
            ? error.response.data.message
            : 'Something went wrong:(',
          () => {
            setIsLoading(false);
          },
        );
      });
    if (!signUpResponse) return; // if the response is undefined, stoping method - error was handled before
    const userId = signUpResponse.data.id;

    // * section: login
    axios // in any case we login user
      .post<{ accessToken: string; refreshToken: string }>(
        `${process.env.API_URL}/auth/login`,
        {
          nickname: trimmedNickname,
          password,
        },
      )
      .then(async (res) => {
        if (!res || !res.data) return; //checking is the response is undefined - type checking
        await SecureStore.setItemAsync('accessToken', res.data.accessToken); // saving access token to secure store
        await SecureStore.setItemAsync('refreshToken', res.data.refreshToken); // saving refresh token to secure store
        navigation.replace(NAVIGATION_AUTH_NAMES.AVATAR_PICKER, {
          id: userId,
        });
      })
      .catch((error) => {
        //handling possible errors
        showingSubmitError(
          'Login Error',
          error.response.data
            ? error.response.data.message
            : 'Something went wrong:(',
          () => {
            setIsLoading(false);
          },
        );
      });
  }

  // returning to the main screen
  const handleReturnToHome = () => {
    navigation.replace(NAVIGATION_NAMES.NOTES_OVERVIEW);
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

Form.defaultProps = {
  API_URL: (process.env.API_URL = 'http://localhost:5000'),
};