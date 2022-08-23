import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native';
import { FAB } from '@rneui/themed';

import Error from '@screens/Error/Error.screen';
import Loading from '@screens/Loading/Loading.screen';
import IconButton from '@components/Default/IconButton/IconButton.component';
import SearchBar from '@components/Default/SearchBar/SearchBar.component';
import DraftsList from '@components/Drafts/DraftsList/DraftsList.component';
import { fetchDrafts } from '@utils/db/drafts/fetch';
import { stringSearch } from '@utils/stringInteraction/stringSearch';
import {
  DraftsView,
  DraftsContentView,
  LeftHeaderView,
} from '@components/Default/View/View.component';
import { NoItemsText } from '@components/Default/Text/Text.component';
import { NavigationProps } from '@app-types/types';
import { draftsSelector } from '@store/drafts/drafts.selector';
import { assignDrafts } from '@store/drafts/drafts.slice';
import { NAVIGATION_NAMES } from '@app-types/enum';
import { CYBER_YELLOW } from '@constants/colors';

import { styles } from './Drafts.styles';

export default function Drafts(): ReactElement {
  const dispatch = useDispatch();
  const drafts = useSelector(draftsSelector);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isError, setIsError] = React.useState<boolean>(false);

  const [openSearchBar, setOpenSearchBar] = React.useState<boolean>(false);
  const [searchText, setSearchText] = React.useState<string>('');

  const navigation = useNavigation<NavigationProps>();

  React.useEffect(() => {
    fetchDrafts()
      .then((result) => {
        dispatch(assignDrafts(result));
        setIsError(false);
      })
      .catch((error) => {
        //handling possible errors
        console.error(error, 'Drafts setup');
        setIsError(true);
      })
      .finally(() => {
        // in any case - loading is finished :)
        setIsLoading(false);
      });
  }, []);

  React.useEffect(() => {
    if (drafts.length === 0) {
      setSearchText('');
      setOpenSearchBar(false);
    }
    navigation.setOptions({
      // adding search bar
      headerTitle: ({ tintColor }) => {
        function onSearchBarChange(text: string) {
          const timer = setTimeout(() => {
            setSearchText(text);
          }, 300);
          return () => clearTimeout(timer);
        }
        if (openSearchBar && drafts.length)
          return (
            <SearchBar
              placeholder="Search in Drafts:"
              onChangeText={onSearchBarChange}
            />
          );
        return <Text style={[{ color: tintColor }, styles.title]}>Drafts</Text>;
      },
      headerTitleAlign: 'center',
      // open search bar button
      headerLeft: ({ tintColor }) => {
        function onButtonClickHandler() {
          setOpenSearchBar(!openSearchBar);
          setSearchText('');
        }
        if (drafts.length)
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
  }, [openSearchBar, drafts.length]);

  // filtering drafts, depending on search pattern
  const filteredDrafts = drafts.filter((draft) => {
    return (
      stringSearch(draft.title || '', searchText) ||
      stringSearch(draft.content || '', searchText)
    );
  });

  if (isError) return <Error />;
  if (isLoading) return <Loading />;

  return (
    <DraftsView>
      <DraftsContentView>
        {drafts.length ? (
          filteredDrafts.length ? (
            <DraftsList>{filteredDrafts}</DraftsList>
          ) : (
            <NoItemsText>Nothing found</NoItemsText>
          )
        ) : (
          <NoItemsText>No Drafts</NoItemsText>
        )}
        {!openSearchBar && (
          <FAB
            placement="right"
            color={CYBER_YELLOW}
            icon={{
              name: 'add',
              color: 'white',
            }}
            onPress={() => {
              navigation.navigate(NAVIGATION_NAMES.NOTES_MANAGING);
            }}
          />
        )}
      </DraftsContentView>
    </DraftsView>
  );
}
