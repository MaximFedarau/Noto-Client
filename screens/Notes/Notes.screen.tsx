import React, { ReactElement } from 'react';
import { Text } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import Error from '@screens/Error/Error.screen';
import Loading from '@screens/Loading/Loading.screen';
import { LeftHeaderView } from '@components/Default/View/View.component';
import IconButton from '@components/Default/IconButton/IconButton.component';
import SearchBar from '@components/Default/SearchBar/SearchBar.component';
import { NotesView } from '@components/Default/View/View.component';
import NotesList from '@components/Notes/NotesList/NotesList.component';
import { NoItemsText } from '@components/Default/Text/Text.component';
import { NoteSchema, NavigationProps } from '@app-types/types';
import { createAPIInstance } from '@utils/requests/instance';
import { stringSearch } from '@utils/stringSearch';
import {
  setIsAuth,
  setPublicData,
  publicDataInitialState,
} from '@store/publicData/publicData.slice';
import { publicDataAuthSelector } from '@store/publicData/publicData.selector';

import { styles } from './Notes.styles';

export default function Notes(): ReactElement {
  const navigation = useNavigation<NavigationProps>();
  const focus = useIsFocused();

  const dispatch = useDispatch();
  const isAuth = useSelector(publicDataAuthSelector);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isError, setIsError] = React.useState<boolean>(false);

  const [openSearchBar, setOpenSearchBar] = React.useState<boolean>(false);
  const [searchText, setSearchText] = React.useState<string>('');

  const [notes, setNotes] = React.useState<NoteSchema[]>([]);

  React.useEffect(() => {
    if (!focus) {
      if (!isAuth) setNotes([]);
      return;
    }
    const instance = createAPIInstance(() => {
      setNotes([]);
      dispatch(setPublicData(publicDataInitialState));
      dispatch(setIsAuth(false));
      setIsLoading(false);
    });
    const fetchNotes = async () => {
      const res = await instance.get('/notes');
      if (res.data) setNotes(res.data);
    };
    if (isAuth) {
      fetchNotes()
        .then(() => {
          setIsError(false);
          navigation.setOptions({
            //Implement search bar
            headerTitle: ({ children, tintColor }) => {
              function onSearchBarChange(text: string) {
                setSearchText(text);
              }
              if (openSearchBar)
                return (
                  <SearchBar
                    placeholder="Search in Notes:"
                    onChangeText={onSearchBarChange}
                  />
                );
              return (
                <Text style={[{ color: tintColor }, styles.title]}>
                  {children}
                </Text>
              );
            },
            headerTitleAlign: 'center',
            // open search bar button
            headerLeft: ({ tintColor }) => {
              function onButtonClickHandler() {
                setOpenSearchBar(!openSearchBar);
                setSearchText('');
              }
              return (
                <LeftHeaderView>
                  <IconButton
                    iconName="search"
                    size={32}
                    color={tintColor}
                    onPress={onButtonClickHandler}
                  />
                </LeftHeaderView>
              );
            },
          });
        })
        .catch((error) => {
          console.error(error, 'Notes setup');
          if (error.response.status != 401) setIsError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setNotes([]);
      setIsLoading(false);
    }
  }, [isAuth, focus, openSearchBar]);

  // as authenthicated user always has a nickname, then when it is empty, we can say, that user is logged out

  if (isError) return <Error />;
  if (isLoading) return <Loading />;

  // filtering notes, depending on search pattern
  const filteredNotes = notes.filter((note) => {
    return (
      stringSearch(note.title || '', searchText) ||
      stringSearch(note.content || '', searchText)
    );
  });

  return (
    <NotesView>
      {notes.length ? (
        filteredNotes.length ? (
          <NotesList>{filteredNotes}</NotesList>
        ) : (
          <NoItemsText>Nothing found</NoItemsText>
        )
      ) : (
        <NoItemsText>No Notes</NoItemsText>
      )}
    </NotesView>
  );
}
