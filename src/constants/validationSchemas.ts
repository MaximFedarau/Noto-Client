import { object, string, ref } from 'yup';

export const recordSchema = object().shape({
  title: string().nullable(),
  content: string().nullable(),
});

export const signInSchema = object().shape({
  nickname: string().trim().required('Nickname is required.'),
  password: string().required('Password is required.'),
});

export const signUpSchema = object().shape({
  nickname: string().trim().required('Nickname is required.'),
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
