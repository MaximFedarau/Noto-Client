import React, { ReactElement } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Formik, FormikProps } from 'formik';
import { useNavigation, useRoute } from '@react-navigation/native';

import Error from '@screens/Error/Error.screen';
import Loading from '@screens/Loading/Loading.screen';
import IconButton from '@components/Default/IconButton/IconButton.component';
import Button from '@components/Default/Button/Button.component';
import FormField from '@components/NotesManaging/FormField/FormField.component';
import MarkdownField from '@components/NotesManaging/MarkdownField/MarkdownField.component';
import { FormView } from '@components/Default/View/View.component';
import { RightHeaderView } from '@components/Default/View/View.component';
import { notesManagingFormValidationSchema } from '@constants/validationSchemas';
import { addDraft } from '@utils/db/drafts/add';
import { fetchDraftById } from '@utils/db/drafts/fetch';
import { updateDraft } from '@utils/db/drafts/update';
import { deleteDraftById, deleteDraftIfEmpty } from '@utils/db/drafts/delete';
import {
  NotesManagingFormData,
  NavigationProps,
  NavigationRouteProp,
} from '@app-types/types';
import { BUTTON_TYPES } from '@app-types/enum';

export default function Form(): ReactElement {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<NavigationRouteProp>();

  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState<boolean>(false);
  const [noteId, setNoteId] = React.useState<string | null>(null);
  const [formInitialValues, setFormInitialValues] =
    React.useState<NotesManagingFormData>({
      title: '',
      content: '',
    });

  const appState = React.useRef(AppState.currentState);
  const formRef = React.useRef<FormikProps<NotesManagingFormData> | undefined>(
    undefined,
  ) as React.MutableRefObject<FormikProps<NotesManagingFormData>>;

  React.useEffect(() => {
    if (route.params) return;
    createEmptyDraft('Adding Draft');
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
        errorHandling(error, 'Deleting empty Draft');
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
      // deleting draft, when app goes to the background
      if (!noteId) return;
      deleteDraftIfEmpty(noteId);
    }

    // restoring draft when app comes back from the background (including Notification Center and etc. on iOS)
    if (
      (appState.current === 'background' || appState.current === 'inactive') &&
      nextAppState === 'active'
    ) {
      const { title, content } = formRef.current?.values ?? {};
      if (!title && !content) createEmptyDraft('Adding Draft after deletion');
    }

    appState.current = nextAppState;
  };

  const fetchingDraft = () => {
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
        errorHandling(error, 'Fetching Draft');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const createEmptyDraft = (errorMessage: string) => {
    addDraft('', '')
      .then((result) => {
        setIsError(false);
        setNoteId((prevNoteId) => {
          if (prevNoteId) return prevNoteId;
          return String(result.insertId);
        });
      })
      .catch((error) => {
        errorHandling(error, errorMessage);
      });
  };

  const onFormSubmitHandler = (values: NotesManagingFormData) => {
    console.log(values);
  };

  // saving to Drafts section
  const saveToDrafts = (values: NotesManagingFormData) => {
    if (!noteId) return;
    updateDraft(noteId, values.title || '', values.content)
      .then(() => {
        setIsError(false);
      })
      .catch((error) => {
        errorHandling(error, 'Updating Draft');
      });
  };

  // deleting draft
  const onDraftDeleteHandler = async () => {
    if (!noteId) return;
    await deleteDraftById(noteId).catch((error) => {
      errorHandling(error, 'Deleting Draft');
    });
    navigation.goBack();
  };

  const errorHandling = (error: string, message: string) => {
    setIsError(true);
    console.error(error, message);
  };

  // * Cases handlers
  if (isError) return <Error />;
  if (isLoading) return <Loading />;

  return (
    <Formik
      initialValues={formInitialValues}
      onSubmit={onFormSubmitHandler}
      validationSchema={notesManagingFormValidationSchema}
      innerRef={formRef}
      enableReinitialize={true}
    >
      {({ values, handleChange, handleSubmit, errors }) => {
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
