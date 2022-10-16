import React, { ReactElement } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
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
import { NavigationProps } from '@app-types/types';
import { NAVIGATION_NAMES, FETCH_PACK_TYPES } from '@app-types/enum';
import { createAPIInstance } from '@utils/requests/instance';
import { showingSubmitError } from '@utils/toastInteraction/showingSubmitError';
import { createAPIRefreshInstance } from '@utils/requests/instance';
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
} from '@store/notes/notes.slice';
import { socketSelector } from '@store/socket/socket.selector';
import { initSocket, removeSocket } from '@store/socket/socket.slice';

import { styles } from './Notes.styles';

export default function Notes(): ReactElement {
  const navigation = useNavigation<NavigationProps>();

  const dispatch = useDispatch();
  const socket = useSelector(socketSelector);
  const isAuth = useSelector(publicDataAuthSelector);
  const notes = useSelector(notesSelector);
  const isEnd = useSelector(isEndSelector);

  const [isLoading, setIsLoading] = React.useState<boolean>(true); // general loading
  const [isPackLoading, setIsPackLoading] = React.useState<boolean>(false); // only for pack loading
  const [isError, setIsError] = React.useState<boolean>(false);

  const [openSearchBar, setOpenSearchBar] = React.useState<boolean>(false);
  const [searchText, setSearchText] = React.useState<string>('');

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
        socket.on('update', () => dispatch(setIsEnd(false)));
        socket.on(
          'error',
          (error: { status: number; message: string | string[] }) => {
            if (error.status === 401) {
              refreshInstance
                .post(`/auth/token/refresh`)
                .then(async ({ data }) => {
                  const { accessToken, refreshToken } = data;
                  await SecureStore.setItemAsync('accessToken', accessToken);
                  await SecureStore.setItemAsync('refreshToken', refreshToken);
                  socket.disconnect(); // disconnecting socket to reconnect with new token
                  dispatch(initSocket()); // reconnecting socket with new token
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
