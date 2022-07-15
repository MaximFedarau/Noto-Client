//Types
import React, { ReactElement } from 'react';
import { NotesManagingFormData, NavigationProps } from '@app-types/types';
import { BUTTON_TYPES } from '@app-types/enum';

//Constants
import { notesManagingFormValidationSchema } from '@constants/validationSchemas';
import { addDraft } from '@utils/db/drafts/add';
import { updateDraft } from '@utils/db/drafts/update';

//Components
import Button from '@components/Default/Button/Button.component';
import FormField from '@components/NotesManaging/FormField/FormField.component';
import MarkdownField from '@components/NotesManaging/MarkdownField/MarkdownField.component';

import { FormView } from '@components/Default/View/View.component';

//Formik
import { Formik } from 'formik';

//React Navigation
import { useNavigation } from '@react-navigation/native';

// Showdown
import * as showdown from 'showdown';

export default function Form(): ReactElement {
  const [noteId, setNoteId] = React.useState<string | null>(null);

  const navigation = useNavigation<NavigationProps>();

  const converter = new showdown.Converter();

  const formInitialValues: NotesManagingFormData = {
    title: '',
    content: '',
  };

  function onFormSubmitHandler(values: NotesManagingFormData) {
    console.log(values);
  }

  function saveToDrafts(values: NotesManagingFormData) {
    if (!values.title) return;
    if (noteId) {
      updateDraft(
        noteId,
        values.title,
        converter.makeHtml(values.content),
      ).catch((error) => {
        console.log(error, 'updating draft');
      });
    } else {
      addDraft(values.title, converter.makeHtml(values.content))
        .then((result) => {
          setNoteId(String(result.insertId));
        })
        .catch((error) => {
          console.log(error, 'adding draft');
        });
    }
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

        React.useEffect(() => {
          saveToDrafts(values);
        }, [values]);

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
