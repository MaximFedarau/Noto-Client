import React, { FC, useEffect, useState, useRef } from 'react';
import { FAB } from '@rneui/base';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { setItemAsync } from 'expo-secure-store';
import { useSelector, useDispatch } from 'react-redux';
import { isAnyOf } from '@reduxjs/toolkit';
import debounce from 'lodash.debounce';
import { AxiosError } from 'axios';

import { Error } from './Error';
import { Loading } from './Loading';
import {
  IconButton,
  Spinner,
  NoItemsText,
  RecordsHeaderTitle,
  RecordsContainer,
  RecordsContent,
  RecordsList,
  SearchBar,
} from '@components';
import { SIZES, COLORS } from '@constants';
import {
  RecordsTabScreenProps,
  NavigationRecordsName,
  NavigationName,
  RootStackScreenProps,
  ToastType,
  Record,
  FetchPackType,
  SocketNote,
  SocketNoteStatus,
  SocketErrorCode,
  AuthTokens,
  RecordType,
  MAIN_NAVIGATOR_ID,
} from '@types';
import {
  createAPIInstance,
  showToast,
  createAPIRefreshInstance,
  stringSearch,
  createSocket,
} from '@utils';
import {
  setIsAuth,
  clearUser,
  userIsAuthSelector,
  userNicknameSelector,
} from '@store/user';
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

type ScreenProps = RecordsTabScreenProps<NavigationRecordsName.NOTES>;
type ParentScreenProps = RootStackScreenProps<NavigationName.RECORDS_OVERVIEW>;

export const Notes: FC = () => {
  const navigation = useNavigation<ScreenProps['navigation']>();
  const isFocused = useIsFocused();
  const parentNavigator =
    navigation.getParent<ParentScreenProps['navigation']>(MAIN_NAVIGATOR_ID);

  const cancelledSocketEvents = useRef<
    {
      event: string;
      data: object;
    }[]
  >([]);

  const dispatch = useDispatch();
  const socket = useSelector(socketSelector);
  const isAuth = useSelector(userIsAuthSelector);
  const nickname = useSelector(userNicknameSelector);
  const notes = useSelector(notesSelector);
  const isEnd = useSelector(isEndSelector);

  const [isLoading, setIsLoading] = useState(false); // general loading
  const [isPackLoading, setIsPackLoading] = useState(false); // only for pack loading
  const [isError, setIsError] = useState(false);

  const [openSearchBar, setOpenSearchBar] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [packCursor, setPackCursor] = useState(new Date());

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

  const clearHeader = () => {
    parentNavigator.setOptions({
      headerTitle: (props) => (
        <RecordsHeaderTitle {...props}>
          {isAuth ? `${nickname}'s Notes` : 'Notes'}
        </RecordsHeaderTitle>
      ),
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
    if (!isAuth && isFocused) {
      clearHeader();
      return;
    }

    if (!isFocused) return;
    parentNavigator.setOptions({
      headerTitle: (props) => {
        if (openSearchBar && (notes.length || searchText))
          return (
            <SearchBar
              placeholder="Search in Notes:"
              defaultValue={searchText}
              onChangeText={onSearchBarChange}
            />
          );
        return (
          <RecordsHeaderTitle {...props}>
            {isAuth ? `${nickname}'s Notes` : 'Notes'}
          </RecordsHeaderTitle>
        );
      },
      headerLeft: ({ tintColor }) =>
        (notes.length || searchText) && (
          <IconButton
            iconName="search"
            size={SIZES['4xl']}
            color={tintColor}
            onPress={onSearchButtonClickHandler}
          />
        ),
    });

    return () => onSearchBarChange.cancel(); //removing debounce, when component is unmounted
  }, [notes.length, openSearchBar, isAuth, isFocused, nickname]);

  // ? also we can add socket check - if there is no socket, do not fetch notes, because we can possibly miss some updated notes due to tokens refreshing
  const fetchNotesPack = async (
    type: FetchPackType = FetchPackType.INITIAL,
  ) => {
    if (isEnd || isPackLoading) return;
    const isInitial = type === FetchPackType.INITIAL;

    isInitial ? setIsLoading(true) : setIsPackLoading(true);

    try {
      const { data } = await instance.get(
        `/notes/pack/${
          isInitial ? undefined : packCursor
        }?pattern=${encodeURIComponent(searchText.trim())}`,
      );
      const { notePack, isEnd } = data;
      if (notePack.length) {
        dispatch(isInitial ? assignNotes(notePack) : addNotes(notePack));
        setPackCursor(notePack[notePack.length - 1].date);
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
      setOpenSearchBar(false);
      setSearchText('');
      return;
    }
    fetchNotesPack();
  }, [isAuth, isEnd, searchText]);

  const initializeSocket = async () => {
    const socket = await createSocket();
    dispatch(setSocket(socket));
  };

  const socketCleanup = () => {
    if (socket) {
      socket.disconnect();
      dispatch(removeSocket());
    }
  };

  useEffect(() => {
    if (!isAuth) return; // allow connection only if user is authenticated
    if (!socket) initializeSocket();

    // removing socket, when user is not authenticated, Notes screen is fast refreshed and so on
    return () => socketCleanup();
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
