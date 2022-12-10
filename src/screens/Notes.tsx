import React, { FC, useEffect, useState, useRef } from 'react';
import { FAB } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';
import { setItemAsync } from 'expo-secure-store';
import { useSelector, useDispatch } from 'react-redux';
import { isAnyOf } from '@reduxjs/toolkit';
import { debounce } from 'lodash';
import { AxiosError } from 'axios';

import { Error } from './Error';
import { Loading } from './Loading';
import {
  IconButton,
  Spinner,
  LeftHeader,
  NoItemsText,
  RecordsHeaderTitle,
  RecordsContainer,
  RecordsContent,
  RecordsList,
  SearchBar,
} from '@components';
import { SIZES, COLORS } from '@constants';
import {
  NavigationProps,
  NavigationName,
  ToastType,
  Record,
  FetchPackType,
  SocketNote,
  SocketNoteStatus,
  SocketErrorCode,
  AuthTokens,
  RecordType,
} from '@types';
import {
  createAPIInstance,
  showToast,
  createAPIRefreshInstance,
  stringSearch,
  createSocket,
} from '@utils';
import { setIsAuth, clearUser, userIsAuthSelector } from '@store/user';
import {
  notesSelector,
  isEndSelector,
  clearNotes,
  addNotes,
  assignNotes,
  setIsEnd,
  updateNote,
  addNote,
  removeNote,
} from '@store/notes';
import { socketSelector, setSocket, removeSocket } from '@store/socket';
import { listener, AppStartListening } from '@store/middlewares';

export const Notes: FC = () => {
  const navigation = useNavigation<NavigationProps>();

  const cancelledSocketEvents = useRef<
    {
      event: string;
      data: object;
    }[]
  >([]);

  const dispatch = useDispatch();
  const socket = useSelector(socketSelector);
  const isAuth = useSelector(userIsAuthSelector);
  const notes = useSelector(notesSelector);
  const isEnd = useSelector(isEndSelector);

  const [isLoading, setIsLoading] = useState(true); // general loading
  const [isPackLoading, setIsPackLoading] = useState(false); // only for pack loading
  const [isError, setIsError] = useState(false);

  const [openSearchBar, setOpenSearchBar] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [packNumber, setPackNumber] = useState(1);

  const instance = createAPIInstance(() => {
    showToast(ToastType.ERROR, 'Logout', 'Your session has expired');
    dispatch(clearNotes());
    dispatch(clearUser());
    dispatch(setIsAuth(false));
    setIsLoading(false);
  });

  const refreshInstance = createAPIRefreshInstance(() => {
    showToast(ToastType.ERROR, 'Logout', 'Your session has expired');
    dispatch(clearUser());
    dispatch(setIsAuth(false));
    // after setting isAuth to false, other logout actions will be called by fetchNotesPack useEffect
  });

  const clearAuthHeader = () => {
    setOpenSearchBar(false);
    setSearchText('');
    navigation.setOptions({
      headerTitle: (props) => <RecordsHeaderTitle {...props} />,
      headerLeft: () => null,
    });
  };

  const onSearchBarChange = debounce((text) => {
    setSearchText(text);
    dispatch(setIsEnd(false));
  }, 300);

  const onSearchButtonClickHandler = () => {
    setOpenSearchBar(!openSearchBar);
    // do not fetch again, if searchText is already empty
    if (searchText !== '') dispatch(setIsEnd(false));
    // removing debounce
    onSearchBarChange.cancel();
    setSearchText('');
  };

  useEffect(() => {
    if (!isAuth) {
      clearAuthHeader();
      return;
    }

    if (notes.length || searchText.length) {
      navigation.setOptions({
        headerTitle: (props) => {
          if (openSearchBar)
            return (
              <SearchBar
                placeholder="Search in Notes:"
                onChangeText={onSearchBarChange}
              />
            );
          return <RecordsHeaderTitle {...props} />;
        },
        // open search bar button
        headerLeft: ({ tintColor }) => (
          <LeftHeader>
            <IconButton
              iconName="search"
              size={SIZES['4xl']}
              color={tintColor}
              onPress={onSearchButtonClickHandler}
            />
          </LeftHeader>
        ),
      });
    } else clearAuthHeader();

    return () => onSearchBarChange.cancel(); //removing debounce, when component is unmounted
  }, [notes.length, openSearchBar, isAuth]);

  const fetchNotesPack = async (
    type: FetchPackType = FetchPackType.INITIAL,
  ) => {
    if (isEnd || isPackLoading) return;
    const isInitial = type === FetchPackType.INITIAL;

    isInitial ? setIsLoading(true) : setIsPackLoading(true);

    try {
      const { data } = await instance.get(
        `/notes/pack/${
          isInitial ? 1 : packNumber
        }?pattern=${searchText.trim()}`,
      );
      const { notePack, isEnd } = data;
      if (notePack.length) {
        dispatch(isInitial ? assignNotes(notePack) : addNotes(notePack));
        setPackNumber(isInitial ? 2 : packNumber + 1);
        dispatch(setIsEnd(isEnd));
      } else {
        isInitial && dispatch(clearNotes()); // clearing notes, when it is initial fetch and there are no notes (for example, when we are making first search request)
        dispatch(setIsEnd(true));
      }
    } catch (error) {
      const { response } = error as AxiosError;
      if (response && response.status === 401) return;
      setIsError(true);
    } finally {
      isInitial ? setIsLoading(false) : setIsPackLoading(false);
    }
  };

  useEffect(() => {
    // 1) check if user is authorized
    // 2) it allows handles case, when token is expired in socket => the rest of logging out process
    if (!isAuth) {
      dispatch(clearNotes());
      setIsLoading(false);
      return;
    }
    fetchNotesPack();
  }, [isAuth, isEnd, searchText]);

  const initializeSocket = async () => {
    const socket = await createSocket();
    dispatch(setSocket(socket));
  };

  useEffect(() => {
    if (!isAuth) {
      if (socket) {
        socket.disconnect();
        dispatch(removeSocket());
      }
      return;
    }
    if (!socket) initializeSocket();
    if (socket) socket.emit('joinRoom');
  }, [isAuth, socket]);

  useEffect(() => {
    if (!socket || !isAuth) return;
    // handling unauthorized note events
    socket.onAny(
      async (
        event,
        args: {
          status: SocketErrorCode;
          message: string | string[];
          data?: {
            status?: SocketNoteStatus;
            note: Omit<Record, 'date' | 'id'> | { noteId: string };
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
          if (status !== SocketErrorCode.UNAUTHORIZED) return;

          try {
            const { data: refreshData } =
              await refreshInstance.post<AuthTokens>(`/auth/token/refresh`);
            const { accessToken, refreshToken } = refreshData;
            await setItemAsync('accessToken', accessToken);
            await setItemAsync('refreshToken', refreshToken);

            let emittedMessage = '';
            switch (data?.status) {
              case SocketNoteStatus.CREATED:
                emittedMessage = 'createNote';
                break;

              case SocketNoteStatus.UPDATED:
                emittedMessage = 'updateNote';
                break;

              case SocketNoteStatus.DELETED:
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
          } catch (error) {
            const { response } = error as AxiosError;
            if (response && response.status === 401) return;
          }
        }
      },
    );

    socket.on('global', ({ status, note }: SocketNote) => {
      switch (status) {
        case SocketNoteStatus.CREATED:
          dispatch(addNote(note));
          break;

        case SocketNoteStatus.UPDATED:
          dispatch(updateNote(note));
          break;

        case SocketNoteStatus.DELETED:
          dispatch(removeNote(note.id));
          break;
      }
    });

    socket.on(
      'globalError',
      async (error: { status: number; message: string | string[] }) => {
        if (error.status !== SocketErrorCode.UNAUTHORIZED) return;

        try {
          const { data: refreshData } = await refreshInstance.post<AuthTokens>(
            `/auth/token/refresh`,
          );
          const { accessToken, refreshToken } = refreshData;
          await setItemAsync('accessToken', accessToken);
          await setItemAsync('refreshToken', refreshToken);

          socket.disconnect();
          dispatch(removeSocket());
        } catch (error) {
          const { response } = error as AxiosError;
          if (response && response.status === 401) return;
        }
      },
    );
    // We do not return anything, because we want to keep socket connection in the background
  }, [isAuth, socket]);

  useEffect(() => {
    const unsubscribe = (listener.startListening as AppStartListening)({
      matcher: isAnyOf(updateNote, addNote),
      effect: ({ payload }, listenerAPI) => {
        const { notes } = listenerAPI.getState().notes;
        const { id, title, content } = payload as Record;
        const pattern = searchText.trim();
        const isExists = notes.findIndex((note) => note.id === id) !== -1;

        if (
          pattern &&
          isExists &&
          !stringSearch(title, pattern) &&
          !stringSearch(content, pattern)
        )
          dispatch(removeNote(id));
      },
    });

    return () => unsubscribe();
  }, [searchText]);

  if (isError) return <Error />;
  if (isLoading) return <Loading />;

  return (
    <RecordsContainer>
      <RecordsContent>
        {notes.length ? (
          <RecordsList
            type={RecordType.NOTE}
            onEndReached={() => fetchNotesPack(FetchPackType.LOAD_MORE)}
            onEndReachedThreshold={0.3}
            ListFooterComponent={isPackLoading ? <Spinner /> : null}
          >
            {notes}
          </RecordsList>
        ) : (
          <NoItemsText>{searchText ? 'Nothing found' : 'No notes'}</NoItemsText>
        )}
        {!openSearchBar && isAuth && (
          <FAB
            placement="right"
            color={COLORS.softBlue}
            icon={{
              name: 'add',
              color: COLORS.white,
            }}
            onPress={() => navigation.navigate(NavigationName.RECORDS_MANAGING)}
          />
        )}
      </RecordsContent>
    </RecordsContainer>
  );
};
