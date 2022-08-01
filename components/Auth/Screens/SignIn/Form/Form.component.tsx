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
import FormField from '@components/Auth/Defaults/FormField/FormField.component';
import FormButtons from '@components/Auth/Defaults/FormButtons/FormButtons.component';
import Spinner from '@components/Auth/Defaults/Spinner/Spinner.component';

import {
  AuthFormContainer,
  AuthFormFieldsContainer,
  AuthFormContentContainer,
} from '@components/Default/View/View.component';
import { AuthNavigationText } from '@components/Default/Text/Text.component';

//Formik
import { Formik } from 'formik';

//React Navigation
import { useNavigation } from '@react-navigation/native';

//axios
import axios from 'axios';

export default function Form(): ReactElement {
  const navigation = useNavigation<NavigationProps>();
  const fontInitialValues: SignInFormData = {
    nickname: '',
    password: '',
  };

  const [isLoading, setIsLoading] = React.useState(false);

  // go to the sign up screen
  const onNavigationTextHandler = () => {
    navigation.replace(NAVIGATION_AUTH_NAMES.SIGN_UP);
  };

  // submitting (log in)
  const onFormSubmitHandler = ({ nickname, password }: SignInFormData) => {
    setIsLoading(true);
    axios
      .post<{ accessToken: string; refreshToken: string }>(
        `${process.env.API_URL}/auth/login`,
        {
          nickname: nickname.trim(),
          password,
        },
      )
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
          () => {
            setIsLoading(false);
          },
        );
      });
  };

  // returning home
  const handleReturnToHome = () => {
    navigation.replace(NAVIGATION_NAMES.NOTES_OVERVIEW);
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

Form.defaultProps = {
  API_URL: (process.env.API_URL = 'http://localhost:5000'),
};
