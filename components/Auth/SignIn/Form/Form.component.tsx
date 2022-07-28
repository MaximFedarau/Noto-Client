//Types
import React, { ReactElement } from 'react';
import { NavigationProps, SignInFormData } from '@app-types/types';

//Constants
import { NAVIGATION_NAMES, NAVIGATION_AUTH_NAMES } from '@app-types/enum';
import { signInFormValidationSchema } from '@constants/validationSchemas';
import { showingSubmitError } from '@utils/showingSubmitError';

//Expo
import * as SecureStore from 'expo-secure-store';

//Components
import FormField from '@components/Auth/FormField/FormField.component';
import FormButtons from '@components/Auth/FormButtons/FormButtons.component';

import {
  AuthFormContainer,
  AuthFormFieldsContainer,
  AuthFormContentContainer,
  AuthFormButtonsContainer,
} from '@components/Default/View/View.component';
import { AuthNavigationText } from '@components/Default/Text/Text.component';

//React Native
import { ActivityIndicator } from 'react-native';

//Formik
import { Formik } from 'formik';

//React Navigation
import { useNavigation } from '@react-navigation/native';

//axios
import axios from 'axios';

export default function Form(): ReactElement {
  // * Variables

  const navigation = useNavigation<NavigationProps>();
  const fontInitialValues: SignInFormData = {
    nickname: '',
    password: '',
  };

  // * States
  const [isLoading, setIsLoading] = React.useState(false);

  // * Methods

  // go to the sign up screen
  function onNavigationTextHandler() {
    navigation.replace(NAVIGATION_AUTH_NAMES.SIGN_UP);
  }

  // submitting (log in)
  async function onFormSubmitHandler(values: SignInFormData) {
    setIsLoading(true);
    await axios
      .post<{ accessToken: string; refreshToken: string }>(
        `${process.env.API_URL}/auth/login`,
        {
          nickname: values.nickname,
          password: values.password,
        },
      )
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
      })
      .then(async (res) => {
        if (!res || !res.data) return; //checking is the response is undefined - type checking
        await SecureStore.setItemAsync('accessToken', res.data.accessToken); // saving access token to secure store
        await SecureStore.setItemAsync('refreshToken', res.data.refreshToken); // saving refresh token to secure store
        onHomeReturnHandler(); // going to the home screen
      });
  }

  // returning home
  function onHomeReturnHandler() {
    navigation.replace(NAVIGATION_NAMES.NOTES_OVERVIEW);
  }

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
            </AuthFormFieldsContainer>
            <AuthNavigationText onPress={onNavigationTextHandler}>
              Sign Up
            </AuthNavigationText>
            {isLoading ? (
              <AuthFormButtonsContainer>
                <ActivityIndicator size="large" />
              </AuthFormButtonsContainer>
            ) : (
              <FormButtons
                onSubmit={handleSubmit}
                onHomeReturn={onHomeReturnHandler}
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

Form.defaultProps = {
  API_URL: (process.env.API_URL = 'http://localhost:5000'),
};
