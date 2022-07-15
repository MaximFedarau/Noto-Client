//Types
import React, { ReactElement } from 'react';
import {
  NotesManagingFormData,
  NavigationProps,
  NavigationRouteProp,
} from '@app-types/types';
import { BUTTON_TYPES } from '@app-types/enum';

//Constants
import { notesManagingFormValidationSchema } from '@constants/validationSchemas';
import { NAVIGATION_NAMES } from '@app-types/enum';

import { addDraft } from '@utils/db/drafts/add';
import { fetchDraftById } from '@utils/db/drafts/fetch';
import { updateDraft } from '@utils/db/drafts/update';
import { deleteDraftById } from '@utils/db/drafts/delete';

//Screens
import Error from '@screens/Error/Error.screen';
import Loading from '@screens/Loading/Loading.screen';

//Components
import IconButton from '@components/Default/IconButton/IconButton.component';
import Button from '@components/Default/Button/Button.component';
import FormField from '@components/NotesManaging/FormField/FormField.component';
import MarkdownField from '@components/NotesManaging/MarkdownField/MarkdownField.component';

import { FormView } from '@components/Default/View/View.component';

//Formik
import { Formik } from 'formik';

//React Navigation
import { useNavigation, useRoute } from '@react-navigation/native';

export default function Form(): ReactElement {
  // * Variables

  // * Navigation
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<NavigationRouteProp>();

  // * States
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState<boolean>(false);
  const [noteId, setNoteId] = React.useState<string | null>(null);
  const [formInitialValues, setFormInitialValues] =
    React.useState<NotesManagingFormData>({
      title: '',
      content: '',
    });

  // * Effects

  React.useEffect(() => {
    if (!noteId) return;
    if (isLoading) return;
    navigation.setOptions({
      headerRight: () => {
        return (
          <IconButton
            iconName="trash"
            size={32}
            color="red"
            onPress={onDraftDeleteHandler}
          />
        );
      },
    });
  }, [noteId, isLoading]);

  React.useLayoutEffect(() => {
    if (!route.params || !route.params.id) return;
    setIsLoading(true);
    fetchingDraft();
    setNoteId(route.params.id);
  }, []);

  // * Methods

  function fetchingDraft(): void {
    if (!route.params || !route.params.id) return;
    fetchDraftById(route.params.id)
      .then((draft) => {
        setFormInitialValues({
          title: draft.title,
          content: draft.content,
        });
        setIsError(false);
      })
      .catch((error) => {
        console.log(error, 'fetching draft');
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function onFormSubmitHandler(values: NotesManagingFormData) {
    console.log(values);
  }

  function saveToDrafts(values: NotesManagingFormData) {
    if (!values.title) return;
    if (noteId) {
      updateDraft(noteId, values.title, values.content)
        .then(() => {
          setIsError(false);
        })
        .catch((error) => {
          setIsError(true);
          console.log(error, 'updating draft');
        });
      return;
    }
    addDraft(values.title, values.content)
      .then((result) => {
        setIsError(false);
        setNoteId(String(result.insertId));
      })
      .catch((error) => {
        setIsError(true);
        console.log(error, 'adding draft');
      });
  }

  function onDraftDeleteHandler() {
    if (!noteId) return;
    deleteDraftById(noteId)
      .then(() => {
        setIsError(true);
        navigation.replace(NAVIGATION_NAMES.NOTES_OVERVIEW);
      })
      .catch((error) => {
        console.log(error, 'deleting draft');
        setIsError(true);
      });
  }

  // * Cases handlers
  if (isError) return <Error />;
  if (isLoading) return <Loading />;

  return (
    <Formik
      initialValues={formInitialValues}
      onSubmit={onFormSubmitHandler}
      validationSchema={notesManagingFormValidationSchema}
      enableReinitialize={true}
    >
      {({ values, handleChange, handleSubmit, errors }) => {
        // * Effects
        React.useLayoutEffect(() => {
          const title =
            values.title.length > 16
              ? values.title.substring(0, 16) + '...'
              : values.title;
          navigation.setOptions({
            headerTitle: title || 'Manage Note',
          });
        }, [values.title]);

        React.useEffect(() => {
          saveToDrafts(values);
        }, [values]);

        // * Form
        return (
          <FormView>
            <FormField
              onChangeText={handleChange('title')}
              value={values.title}
              errorMessage={errors.title}
            >
              Title*
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
