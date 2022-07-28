//Types
import React, { ReactElement } from 'react';
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
  // * States

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isError, setIsError] = React.useState<boolean>(false);

  const [openSearchBar, setOpenSearchBar] = React.useState<boolean>(false);
  const [searchText, setSearchText] = React.useState<string>('');

  const [drafts, setDrafts] = React.useState<DraftSchema[]>([]);

  // * React Navigation
  const navigation = useNavigation<NavigationProps>();

  React.useEffect(() => {
    // fetching drafts
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
    return draft.title!.toLowerCase().includes(searchText.toLowerCase());
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
