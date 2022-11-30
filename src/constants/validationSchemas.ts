import { object, string, ref } from 'yup';

// * Notes Managing (Adding Note/Draft) Form
export const notesManagingFormValidationSchema = object().shape({
  title: string().nullable(),
  content: string().nullable(),
});

// * Sign In Form
export const signInFormValidationSchema = object().shape({
  nickname: string().required('Nickname is required.'),
  password: string().required('Password is required.'),
});

// * Sign Up Form
export const signUpFormValidationSchema = object().shape({
  nickname: string().required('Nickname is required.'),
  password: string()
    .required('Password is required.')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      'Password is too weak.',
    ),
  confirmPassword: string()
    .oneOf([ref('password')], 'Passwords must match.')
    .required('Confirm your password.'),
});
