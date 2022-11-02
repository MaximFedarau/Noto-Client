import React, { ReactElement } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { isAnyOf } from '@reduxjs/toolkit';
import { Text } from 'react-native';
import { FAB } from '@rneui/themed';
import { debounce } from 'lodash';
import * as SecureStore from 'expo-secure-store';

import Error from '@screens/Error/Error.screen';
import Loading from '@screens/Loading/Loading.screen';
import { LeftHeaderView } from '@components/Default/View/View.component';
import IconButton from '@components/Default/IconButton/IconButton.component';
import SearchBar from '@components/Default/SearchBar/SearchBar.component';
import {
  NotesView,
  NotesContentView,
} from '@components/Default/View/View.component';
import NotesList from '@components/Notes/NotesList/NotesList.component';
import Spinner from '@components/Auth/Defaults/Spinner/Spinner.component';
import { NoItemsText } from '@components/Default/Text/Text.component';
import { SOFT_BLUE } from '@constants/colors';
import { sizes } from '@constants/sizes';
import { NavigationProps, NoteSchema, SocketNoteData } from '@app-types/types';
import {
  NAVIGATION_NAMES,
  FETCH_PACK_TYPES,
  SOCKET_NOTE_STATUSES,
  SOCKET_ERROR_CODES,
} from '@app-types/enum';
import { createAPIInstance } from '@utils/requests/instance';
import { showingSubmitError } from '@utils/toastInteraction/showingSubmitError';
import { createAPIRefreshInstance } from '@utils/requests/instance';
import { stringSearch } from '@utils/stringInteraction/stringSearch';
import { listener, RootState } from '@store/store';
import {
  setIsAuth,
  setPublicData,
  publicDataInitialState,
} from '@store/publicData/publicData.slice';
import { publicDataAuthSelector } from '@store/publicData/publicData.selector';
import { notesSelector, isEndSelector } from '@store/notes/notes.selector';
import {
  clearNotes,
  addNotes,
  assignNotes,
  setIsEnd,
  updateNote,
  addNote,
  removeNote,
} from '@store/notes/notes.slice';
import { socketSelector } from '@store/socket/socket.selector';
import { initSocket, removeSocket } from '@store/socket/socket.slice';

import { styles } from './Notes.styles';

export default function Notes(): ReactElement {
  const navigation = useNavigation<NavigationProps>();

  const cancelledSocketEvents = React.useRef<
    {
      event: string;
      data: object;
    }[]
  >([]);

  const dispatch = useDispatch();
  const socket = useSelector(socketSelector);
  const isAuth = useSelector(publicDataAuthSelector);
  const notes = useSelector(notesSelector);
  const isEnd = useSelector(isEndSelector);

  const [isLoading, setIsLoading] = React.useState<boolean>(true); // general loading
  const [isPackLoading, setIsPackLoading] = React.useState<boolean>(false); // only for pack loading
  const [isError, setIsError] = React.useState<boolean>(false);

  const [openSearchBar, setOpenSearchBar] = React.useState<boolean>(false);
  const [searchText, setSearchText] = React.useState('');

  const [packNumber, setPackNumber] = React.useState<number>(1);

  const instance = createAPIInstance(() => {
    showingSubmitError('Logout', 'Your session has expired', undefined);
    dispatch(clearNotes());
    dispatch(setPublicData(publicDataInitialState));
    dispatch(setIsAuth(false));
    setIsLoading(false);
  });

  const refreshInstance = createAPIRefreshInstance(() => {
    showingSubmitError('Logout', 'Your session has expired', undefined);
    dispatch(setPublicData(publicDataInitialState));
    dispatch(setIsAuth(false));
    // after setting isAuth to false, other logout actions will be called by fetchNotesPack useEffect
  });

  const clearAuthHeader = () => {
    setOpenSearchBar(false);
    setSearchText('');
    navigation.setOptions({
      headerTitle: ({ children, tintColor }) => {
        return (
          <Text style={[{ color: tintColor }, styles.title]}>{children}</Text>
        );
      },
      headerLeft: () => null,
    });
  };

  const onSearchBarChange = React.useCallback(
    debounce((text) => {
      setSearchText(text);
      dispatch(setIsEnd(false));
    }, 300),
    [],
  );

  React.useEffect(() => {
    if (!isAuth) {
      clearAuthHeader();
      return;
    }

    if (notes.length || searchText.length) {
      navigation.setOptions({
        headerTitle: ({ children, tintColor }) => {
          if (openSearchBar)
            return (
              <SearchBar
                placeholder="Search in Notes:"
                onChangeText={onSearchBarChange}
              />
            );
          return (
            <Text style={[{ color: tintColor }, styles.title]}>{children}</Text>
          );
        },
        // open search bar button
        headerLeft: ({ tintColor }) => {
          function onButtonClickHandler() {
            setOpenSearchBar(!openSearchBar);
            // do not fetch again, if searchText is already empty
            if (searchText !== '') dispatch(setIsEnd(false));
            // removing debounce
            onSearchBarChange.cancel();
            setSearchText('');
          }

          return (
            <LeftHeaderView>
              <IconButton
                iconName="search"
                size={sizes.SIDE_ICON_SIZE}
                color={tintColor}
                onPress={onButtonClickHandler}
              />
            </LeftHeaderView>
          );
        },
      });
    } else clearAuthHeader();

    return () => {
      //removing debounce, when component is unmounted
      onSearchBarChange.cancel();
    };
  }, [notes.length, openSearchBar, isAuth]);

  function fetchNotesPack(type: FETCH_PACK_TYPES = FETCH_PACK_TYPES.INITIAL) {
    if (isEnd || isPackLoading) return;
    const isInitial = type === FETCH_PACK_TYPES.INITIAL;

    isInitial ? setIsLoading(true) : setIsPackLoading(true);
    instance
      .get(
        `/notes/pack/${
          isInitial ? 1 : packNumber
        }?pattern=${searchText.trim()}`,
      )
      .then(({ data }) => {
        const { notePack, isEnd } = data;
        if (notePack.length) {
          dispatch(isInitial ? assignNotes(notePack) : addNotes(notePack));
          setPackNumber(isInitial ? 2 : packNumber + 1);
          dispatch(setIsEnd(JSON.parse(isEnd)));
        } else {
          isInitial && dispatch(clearNotes()); // clearing notes, when it is initial fetch and there are no notes (for example, when we are making first search request)
          dispatch(setIsEnd(true));
        }
      })
      .catch((error) => {
        if (error.response.status === 401) return;
        setIsError(true);
      })
      .finally(() => {
        isInitial ? setIsLoading(false) : setIsPackLoading(false);
      });
  }

  React.useEffect(() => {
    // 1) check if user is authorized
    // 2) it allows handles case, when token is expired in socket => the rest of logging out process
    if (!isAuth) {
      dispatch(clearNotes());
      setIsLoading(false);
      return;
    }
    fetchNotesPack();
  }, [isAuth, isEnd, searchText]);

  React.useEffect(() => {
    if (!isAuth) {
      if (socket)
        socket.then((socket) => {
          socket.disconnect();
          dispatch(removeSocket());
        });
      return;
    }
    if (!socket) dispatch(initSocket());
    if (socket) socket.then((socket) => socket.emit('joinRoom'));
  }, [isAuth, socket]);

  React.useEffect(() => {
    if (!socket) return;
    if (isAuth) {
      socket.then((socket) => {
        // handling unauthorized note events
        socket.onAny(
          (
            event,
            args: {
              status: SOCKET_ERROR_CODES;
              message: string | string[];
              data?: {
                status?: SOCKET_NOTE_STATUSES;
                note: Omit<NoteSchema, 'date' | 'id'> | { noteId: string };
              };
            },
          ) => {
            // as soon as we connect to the room, we complete all cancelled tasks (if there are any)
            // tasks are cancelled because of unauthorized error
            if (event === 'joinRoom') {
              if (cancelledSocketEvents.current.length) {
                cancelledSocketEvents.current.forEach(({ event, data }) => {
                  socket.emit(event, data);
                });
                cancelledSocketEvents.current = [];
              }
            }

            if (event === 'localError') {
              const { status, data } = args;
              if (status === SOCKET_ERROR_CODES.UNAUTHORIZED) {
                refreshInstance
                  .post(`/auth/token/refresh`)
                  .then(async ({ data: refreshData }) => {
                    const { accessToken, refreshToken } = refreshData;
                    await SecureStore.setItemAsync('accessToken', accessToken);
                    await SecureStore.setItemAsync(
                      'refreshToken',
                      refreshToken,
                    );
                    let emittedMessage = '';
                    switch (data?.status) {
                      case SOCKET_NOTE_STATUSES.CREATED:
                        emittedMessage = 'createNote';
                        break;
                      case SOCKET_NOTE_STATUSES.UPDATED:
                        emittedMessage = 'updateNote';
                        break;
                      case SOCKET_NOTE_STATUSES.DELETED:
                        emittedMessage = 'deleteNote';
                        break;
                    }
                    // pushing cancelled event to the array
                    cancelledSocketEvents.current.push({
                      event: emittedMessage,
                      data: data?.note || {},
                    });
                    socket.disconnect(); // disconnecting socket to reconnect with new token
                    dispatch(removeSocket());
                  })
                  .catch((error) => {
                    if (error.response && error.response.status === 401) return;
                  });
              }
            }
          },
        );

        socket.on('global', ({ status, note }: SocketNoteData) => {
          if (status === SOCKET_NOTE_STATUSES.CREATED) dispatch(addNote(note));

          if (status === SOCKET_NOTE_STATUSES.UPDATED)
            dispatch(updateNote(note));

          if (status === SOCKET_NOTE_STATUSES.DELETED)
            dispatch(removeNote(note.id));
        });

        socket.on(
          'globalError',
          (error: { status: number; message: string | string[] }) => {
            if (error.status === SOCKET_ERROR_CODES.UNAUTHORIZED) {
              refreshInstance
                .post(`/auth/token/refresh`)
                .then(async ({ data: refreshData }) => {
                  const { accessToken, refreshToken } = refreshData;
                  await SecureStore.setItemAsync('accessToken', accessToken);
                  await SecureStore.setItemAsync('refreshToken', refreshToken);

                  socket.disconnect();
                  dispatch(removeSocket());
                })
                .catch((error) => {
                  if (error.response.status === 401) return;
                });
            }
          },
        );
      });
    }
    // I do not return anything, because I want to keep socket connection in the background
  }, [isAuth, socket]);

  React.useEffect(() => {
    const unsubscribe = listener.startListening({
      matcher: isAnyOf(updateNote, addNote),

      effect: ({ payload }, listenerAPI) => {
        const trimmedSearchText = searchText.trim();

        const notes = (listenerAPI.getState() as RootState).notes.notes;

        if (
          trimmedSearchText.length &&
          notes.findIndex((note) => note.id === payload.id) !== -1
        ) {
          if (
            !stringSearch(payload.title || '', trimmedSearchText) &&
            !stringSearch(payload.content || '', trimmedSearchText)
          )
            dispatch(removeNote(payload.id));
        }
      },
    });

    return () => unsubscribe();
  }, [searchText]);

  if (isError) return <Error />;
  if (isLoading) return <Loading />;

  return (
    <NotesView>
      <NotesContentView>
        {notes.length ? (
          <NotesList
            onEndReached={() => fetchNotesPack(FETCH_PACK_TYPES.LOAD_MORE)}
            onEndReachedThreshold={0.3}
            ListFooterComponent={isPackLoading ? <Spinner /> : null}
          >
            {notes}
          </NotesList>
        ) : (
          <NoItemsText>{searchText ? 'Nothing found' : 'No notes'}</NoItemsText>
        )}
        {!openSearchBar && isAuth && (
          <FAB
            placement="right"
            color={SOFT_BLUE}
            icon={{
              name: 'add',
              color: 'white',
            }}
            onPress={() => navigation.navigate(NAVIGATION_NAMES.NOTES_MANAGING)}
          />
        )}
      </NotesContentView>
    </NotesView>
  );
}
