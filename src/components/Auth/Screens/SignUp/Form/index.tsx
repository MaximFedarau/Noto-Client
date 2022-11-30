import React, { FC } from 'react';
import { useNavigation } from '@react-navigation/native';
import { setItemAsync } from 'expo-secure-store';
import { Formik } from 'formik';
import { AxiosError } from 'axios';

import FormField from '@components/Auth/Default/FormField';
import Spinner from '@components/Auth/Default/Spinner';
import FormButtons from '@components/Auth/Default/FormButtons';
import {
  FormContainer,
  FormFieldsContainer,
  FormContentContainer,
} from '@components/Default/View/View.component';
import { NavigationText } from '@components/Default/Text/Text.component';
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

const Form: FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const formInitialValues: SignUpData = {
    nickname: '',
    password: '',
    confirmPassword: '',
  };

  const [isLoading, setIsLoading] = React.useState(false);

  const handleNavigateSignIn = () => {
    if (!isLoading) navigation.replace(NavigationAuthName.SIGN_IN);
  };

  const handleReturnToHome = () =>
    navigation.navigate(NavigationName.NOTES_OVERVIEW);

  const onFormSubmitHandler = async ({ nickname, password }: SignUpData) => {
    setIsLoading(true);
    const instance = createAPIInstance();
    const trimmedNickname = nickname.trim();

    try {
      const { data: signUpData } = await instance.post<{ id: string }>(
        `/auth/signup`,
        {
          nickname: trimmedNickname,
          password,
        },
      );
      const { id } = signUpData;

      const { data } = await instance.post<AuthTokens>(`/auth/login`, {
        nickname: trimmedNickname,
        password,
      });
      await setItemAsync('accessToken', data.accessToken);
      await setItemAsync('refreshToken', data.refreshToken);
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
        response && response.data
          ? response.data.message
          : 'Something went wrong:(',
      );
    }
  };

  return (
    <FormContainer>
      <Formik
        initialValues={formInitialValues}
        onSubmit={onFormSubmitHandler}
        validationSchema={signUpFormValidationSchema}
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
            </FormFieldsContainer>
            <NavigationText onPress={handleNavigateSignIn}>
              Sign In
            </NavigationText>
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
          </FormContentContainer>
        )}
      </Formik>
    </FormContainer>
  );
};

export default Form;
