//Types
import { ReactElement } from 'react';
import { NavigationProps, SignInFormData } from '@app-types/types';

//Constants
import { NAVIGATION_NAMES, NAVIGATION_AUTH_NAMES } from '@app-types/enum';
import { signInFormValidationSchema } from '@constants/validationSchemas';

//Components
import { AuthInput } from '@components/Default/Input/Input.component';
import { AuthNavigationText } from '@components/Default/Text/Text.component';
import { FormSubmitButton, HomeButton } from './Form.styles';

//React Native
import { View, Platform } from 'react-native';

//Formik
import { Formik } from 'formik';

//React Navigation
import { useNavigation } from '@react-navigation/native';

export default function Form(): ReactElement {
  // * Variables

  const navigation = useNavigation<NavigationProps>();

  const formSelectionColor = {
    ...(Platform.OS === 'ios' && { selectionColor: 'black' }),
  };

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
    <View style={{ paddingVertical: 16 }}>
      <Formik
        initialValues={fontInitialValues}
        onSubmit={onFormSubmitHandler}
        validationSchema={signInFormValidationSchema}
      >
        {({ values, handleChange, handleSubmit }) => (
          <View style={{ alignItems: 'center' }}>
            <View>
              <AuthInput
                value={values.nickname}
                onChangeText={handleChange('nickname')}
                placeholder="Nickname:"
                {...formSelectionColor}
              />
              <AuthInput
                value={values.password}
                onChangeText={handleChange('password')}
                placeholder="Password:"
                {...formSelectionColor}
              />
            </View>
            <AuthNavigationText onPress={onNavigationTextHandler}>
              Sign Up
            </AuthNavigationText>
            <View style={{ marginTop: 32, alignItems: 'center' }}>
              <FormSubmitButton
                onPress={handleSubmit}
                textStyle={{
                  color: 'white',
                  fontSize: 22,
                  fontWeight: 'bold',
                }}
              >
                Sign In
              </FormSubmitButton>
              {/* ! Formik behaviour */}
              <HomeButton
                iconName="home"
                color="white"
                size={24}
                onPress={onHomeReturnHandler}
              />
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}
