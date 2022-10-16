import React, { ReactElement } from 'react';
import {
  AppState,
  AppStateStatus,
  Alert,
  GestureResponderEvent,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Formik, FormikProps } from 'formik';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import Error from '@screens/Error/Error.screen';
import Loading from '@screens/Loading/Loading.screen';
import IconButton from '@components/Default/IconButton/IconButton.component';
import Button from '@components/Default/Button/Button.component';
import FormField from '@components/NotesManaging/FormField/FormField.component';
import MarkdownField from '@components/NotesManaging/MarkdownField/MarkdownField.component';
import {
  FormView,
  NotesManagingLeftHeaderView,
  NotesManagingRightHeaderView,
} from '@components/Default/View/View.component';
import { notesManagingFormValidationSchema } from '@constants/validationSchemas';
import { sizes } from '@constants/sizes';
import { addDraft } from '@utils/db/drafts/add';
import { fetchDraftById } from '@utils/db/drafts/fetch';
import { updateDraftById } from '@utils/db/drafts/update';
import { deleteDraftById } from '@utils/db/drafts/delete';
import {
  NotesManagingFormData,
  NavigationProps,
  NotesManagingRouteProp,
  NoteSchema,
} from '@app-types/types';
import { BUTTON_TYPES } from '@app-types/enum';
import { createAPIInstance } from '@utils/requests/instance';
import { showingSubmitError } from '@utils/toastInteraction/showingSubmitError';
import { showingSuccess } from '@utils/toastInteraction/showingSuccess';
import {
  publicDataInitialState,
  setIsAuth,
} from '@store/publicData/publicData.slice';
import { setPublicData } from '@store/publicData/publicData.slice';
import { addNote, removeNote, updateNote } from '@store/notes/notes.slice';
import {
  updateDraft,
  addDraft as appendDraft,
  removeDraft,
} from '@store/drafts/drafts.slice';

import { styles } from './Form.styles';

export default function Form(): ReactElement {
  const dispatch = useDispatch();

  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<NotesManagingRouteProp>();

  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState<boolean>(false);
  const [formInitialValues, setFormInitialValues] =
    React.useState<NotesManagingFormData>({
      title: '',
      content: '',
    });

  const appState = React.useRef(AppState.currentState);
  const formRef = React.useRef<FormikProps<NotesManagingFormData> | undefined>(
    undefined,
  ) as React.MutableRefObject<FormikProps<NotesManagingFormData>>;

  const defaultInstance = createAPIInstance(() => {
    dispatch(setPublicData(publicDataInitialState));
    dispatch(setIsAuth(false));
    navigation.goBack();
    //after setting isAuth to false, other logout actions will be called by fetchNotesPack useEffect in Notes.screen
  });

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        // if all fields are the same or there is no noteId, then we do not show alert
        if (!formRef.current?.dirty || !route.params?.noteId) return;

        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert(
          'Discard changes?',
          'You have unsaved changes. Are you sure to discard them and leave the screen?',
          [
            { text: "Don't leave", style: 'cancel' },
            {
              text: 'Discard',
              style: 'destructive',
              // If the user confirmed, then we dispatch the action we blocked earlier
              // This will continue the action that had triggered the removal of the screen
              onPress: () => navigation.dispatch(e.data.action),
            },
          ],
        );
      }),
    [navigation],
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: ({ tintColor }) => (
        <NotesManagingLeftHeaderView>
          <IconButton
            iconName="close-outline"
            size={sizes.SIDE_ICON_SIZE}
            color={tintColor}
            onPress={() => navigation.goBack()}
          />
        </NotesManagingLeftHeaderView>
      ),
    });

    if (route.params?.noteId) {
      setIsLoading(true);
      fetchingNote();
    }

    if (route.params?.draftId) {
      setIsLoading(true);
      fetchingDraft();
    }

    return () => {
      if (route.params?.noteId) return;

      const { title = '', content = '' } = formRef.current?.values || {};
      const trimmedTitle = title.trim();
      const trimmedContent = content.trim();

      // if draft exists
      if (route.params?.draftId) {
        if (trimmedTitle === '' && trimmedContent === '') {
          deleteDraftById(route.params?.draftId).then(() => {
            if (route.params?.draftId)
              dispatch(removeDraft(route.params?.draftId));
          });
        } else {
          if (!formRef.current?.dirty) return;
          const updateData = {
            id: route.params?.draftId,
            date: new Date().toISOString(),
            title: trimmedTitle,
            content: trimmedContent,
          };
          updateDraftById(updateData).then(() => {
            dispatch(updateDraft(updateData));
          });
        }
        return;
      }

      if (trimmedTitle !== '' || trimmedContent !== '') {
        const draftData = {
          date: new Date().toISOString(),
          title: trimmedTitle,
          content: trimmedContent,
        };
        addDraft(draftData).then(({ insertId }) => {
          dispatch(
            appendDraft({
              id: String(insertId),
              ...draftData,
            }),
          );
        });
      }
    };
  }, [route]);

  React.useEffect(() => {
    if (route.params?.noteId) return;
    const subscription = AppState.addEventListener(
      'change',
      _handleAppStateChange,
    );
    return () => subscription.remove();
  }, [route.params]); // handling when app goes to the background

  // if current note is empty and app goes to the background, then we delete this note
  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.current === 'active') {
      const { title = '', content = '' } = formRef.current?.values || {};
      const trimmedTitle = title.trim();
      const trimmedContent = content.trim();

      if (!route.params?.draftId) {
        if (trimmedTitle === '' && trimmedContent === '') return;

        const draftData = {
          date: new Date().toISOString(),
          title: trimmedTitle,
          content: trimmedContent,
        };
        addDraft(draftData)
          .then(({ insertId }) => {
            setIsError(false);
            navigation.setParams({ draftId: String(insertId) }); // setting draftId to route params => we will work with the draft
            dispatch(
              appendDraft({
                id: String(insertId),
                ...draftData,
              }),
            );
          })
          .catch((error) => {
            errorHandling(
              error,
              'Error while adding draft when app goes to the background',
            );
          });
        return;
      }

      const { draftId } = route.params;

      if (trimmedTitle === '' && trimmedContent === '') {
        deleteDraftById(draftId).then(() => {
          navigation.setParams({ draftId: null });
        });
        return;
      }

      if (!formRef.current?.dirty) return;

      const updateData = {
        id: draftId,
        date: new Date().toISOString(),
        title: trimmedTitle,
        content: trimmedContent,
      };
      updateDraftById(updateData).then(() => {
        setFormInitialValues({ title: trimmedTitle, content: trimmedContent });
        dispatch(updateDraft(updateData));
      });
    }

    appState.current = nextAppState;
  };

  const fetchingDraft = () => {
    if (!route.params || !route.params.draftId) return;

    fetchDraftById(route.params.draftId)
      .then(({ title, content }) => {
        setFormInitialValues({
          title,
          content,
        });
        setIsError(false);
      })
      .catch((error) => errorHandling(error, 'Fetching Draft'))
      .finally(() => setIsLoading(false));
  };

  const fetchingNote = () => {
    if (!route.params || !route.params.noteId) return;

    defaultInstance
      .get<NoteSchema>(`/notes/${route.params.noteId}`)
      .then(({ data }) => {
        setIsError(false);
        const { title, content } = data;
        setFormInitialValues({
          title,
          content,
        });
      })
      .catch((error) => errorHandling(error, 'Fetching Note'))
      .finally(() => setIsLoading(false));
  };

  const onNoteUpdateHandler = async (values: NotesManagingFormData) => {
    if (!route.params || !route.params.noteId) return;

    setIsLoading(true);
    const accessToken = await SecureStore.getItemAsync('accessToken');
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    if (!accessToken || !refreshToken) {
      navigation.goBack();
      return;
    }

    const { title = '', content = '' } = values;
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    defaultInstance
      .put<NoteSchema>(`/notes/${route.params.noteId}`, {
        title: trimmedTitle,
        content: trimmedContent,
      })
      .then(({ data }) => {
        const { id, title, content, date } = data;
        dispatch(
          updateNote({
            id,
            title,
            content,
            date,
          }),
        );
        navigation.goBack();
      })
      .catch(({ response }) => {
        if (response.status === 401) return;

        setIsLoading(false);
        showingSubmitError(
          'Note Updating Error',
          response.data ? response.data.message : 'Something went wrong:(',
          40,
          () => submittingFailureHandler(values),
        );
      });
  };

  const onFormSubmitHandler = async (values: NotesManagingFormData) => {
    setIsLoading(true);
    const accessToken = await SecureStore.getItemAsync('accessToken');
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    if (!accessToken || !refreshToken) {
      unauthHandler(values);
      return;
    }

    const instance = createAPIInstance(() => {
      dispatch(setPublicData(publicDataInitialState));
      dispatch(setIsAuth(false));
      unauthHandler(values);
    });
    const data = await instance
      .post<NoteSchema>('/notes', {
        title: values.title?.trim() || undefined, // because if title is empty, then it is undefined, instead of empty string
        content: values.content?.trim() || undefined, // because if content is empty, then it is undefined, instead of empty string
      })
      .catch(({ response }) => {
        if (response.status === 401) return;

        showingSubmitError(
          'Note Uploading Error',
          response.data ? response.data.message : 'Something went wrong:(',
          40,
          () => submittingFailureHandler(values),
        );
      });

    if (!data) return;

    showingSuccess(
      'Congratulations!',
      'Note was successfully uploaded and draft was deleted.',
      40,
      () => {
        dispatch(addNote(data.data));
        if (route.params?.draftId) {
          onDraftDeleteHandler();
          return;
        }
        setIsLoading(false);
        if (formRef.current) formRef.current.resetForm();
      },
    );
  };

  // returning previous form values if submitting was failed
  const submittingFailureHandler = (values: NotesManagingFormData) => {
    setIsLoading(false);
    if (formRef.current) formRef.current.setValues(values);
  };

  const unauthHandler = (values: NotesManagingFormData) => {
    submittingFailureHandler(values);
    Alert.alert('Oops...', 'You are not logged in:(');
  };

  const errorHandling = (error: string, message: string) => {
    setIsError(true);
    console.error(error, message);
  };

  function onDraftDeleteHandler() {
    if (!route.params || !route.params.draftId) {
      formRef.current.resetForm({
        values: {
          title: '',
          content: '',
        },
      });
      return;
    }

    deleteDraftById(route.params.draftId)
      .then(() => {
        if (route.params?.draftId) dispatch(removeDraft(route.params?.draftId));
        navigation.setParams({ draftId: null });

        if (formRef.current)
          formRef.current.resetForm({
            values: {
              title: '',
              content: '',
            },
          });
        navigation.goBack();
      })
      .catch((error) => errorHandling(error, 'Deleting Draft'));
  }

  function onNoteDeleteHandler() {
    if (!route.params || !route.params.noteId) return;
    setIsLoading(true);

    const { noteId } = route.params;
    defaultInstance
      .delete(`/notes/${noteId}`)
      .then(() => {
        dispatch(removeNote(noteId));
        navigation.goBack();
      })
      .catch((error) => {
        setIsLoading(false);
        errorHandling(error, 'Fetching Note');
      });
  }

  if (isError) return <Error />;
  if (isLoading) return <Loading />;

  return (
    <Formik
      initialValues={formInitialValues}
      onSubmit={
        route.params?.noteId ? onNoteUpdateHandler : onFormSubmitHandler
      }
      validationSchema={notesManagingFormValidationSchema}
      innerRef={formRef}
      enableReinitialize={true}
    >
      {({ values, handleChange, handleSubmit, errors }) => {
        React.useLayoutEffect(() => {
          const { title } = values;
          const convertedTitle =
            title && title.length > 16
              ? title?.substring(0, 16) + '...'
              : title || 'Manage Note';
          navigation.setOptions({
            headerTitle: convertedTitle,
          });
        }, [values.title]);

        React.useLayoutEffect(() => {
          navigation.setOptions({
            headerRight:
              values.title || values.content
                ? () => {
                    return (
                      <NotesManagingRightHeaderView>
                        <IconButton
                          iconName="trash"
                          size={sizes.SIDE_ICON_SIZE}
                          color="red"
                          onPress={
                            route.params?.noteId
                              ? onNoteDeleteHandler
                              : onDraftDeleteHandler
                          }
                        />
                      </NotesManagingRightHeaderView>
                    );
                  }
                : () => null,
          });
        }, [values]);

        return (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.contentContainer}
          >
            <FormView
              bounces={false}
              contentContainerStyle={styles.contentContainer}
            >
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
              <Button
                type={BUTTON_TYPES.CONTAINED}
                style={styles.submitButton}
                onPress={
                  // ! formik docs
                  handleSubmit as unknown as (
                    event: GestureResponderEvent,
                  ) => void
                }
              >
                {route.params?.noteId ? 'Update' : 'Upload'}
              </Button>
            </FormView>
          </KeyboardAvoidingView>
        );
      }}
    </Formik>
  );
}
