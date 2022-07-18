import * as yup from 'yup';

export const notesManagingFormValidationSchema = yup.object().shape({
  title: yup.string(),
  content: yup.string(),
});
