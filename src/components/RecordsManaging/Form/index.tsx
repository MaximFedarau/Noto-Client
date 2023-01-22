import React, {
  FC,
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  MutableRefObject,
} from 'react';
import {
  AppState,
  AppStateStatus,
  Alert,
  GestureResponderEvent,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { getItemAsync } from 'expo-secure-store';
import { Formik, FormikProps } from 'formik';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { Error } from '@screens/Error';
import { Loading } from '@screens/Loading';
import { RecordsManagingFormField } from '@components/RecordsManaging/FormField';
import { MarkdownField } from '@components/RecordsManaging/MarkdownField';
import {
  Button,
  IconButton,
  Spinner,
  ScrollContainer,
} from '@components/Default';
import { COLORS, recordSchema, SIZES } from '@constants';
import {
  addDraft,
  fetchDraftById,
  updateDraftById,
  deleteDraftById,
  createAPIInstance,
  showToast,
} from '@utils';
import {
  RootStackScreenProps,
  ButtonType,
  ToastType,
  RecordsManagingData,
  Record,
  SocketNote,
  SocketNoteStatus,
  SocketErrorCode,
  AxiosMessageError,
  NavigationName,
} from '@types';
import { clearUser, setIsAuth, userIsAuthSelector } from '@store/user';
import {
  updateDraft,
  addDraft as appendDraft,
  removeDraft,
} from '@store/drafts';
import { socketSelector } from '@store/socket';

import { styles } from './styles';

const FORCE_NAVIGATION_STATUS = 'force'; // status for force navigation, i.e. navigation without checking

type ScreenProps = RootStackScreenProps<NavigationName.RECORDS_MANAGING>;

export const RecordsManagingForm: FC = () => {
  const dispatch = useDispatch();

  const isAuth = useSelector(userIsAuthSelector);
  const socket = useSelector(socketSelector);

  const navigation = useNavigation<ScreenProps['navigation']>();
  const route = useRoute<ScreenProps['route']>();

  const [isLoading, setIsLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [formInitialValues, setFormInitialValues] =
    useState<RecordsManagingData>({ title: '', content: '' });

  const appState = useRef(AppState.currentState);
  const formRef = useRef<
    FormikProps<RecordsManagingData> | undefined
  >() as MutableRefObject<FormikProps<RecordsManagingData>>;

  const defaultInstance = createAPIInstance(() => {
    dispatch(clearUser());
    dispatch(setIsAuth(false));
    if (formRef.current) formRef.current.setStatus(FORCE_NAVIGATION_STATUS); // we check formRef.current because it can be undefined, e.g when token is expired and users tries to do something
    navigation.goBack();
    //after setting isAuth to false, other logout actions will be called by fetchNotesPack useEffect in Notes.screen
  });

  useEffect(
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

  useEffect(() => {
    if (route.params?.noteId) return;
    const subscription = AppState.addEventListener(
      'change',
      _handleAppStateChange,
    );
    return () => subscription.remove();
  }, [route.params]); // handling when app goes to the background

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: ({ tintColor }) => (
        <IconButton
          iconName="close-sharp"
          size={SIZES['4xl']}
          color={tintColor}
          onPress={() => navigation.goBack()}
        />
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
      draftCleanup();
    };
  }, [route.params]);

  useEffect(() => {
    if (isLoading || isError) return;
    // if user is not authorized and tries to open or edit note, then we go back
    if (!isAuth && (route.params?.noteId || isFormLoading)) {
      formRef.current?.setStatus(FORCE_NAVIGATION_STATUS);
      navigation.goBack();
    }
  }, [isAuth, isLoading, isError, isFormLoading]); // route is not included because route.params?.noteId is not changing

  // if current note is empty and app goes to the background, then we delete this note
  const _handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (appState.current === 'active') {
      const { title = '', content = '' } = formRef.current?.values;
      const trimmedTitle = title.trim();
      const trimmedContent = content.trim();

      if (!route.params?.draftId) {
        if (trimmedTitle === '' && trimmedContent === '') return;

        const draftData = { date: new Date().toISOString(), title, content };
        const { insertId } = await addDraft(draftData);
        setIsError(false);
        navigation.setParams({ draftId: String(insertId) }); // setting draftId to route params => we will work with the draft
        dispatch(appendDraft({ id: String(insertId), ...draftData }));
        return;
      }

      const { draftId } = route.params;

      if (trimmedTitle === '' && trimmedContent === '') {
        await deleteDraftById(draftId);
        navigation.setParams({ draftId: null });
        return;
      }

      if (!formRef.current?.dirty) return;

      const updateData = {
        id: draftId,
        date: new Date().toISOString(),
        title,
        content,
      };
      await updateDraftById(updateData);
      setFormInitialValues({ title, content });
      dispatch(updateDraft(updateData));
    }

    appState.current = nextAppState;
  };

  const draftCleanup = async () => {
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
        await deleteDraftById(route.params?.draftId);
        dispatch(removeDraft(route.params?.draftId));
      } else {
        if (!formRef.current?.dirty) return;
        const updateData = {
          id: route.params?.draftId,
          date: new Date().toISOString(),
          title,
          content,
        };
        await updateDraftById(updateData);
        dispatch(updateDraft(updateData));
      }
      return;
    }

    if (trimmedTitle !== '' || trimmedContent !== '') {
      const draftData = { date: new Date().toISOString(), title, content };
      const { insertId } = await addDraft(draftData);
      dispatch(appendDraft({ id: String(insertId), ...draftData }));
    }
  };

  const fetchingNote = async () => {
    if (!route.params || !route.params.noteId) return;

    try {
      const { data } = await defaultInstance.get<Record>(
        `/notes/${route.params.noteId}`,
      );
      setIsError(false);
      const { title, content } = data;
      setFormInitialValues({ title, content });
    } catch (error) {
      errorHandling(error as AxiosMessageError, 'Fetching Note');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchingDraft = async () => {
    if (!route.params || !route.params.draftId) return;

    try {
      const { title, content } = await fetchDraftById(route.params.draftId);
      setFormInitialValues({ title, content });
      setIsError(false);
    } catch (error) {
      errorHandling(error as AxiosMessageError, 'Fetching Draft');
    } finally {
      setIsLoading(false);
    }
  };

  const socketCleanup = () => {
    if (socket) {
      socket.off('local');
      socket.off('localError');
    }
  };

  useEffect(() => {
    // ! we check isLoading and isError, because we don't want to send events when we are fetching data
    // ! if we remove this checks, then when we have error screen, it will create another client
    if (socket && !isLoading && !isError) {
      socket.on(
        'local',
        async ({ status, note, isDeleteOrigin }: SocketNote) => {
          if (
            typeof isDeleteOrigin === 'boolean' &&
            !isDeleteOrigin &&
            note.id !== route.params?.noteId
          )
            return; // ! if note is not deleted from current device and note id is not equal to current note id, then we don't do anything

          let message = 'Action was completed successfully';

          switch (status) {
            case SocketNoteStatus.CREATED:
              message = 'Note was created successfully';
              if (route.params?.draftId) {
                await onDraftDeleteHandler();
                showToast(
                  ToastType.SUCCESS,
                  'Congratulations!',
                  'Note was successfully uploaded and draft was deleted.',
                );
                return;
              }
              break;

            case SocketNoteStatus.UPDATED:
              message = 'Note was successfully updated.';
              break;

            case SocketNoteStatus.DELETED:
              message = isDeleteOrigin
                ? 'Note was successfully deleted.'
                : 'Note was successfully deleted from other device.';
              break;
          }

          showToast(ToastType.SUCCESS, 'Congratulations!', message);
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
          status: SocketErrorCode;
          message: string | string[];
        }) => {
          if (status === SocketErrorCode.UNAUTHORIZED) return;

          setIsFormLoading(false);
          showToast(
            ToastType.ERROR,
            'Note Uploading Error',
            Array.isArray(message) ? message[0] : message,
          );
        },
      );
    }

    // removing socket listener, because we don't need it anymore & if we don't do that, we will send duplicate requests
    return () => socketCleanup();
  }, [socket, isLoading, isError]);

  const onNoteUploadHandler = async (values: RecordsManagingData) => {
    const accessToken = await getItemAsync('accessToken');
    const refreshToken = await getItemAsync('refreshToken');
    if (!accessToken || !refreshToken || !socket) {
      Alert.alert('Oops...', 'You are not logged in:(');
      return;
    }

    setIsFormLoading(true);
    const { title = '', content = '' } = values;
    socket.emit('createNote', { title, content });
  };

  const onNoteUpdateHandler = async (values: RecordsManagingData) => {
    if (!route.params || !route.params.noteId) return;

    const accessToken = await getItemAsync('accessToken');
    const refreshToken = await getItemAsync('refreshToken');

    if (!accessToken || !refreshToken || !socket || !formRef.current.dirty) {
      formRef.current?.setStatus(FORCE_NAVIGATION_STATUS);
      navigation.goBack();
      return;
    }

    setIsFormLoading(true);
    const { title = '', content = '' } = values;
    const { noteId } = route.params;
    socket.emit('updateNote', { id: noteId, title, content });
  };

  const onNoteDeleteHandler = async () => {
    if (!route.params || !route.params.noteId) return;

    setIsFormLoading(true);
    const { noteId } = route.params;

    socket?.emit('deleteNote', { noteId });
  };

  const onDraftDeleteHandler = async () => {
    if (!route.params || !route.params.draftId) return;

    try {
      await deleteDraftById(route.params.draftId);
      if (route.params?.draftId) dispatch(removeDraft(route.params?.draftId));
      navigation.setParams({ draftId: null });

      if (formRef.current)
        formRef.current.resetForm({ values: { title: '', content: '' } });
      navigation.goBack();
    } catch (error) {
      errorHandling(error as AxiosMessageError, 'Deleting Draft');
    }
  };

  const errorHandling = ({ response }: AxiosMessageError, message: string) => {
    setIsError(true);
    showToast(
      ToastType.ERROR,
      message,
      response && response.data
        ? response.data.message
        : 'Something went wrong:(',
    );
  };

  if (isError) return <Error />;
  if (isLoading) return <Loading />;

  return (
    <Formik
      initialValues={formInitialValues}
      onSubmit={
        route.params?.noteId ? onNoteUpdateHandler : onNoteUploadHandler
      }
      validationSchema={recordSchema}
      innerRef={formRef}
      enableReinitialize={true}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ values: { title, content }, handleChange, handleSubmit, errors }) => {
        const formatRecordTitle = (title?: string) => {
          if (!title || title.length < 16) return title;
          const substring = title.substring(0, 16);
          if (/^[\p{L}\p{N}]*$/u.test(substring[15])) return substring + '...'; // if it ends with a unicode letter or number
          return substring;
        };

        useLayoutEffect(() => {
          navigation.setOptions({ headerTitle: formatRecordTitle(title) });
        }, [title]);

        useLayoutEffect(() => {
          const isRecord = route.params?.draftId || route.params?.noteId,
            hasContent = title || content;
          navigation.setOptions({
            headerRight:
              hasContent && !isFormLoading && isRecord
                ? () => (
                    <IconButton
                      iconName="trash-sharp"
                      size={SIZES['4xl']}
                      color={COLORS.red}
                      onPress={
                        route.params?.noteId
                          ? onNoteDeleteHandler
                          : onDraftDeleteHandler
                      }
                    />
                  )
                : () => null,
          });

          return () => {
            // removing headerRight, while <Loading/> or <Error/> screens are active
            navigation.setOptions({
              headerRight: () => null,
            });
          };
        }, [title, content, isFormLoading, route.params]);

        return (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.contentContainer}
          >
            <ScrollContainer
              bounces={false}
              contentContainerStyle={styles.contentContainer}
            >
              <RecordsManagingFormField
                onChangeText={handleChange('title')}
                value={title}
                errorMessage={errors.title}
                editable={!isFormLoading}
              >
                Title
              </RecordsManagingFormField>
              <MarkdownField
                onChangeText={handleChange('content')}
                value={content}
                errorMessage={errors.content}
                editable={!isFormLoading}
              >
                Content
              </MarkdownField>
              {isFormLoading ? (
                <Spinner />
              ) : (
                <Button
                  type={ButtonType.CONTAINED}
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
            </ScrollContainer>
          </KeyboardAvoidingView>
        );
      }}
    </Formik>
  );
};
