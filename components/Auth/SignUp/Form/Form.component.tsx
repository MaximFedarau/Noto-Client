//Types
import { ReactElement } from 'react';
import { NavigationProps, SignUpFormData } from '@app-types/types';

//Constants
import { NAVIGATION_NAMES, NAVIGATION_AUTH_NAMES } from '@app-types/enum';
import { signUpFormValidationSchema } from '@constants/validationSchemas';

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

//Interface for Props
interface FormProps {
  image: string | undefined;
}

export default function Form({ image }: FormProps): ReactElement {
  // * Variables

  const navigation = useNavigation<NavigationProps>();

  const fontInitialValues: SignUpFormData = {
    nickname: '',
    password: '',
    confirmPassword: '',
  };

  // * Methods

  function onNavigationTextHandler() {
    navigation.replace(NAVIGATION_AUTH_NAMES.SIGN_IN);
  }

  function onFormSubmitHandler(values: SignUpFormData) {
    console.log(values, image);
  }

  function onHomeReturnHandler() {
    navigation.replace(NAVIGATION_NAMES.NOTES_OVERVIEW);
  }

  return (
    <AuthFormContainer>
      <Formik
        initialValues={fontInitialValues}
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
                error={errors.nickname}
              >
                {values.nickname}
              </FormField>
              <FormField
                onChangeText={handleChange('password')}
                placeholder="Password:"
                error={errors.password}
                forceErrorShowing
                secureTextEntry
              >
                {values.password}
              </FormField>
              <FormField
                onChangeText={handleChange('confirmPassword')}
                placeholder="Confirm password:"
                error={errors.confirmPassword}
                forceErrorShowing
                secureTextEntry
              >
                {values.confirmPassword}
              </FormField>
            </AuthFormFieldsContainer>
            <AuthNavigationText onPress={onNavigationTextHandler}>
              Sign In
            </AuthNavigationText>
            <FormButtons
              onSubmit={handleSubmit}
              onHomeReturn={onHomeReturnHandler}
            >
              Sign Up
            </FormButtons>
          </AuthFormContentContainer>
        )}
      </Formik>
    </AuthFormContainer>
  );
}
