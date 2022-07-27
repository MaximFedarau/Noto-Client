//Types
import { ReactElement } from 'react';
import { NavigationProps, SignInFormData } from '@app-types/types';

//Constants
import { NAVIGATION_NAMES, NAVIGATION_AUTH_NAMES } from '@app-types/enum';
import { signInFormValidationSchema } from '@constants/validationSchemas';

//Components
import FormField from '@components/Auth/FormField/FormField.component';
import FormButtons from '@components/Auth/FormButtons/FormButtons.component';

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

export default function Form(): ReactElement {
  // * Variables

  const navigation = useNavigation<NavigationProps>();

  const fontInitialValues: SignInFormData = {
    nickname: '',
    password: '',
  };

  // * Methods

  function onNavigationTextHandler() {
    navigation.replace(NAVIGATION_AUTH_NAMES.SIGN_UP);
  }

  function onFormSubmitHandler(values: SignInFormData) {
    console.log(values);
  }

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
            <FormButtons
              onSubmit={handleSubmit}
              onHomeReturn={onHomeReturnHandler}
            >
              Sign In
            </FormButtons>
          </AuthFormContentContainer>
        )}
      </Formik>
    </AuthFormContainer>
  );
}
