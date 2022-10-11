import React, { ReactElement } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { Text } from 'react-native';
import { FAB } from '@rneui/themed';
import { debounce } from 'lodash';

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
  const socket = useSelector(socketSelector);

  const navigation = useNavigation<NavigationProps>();

  const dispatch = useDispatch();
  const isAuth = useSelector(publicDataAuthSelector);
  const notes = useSelector(notesSelector);
  const isEnd = useSelector(isEndSelector);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isPackLoading, setIsPackLoading] = React.useState<boolean>(false);
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

  function clearAuthHeader() {
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
  }

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
        //Implement search bar
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
        headerTitleAlign: 'center',
        // open search bar button
        headerLeft: ({ tintColor }) => {
          function onButtonClickHandler() {
            setOpenSearchBar(!openSearchBar);
            // do not fetch again, when searchText is already empty
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
      .then((res) => {
        if (res.data.notePack.length) {
          dispatch(
            isInitial
              ? assignNotes(res.data.notePack)
              : addNotes(res.data.notePack),
          );
          setPackNumber(isInitial ? 2 : packNumber + 1);
          dispatch(setIsEnd(JSON.parse(res.data.isEnd)));
        } else {
          isInitial && dispatch(clearNotes());
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
    if (socket)
      socket.then((socket) => {
        socket.emit('joinRoom');
      });
  }, [isAuth, socket]);

  React.useEffect(() => {
    if (!socket) return;
    if (isAuth) {
      socket.then((socket) => {
        socket.on('update', () => {
          dispatch(setIsEnd(false));
        });
        socket.on('error', (error) => {
          console.log(error);
        });
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
            onEndReached={() => {
              fetchNotesPack(FETCH_PACK_TYPES.LOAD_MORE);
            }}
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
            onPress={() => {
              navigation.navigate(NAVIGATION_NAMES.NOTES_MANAGING);
            }}
          />
        )}
      </NotesContentView>
    </NotesView>
  );
}
