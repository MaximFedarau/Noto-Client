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
