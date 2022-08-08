import React, { ReactElement } from 'react';
import { useNavigation } from '@react-navigation/native';

import Error from '@screens/Error/Error.screen';
import Loading from '@screens/Loading/Loading.screen';
import IconButton from '@components/Default/IconButton/IconButton.component';
import SearchBar from '@components/Default/SearchBar/SearchBar.component';
import DraftsList from '@components/Drafts/DraftsList/DraftsList.component';
import { fetchDrafts } from '@utils/db/drafts/fetch';
import { stringSearch } from '@utils/stringSearch';
import { LeftHeaderView } from '@components/Default/View/View.component';
import { DraftsView } from '@components/Default/View/View.component';
import { NoItemsText } from '@components/Default/Text/Text.component';
import { DraftSchema } from '@app-types/types';
import { NavigationProps } from '@app-types/types';

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
          // adding search bar
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
        //handling possible errors
        console.error(error, 'Drafts setup');
        setIsError(true);
      })
      .finally(() => {
        // in any case - loading is finished :)
        setIsLoading(false);
      });
  }, [drafts]);

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
      {drafts.length ? (
        filteredDrafts.length ? (
          <DraftsList>{filteredDrafts}</DraftsList>
        ) : (
          <NoItemsText>Nothing found</NoItemsText>
        )
      ) : (
        <NoItemsText>No Drafts</NoItemsText>
      )}
    </DraftsView>
  );
}
