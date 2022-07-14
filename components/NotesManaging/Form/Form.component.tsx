//Types
import React, { ReactElement } from 'react';
import { NotesManagingFormData, NavigationProps } from '@app-types/types';
import { BUTTON_TYPES } from '@app-types/enum';

//Constants
import { notesManagingFormValidationSchema } from '@constants/validationSchemas';

//Components
import Button from '@components/Default/Button/Button.component';
import FormField from '../FormField/FormField.component';
import MarkdownField from '../MarkdownField/MarkdownField.component';

import { FormView } from '@components/Default/View/View.component';

//Formik
import { Formik } from 'formik';

//React Navigation
import { useNavigation } from '@react-navigation/native';

export default function Form(): ReactElement {
  const navigation = useNavigation<NavigationProps>();

  const formInitialValues: NotesManagingFormData = {
    title: '',
    content: '',
  };

  function onFormSubmitHandler(values: NotesManagingFormData) {
    console.log(values);
  }

  return (
    <Formik
      initialValues={formInitialValues}
      onSubmit={onFormSubmitHandler}
      validationSchema={notesManagingFormValidationSchema}
    >
      {({ values, handleChange, handleSubmit, errors }) => {
        React.useEffect(() => {
          const title =
            values.title.length > 16
              ? values.title.substring(0, 16) + '...'
              : values.title;
          navigation.setOptions({
            headerTitle: title || 'Add Note',
          });
        }, [values.title]);

        return (
          <FormView>
            <FormField
              onChangeText={handleChange('title')}
              value={values.title}
              errorMessage={errors.title}
            >
              Title
            </FormField>
            <MarkdownField
              onChangeText={handleChange('content')}
              value={values.content}
              errorMessage={errors.content}
            >
              Content
            </MarkdownField>
            <Button type={BUTTON_TYPES.CONTAINED} onPress={handleSubmit}>
              Submit
            </Button>
            {/* ! Formik behaviour */}
          </FormView>
        );
      }}
    </Formik>
  );
}
