import { object, string, ref } from 'yup';

export const recordSchema = object().shape({
  title: string()
    .trim()
    .test(
      'Title can be empty if there is a content.',
      'At least one field is required.',
      (title, context) => {
        const content: string | undefined = context.resolve(ref('content')); // get content value
        if (!title && !content?.trim()) return false;
        else return true;
      },
    ),
  content: string()
    .trim()
    .test(
      'Content can be empty if there is a title.',
      'At least one field is required.',
      (content, context) => {
        const title: string | undefined = context.resolve(ref('title')); // get title value
        if (!content && !title?.trim()) return false;
        else return true;
      },
    ),
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
