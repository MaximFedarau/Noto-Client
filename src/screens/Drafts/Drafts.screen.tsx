import React, { ReactElement } from 'react';
import { Text } from 'react-native';
import { FAB } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { isAnyOf } from '@reduxjs/toolkit';
import { useNavigation } from '@react-navigation/native';
import { debounce } from 'lodash';

import Error from '@screens/Error/Error.screen';
import Loading from '@screens/Loading/Loading.screen';
import IconButton from '@components/Default/IconButton/IconButton.component';
import SearchBar from '@components/Default/SearchBar/SearchBar.component';
import DraftsList from '@components/Drafts/DraftsList/DraftsList.component';
import Spinner from '@components/Auth/Defaults/Spinner/Spinner.component';
import { fetchDraftPack } from '@utils/db/drafts/fetch';
import {
  DraftsView,
  DraftsContentView,
  LeftHeaderView,
} from '@components/Default/View/View.component';
import { NoItemsText } from '@components/Default/Text/Text.component';
import { NavigationProps, NavigationName, Record, FetchPackType } from '@types';
import { draftsSelector, isEndSelector } from '@store/drafts/drafts.selector';
import {
  assignDrafts,
  clearDrafts,
  addDrafts,
  setIsEnd,
  updateDraft,
  addDraft,
  removeDraft,
} from '@store/drafts/drafts.slice';
import { listener, AppStartListening } from '@store/middlewares/listener';
import { CYBER_YELLOW } from '@constants/colors';
import { sizes } from '@constants/sizes';
import { stringSearch } from '@utils/stringInteraction/stringSearch';

import { styles } from './Drafts.styles';

export default function Drafts(): ReactElement {
  const dispatch = useDispatch();
  const drafts = useSelector(draftsSelector);
  const isEnd = useSelector(isEndSelector);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isPackLoading, setIsPackLoading] = React.useState<boolean>(false);
  const [isError, setIsError] = React.useState<boolean>(false);

  const [openSearchBar, setOpenSearchBar] = React.useState<boolean>(false);
  const [searchText, setSearchText] = React.useState('');

  const navigation = useNavigation<NavigationProps>();

  const onSearchBarChange = React.useCallback(
    debounce((text) => {
      setSearchText(text);
      dispatch(setIsEnd(false));
    }, 300),
    [],
  );

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

  React.useEffect(() => {
    if (drafts.length || searchText.length) {
      navigation.setOptions({
        //Implement search bar
        headerTitle: ({ children, tintColor }) => {
          if (openSearchBar)
            return (
              <SearchBar
                placeholder="Search in Drafts:"
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
  }, [drafts.length, openSearchBar]);

  async function fetchDraftsPack(type: FetchPackType = FetchPackType.INITIAL) {
    if (isEnd || isPackLoading) return;
    const isInitial = type === FetchPackType.INITIAL;

    isInitial ? setIsLoading(true) : setIsPackLoading(true);
    try {
      const { draftsPack, isEnd } = await fetchDraftPack(
        isInitial ? 0 : drafts.length,
        searchText.trim(),
      );
      if (draftsPack.length) {
        dispatch(isInitial ? assignDrafts(draftsPack) : addDrafts(draftsPack));
        dispatch(setIsEnd(isEnd));
      } else {
        isInitial && dispatch(clearDrafts());
        dispatch(setIsEnd(true));
      }
    } catch (error) {
      setIsError(true);
    } finally {
      isInitial ? setIsLoading(false) : setIsPackLoading(false);
    }
  }

  React.useEffect(() => {
    fetchDraftsPack();
  }, [isEnd, searchText]);

  React.useEffect(() => {
    const unsubscribe = (listener.startListening as AppStartListening)({
      matcher: isAnyOf(updateDraft, addDraft),
      effect: ({ payload }, listenerAPI) => {
        const { drafts } = listenerAPI.getState().drafts;
        const { id, title, content } = payload as Record;
        const pattern = searchText.trim();
        const isExists = drafts.findIndex((draft) => draft.id === id) !== -1;

        if (
          pattern &&
          isExists &&
          !stringSearch(title, pattern) &&
          !stringSearch(content, pattern)
        )
          dispatch(removeDraft(id));
      },
    });

    return () => unsubscribe();
  }, [searchText]);

  if (isError) return <Error />;
  if (isLoading) return <Loading />;

  return (
    <DraftsView>
      <DraftsContentView>
        {drafts.length ? (
          <DraftsList
            onEndReached={() => {
              fetchDraftsPack(FetchPackType.LOAD_MORE);
            }}
            onEndReachedThreshold={0.3}
            ListFooterComponent={isPackLoading ? <Spinner /> : null}
          >
            {drafts}
          </DraftsList>
        ) : (
          <NoItemsText>
            {searchText ? 'Nothing found' : 'No drafts'}
          </NoItemsText>
        )}
        {!openSearchBar && (
          <FAB
            placement="right"
            color={CYBER_YELLOW}
            icon={{
              name: 'add',
              color: 'white',
            }}
            onPress={() => navigation.navigate(NavigationName.NOTES_MANAGING)}
          />
        )}
      </DraftsContentView>
    </DraftsView>
  );
}
