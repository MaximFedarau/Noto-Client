import * as yup from 'yup';

export const notesManagingFormValidationSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  content: yup.string(),
});
