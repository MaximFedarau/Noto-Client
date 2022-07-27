import * as yup from 'yup';

// * Notes Managing (Adding Note/Draft) Form
export const notesManagingFormValidationSchema = yup.object().shape({
  title: yup.string(),
  content: yup.string(),
});

// * Sign In Form
export const signInFormValidationSchema = yup.object().shape({
  nickname: yup.string().required('Nickname is required.'),
  password: yup.string().required('Password is required.'),
});

// * Sign Up Form
export const signUpFormValidationSchema = yup.object().shape({
  nickname: yup.string().required('Nickname is required.'),
  password: yup
    .string()
    .required('Password is required.')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      'Password is too weak.',
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match.')
    .required('Confirm Password is required.'),
});
