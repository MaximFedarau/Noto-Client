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
import { useDispatch, useSelector } from 'react-redux';
import { AxiosError } from 'axios';

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
import Spinner from '@components/Auth/Defaults/Spinner/Spinner.component';
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
  SocketNoteData,
} from '@app-types/types';
import {
  BUTTON_TYPES,
  SOCKET_NOTE_STATUSES,
  SOCKET_ERROR_CODES,
} from '@app-types/enum';
import { createAPIInstance } from '@utils/requests/instance';
import { showingSubmitError } from '@utils/toastInteraction/showingSubmitError';
import { showingSuccess } from '@utils/toastInteraction/showingSuccess';
import {
  publicDataInitialState,
  setIsAuth,
} from '@store/publicData/publicData.slice';
import { publicDataAuthSelector } from '@store/publicData/publicData.selector';
import { setPublicData } from '@store/publicData/publicData.slice';
import {
  updateDraft,
  addDraft as appendDraft,
  removeDraft,
} from '@store/drafts/drafts.slice';
import { socketSelector } from '@store/socket/socket.selector';

import { styles } from './Form.styles';

const FORCE_NAVIGATION_STATUS = 'force'; // status for force navigation = without checking

export default function Form(): ReactElement {
  const dispatch = useDispatch();

  const isAuth = useSelector(publicDataAuthSelector);
  const socket = useSelector(socketSelector);

  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<NotesManagingRouteProp>();

  const [isLoading, setIsLoading] = React.useState(false);
  const [isFormLoading, setIsFormLoading] = React.useState(false);
  const [isError, setIsError] = React.useState<boolean>(false);
  const [formInitialValues, setFormInitialValues] =
    React.useState<NotesManagingFormData>({
      title: '',
      content: '',
    });

  const appState = React.useRef(AppState.currentState);
  const formRef = React.useRef<
    FormikProps<NotesManagingFormData> | undefined
  >() as React.MutableRefObject<FormikProps<NotesManagingFormData>>;

  const defaultInstance = createAPIInstance(() => {
    dispatch(setPublicData(publicDataInitialState));
    dispatch(setIsAuth(false));
    if (formRef.current) formRef.current.setStatus(FORCE_NAVIGATION_STATUS); // we check formRef.current because it can be undefined, e.g when token is expired and users tries to do something
    navigation.goBack();
    //after setting isAuth to false, other logout actions will be called by fetchNotesPack useEffect in Notes.screen
  });

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        // if all fields are the same or there is no noteId, then we do not show alert
        if (
          !formRef.current?.dirty ||
          !route.params?.noteId ||
          formRef.current.status === FORCE_NAVIGATION_STATUS ||
          isFormLoading // if form is loading, then we do not show alert
        )
          return;

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
    [navigation, isFormLoading],
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
      if (
        route.params?.noteId ||
        formRef.current?.status === FORCE_NAVIGATION_STATUS
      )
        return;

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
    if (isLoading || isError) return;
    // if user is not authorized and tries to open or edit note, then we go back
    if (!isAuth && (route.params?.noteId || isFormLoading)) {
      formRef.current?.setStatus(FORCE_NAVIGATION_STATUS);
      navigation.goBack();
    }
  }, [isAuth, isLoading, isError, isFormLoading]); // route is not included because route.params?.noteId is not changing

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

  React.useEffect(() => {
    // ! we check isLoading and isError, because we don't want to send events when we are fetching data
    // ! if we remove this checks, then when we have error screen, it will create another client
    if (socket && !isLoading && !isError) {
      socket.then((socket) => {
        socket.on(
          'local',
          ({ status, note, isDeleteOrigin }: SocketNoteData) => {
            if (
              typeof isDeleteOrigin === 'boolean' &&
              !isDeleteOrigin &&
              note.id !== route.params?.noteId
            )
              return; // ! if note is not deleted from current device and note id is not equal to current note id, then we don't do anything

            let message = 'Action was completed successfully';

            if (status === SOCKET_NOTE_STATUSES.CREATED) {
              message = 'Note was successfully uploaded.';

              if (route.params?.draftId) {
                onDraftDeleteHandler();
                showingSuccess(
                  'Congratulations!',
                  'Note was successfully uploaded and draft was deleted.',
                  40,
                );
                return;
              }
            }

            if (status === SOCKET_NOTE_STATUSES.UPDATED)
              message = 'Note was successfully updated.';

            if (status === SOCKET_NOTE_STATUSES.DELETED)
              message = isDeleteOrigin
                ? 'Note was successfully deleted.'
                : 'Note was successfully deleted from other device.';

            showingSuccess('Congratulations!', message, 40);
            formRef.current.setStatus(FORCE_NAVIGATION_STATUS);
            navigation.goBack();
          },
        );
        socket.on(
          'localError',
          ({
            status,
            message,
          }: {
            status: SOCKET_ERROR_CODES;
            message: string | string[];
          }) => {
            if (status === SOCKET_ERROR_CODES.UNAUTHORIZED) return;

            setIsFormLoading(false);
            showingSubmitError(
              'Note Uploading Error',
              Array.isArray(message) ? message[0] : message,
              40,
            );
          },
        );
      });
    }

    // removing socket listener, because we don't need it anymore & if we don't do that, we will send duplicate requests
    return () => {
      if (socket) {
        socket.then((socket) => {
          socket.off('local');
          socket.off('localError');
        });
      }
    };
  }, [socket, isLoading, isError]);

  const onFormSubmitHandler = async (values: NotesManagingFormData) => {
    const accessToken = await SecureStore.getItemAsync('accessToken');
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    if (!accessToken || !refreshToken || !socket) {
      Alert.alert('Oops...', 'You are not logged in:(');
      return;
    }

    setIsFormLoading(true);
    const { title = '', content = '' } = values;
    (await socket).emit('createNote', {
      title: title.trim(),
      content: content.trim(),
    });
  };

  const onNoteUpdateHandler = async (values: NotesManagingFormData) => {
    if (!route.params || !route.params.noteId) return;

    const accessToken = await SecureStore.getItemAsync('accessToken');
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    // ? also we can check for form dirty, but I don't think it's necessary here, because we have cancel button. For example, such apps as Telegram, Slack and Discord check for form dirty.
    // ? (!accessToken || !refreshToken || !socket || !formRef.current.dirty)
    if (!accessToken || !refreshToken || !socket) {
      formRef.current?.setStatus(FORCE_NAVIGATION_STATUS);
      navigation.goBack();
      return;
    }

    setIsFormLoading(true);
    const { title = '', content = '' } = values;
    const { noteId } = route.params;
    (await socket).emit('updateNote', {
      id: noteId,
      title: title.trim(),
      content: content.trim(),
    });
  };

  const errorHandling = (error: AxiosError, message: string) => {
    setIsError(true);
    showingSubmitError(
      message,
      (error.response?.data as { message?: string })?.message ||
        'Something went wrong:(',
      40,
    );
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

  async function onNoteDeleteHandler() {
    if (!route.params || !route.params.noteId) return;

    setIsFormLoading(true);
    const { noteId } = route.params;

    (await socket)?.emit('deleteNote', { noteId: noteId });
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
              (values.title || values.content) && !isFormLoading
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

          return () => {
            // removing headerRight, while <Loading/> or <Error/> screens are active
            navigation.setOptions({
              headerRight: () => null,
            });
          };
        }, [values, isFormLoading]);

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
                editable={!isFormLoading}
              >
                Title
              </FormField>
              <MarkdownField
                onChangeText={handleChange('content')}
                value={values.content}
                errorMessage={errors.content}
                editable={!isFormLoading}
              >
                Content
              </MarkdownField>
              {isFormLoading ? (
                <Spinner />
              ) : (
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
              )}
            </FormView>
          </KeyboardAvoidingView>
        );
      }}
    </Formik>
  );
}
