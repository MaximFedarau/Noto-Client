//Types
import React, { ReactElement } from 'react';
import {
  NotesManagingFormData,
  NavigationProps,
  NavigationRouteProp,
} from '@app-types/types';
import { BUTTON_TYPES } from '@app-types/enum';
import { AppState, AppStateStatus } from 'react-native';

//Constants
import { notesManagingFormValidationSchema } from '@constants/validationSchemas';

import { addDraft } from '@utils/db/drafts/add';
import { fetchDraftById } from '@utils/db/drafts/fetch';
import { updateDraft } from '@utils/db/drafts/update';
import { deleteDraftById, deleteDraftIfEmpty } from '@utils/db/drafts/delete';

//Screens
import Error from '@screens/Error/Error.screen';
import Loading from '@screens/Loading/Loading.screen';

//Components
import IconButton from '@components/Default/IconButton/IconButton.component';
import Button from '@components/Default/Button/Button.component';
import FormField from '@components/NotesManaging/FormField/FormField.component';
import MarkdownField from '@components/NotesManaging/MarkdownField/MarkdownField.component';

import { FormView } from '@components/Default/View/View.component';
import { RightHeaderView } from '@components/Default/View/View.component';

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

  // * Refs
  const appState = React.useRef(AppState.currentState);

  // * Effects

  React.useEffect(() => {
    if (route.params) return;
    addDraft('', '')
      .then((result) => {
        setIsError(false);
        setNoteId((prevNoteId) => {
          if (prevNoteId) return prevNoteId;
          return String(result.insertId);
        });
      })
      .catch((error) => {
        setIsError(true);
        console.error(error, 'Adding Draft');
      });
  }, []); // when open this screen, then automatically new draft is created

  React.useLayoutEffect(() => {
    if (!route.params || !route.params.id) return;
    setIsLoading(true);
    fetchingDraft();
    setNoteId(route.params.id);
  }, []); // setting info, depending on params

  React.useLayoutEffect(() => {
    return () => {
      if (!noteId) return;
      deleteDraftIfEmpty(noteId).catch((error) => {
        console.error(error, 'Deleting empty Draft');
        setIsError(true);
      });
    };
  }, [noteId]); //  deleteing empty draft, when exiting screen

  React.useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      _handleAppStateChange,
    );
    return () => {
      subscription.remove();
    };
  }, [noteId]); // handling when app goes to the background

  // if current note is empty and app goes to the background, then we delete this note
  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.current === 'active') {
      if (!noteId) return;
      deleteDraftIfEmpty(noteId);
    }

    appState.current = nextAppState;
  };

  // * Methods

  // fetching draft info
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
        console.error(error, 'Fetching Draft');
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // on form submit method
  function onFormSubmitHandler(values: NotesManagingFormData) {
    console.log(values);
  }

  // saving to Drafts section
  function saveToDrafts(values: NotesManagingFormData) {
    if (!noteId) return;
    updateDraft(noteId, values.title!, values.content)
      .then(() => {
        setIsError(false);
      })
      .catch((error) => {
        setIsError(true);
        console.error(error, 'Updating Draft');
      });
  }

  // deleting draft
  async function onDraftDeleteHandler() {
    if (!noteId) return;
    await deleteDraftById(noteId).catch((error) => {
      console.error(error, 'Deleting Draft');
      setIsError(true);
    });
    navigation.goBack();
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
            values.title && values.title.length > 16
              ? values.title.substring(0, 16) + '...'
              : values.title || 'Manage Note';
          navigation.setOptions({
            headerTitle: title,
          });
        }, [values.title]);

        React.useEffect(() => {
          saveToDrafts(values);
          navigation.setOptions({
            headerRight:
              values.title || values.content
                ? () => {
                    return (
                      <RightHeaderView>
                        <IconButton
                          iconName="trash"
                          size={32}
                          color="red"
                          onPress={onDraftDeleteHandler}
                        />
                      </RightHeaderView>
                    );
                  }
                : () => null,
          });
        }, [values]);

        // * Form
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
