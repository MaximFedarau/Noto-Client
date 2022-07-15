//Types
import React, { ReactElement } from 'react';
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import { DraftSchema } from '@app-types/types';
import { NavigationProps } from '@app-types/types';

//Constants
import { fetchDrafts } from '@utils/db/drafts/fetch';

//Screens
import Error from '@screens/Error/Error.screen';
import Loading from '@screens/Loading/Loading.screen';

//Components
import IconButton from '@components/Default/IconButton/IconButton.component';
import SearchBar from '@components/Default/SearchBar/SearchBar.component';
import DraftsList from '@components/Drafts/DraftsList/DraftsList.component';

import { LeftHeaderView } from '@components/Default/View/View.component';

import { DraftsView } from '@components/Default/View/View.component';
import { NoItemsText } from '@components/Default/Text/Text.component';

//React Navigation
import { useNavigation } from '@react-navigation/native';

export default function Drafts(): ReactElement {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isError, setIsError] = React.useState<boolean>(false);

  const [openSearchBar, setOpenSearchBar] = React.useState<boolean>(false);
  const [searchText, setSearchText] = React.useState<string>('');

  const [drafts, setDrafts] = React.useState<DraftSchema[]>([]);

  const navigation = useNavigation<NavigationProps>();

  React.useEffect(() => {
    fetchDrafts()
      .then((result) => {
        setDrafts(result);
        setIsError(false);
        navigation.setOptions({
          headerTitle: () => {
            function onSearchBarChange(text: string) {
              setSearchText(text);
            }
            if (openSearchBar)
              return (
                <SearchBar
                  placeholder="Search in Drafts:"
                  onChangeText={onSearchBarChange}
                />
              );
          },
          headerTitleAlign: 'center',
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
        console.log(error, 'Drafts set up');
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [drafts]);

  const filteredDrafts = drafts.filter((draft) => {
    return draft.title.toLowerCase().includes(searchText.toLowerCase());
  });

  if (isError) return <Error />;
  if (isLoading) return <Loading />;

  return (
    <DraftsView>
      {drafts.length > 0 ? (
        <DraftsList>{filteredDrafts}</DraftsList>
      ) : (
        <NoItemsText>No drafts</NoItemsText>
      )}
    </DraftsView>
  );
}
