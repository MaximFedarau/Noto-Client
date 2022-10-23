import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native';
import { FAB } from '@rneui/themed';
import { debounce } from 'lodash';
import { isAnyOf } from '@reduxjs/toolkit';

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
import { NavigationProps } from '@app-types/types';
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
import { FETCH_PACK_TYPES, NAVIGATION_NAMES } from '@app-types/enum';
import { CYBER_YELLOW } from '@constants/colors';
import { sizes } from '@constants/sizes';
import { listener, RootState } from '@store/store';
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
  const searchText = React.useRef('');

  const navigation = useNavigation<NavigationProps>();

  const onSearchBarChange = React.useCallback(
    debounce((text) => {
      searchText.current = text;
      dispatch(setIsEnd(false));
    }, 300),
    [],
  );

  function clearAuthHeader() {
    setOpenSearchBar(false);
    searchText.current = '';
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
    if (drafts.length || searchText.current.length) {
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
            if (searchText.current !== '') dispatch(setIsEnd(false));
            // removing debounce
            onSearchBarChange.cancel();
            searchText.current = '';
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

  function fetchDraftsPack(type: FETCH_PACK_TYPES = FETCH_PACK_TYPES.INITIAL) {
    if (isEnd || isPackLoading) return;
    const isInitial = type === FETCH_PACK_TYPES.INITIAL;

    isInitial ? setIsLoading(true) : setIsPackLoading(true);
    fetchDraftPack(isInitial ? 0 : drafts.length, searchText.current.trim())
      .then((res) => {
        const { draftsPack } = res;
        if (draftsPack.length) {
          dispatch(
            isInitial ? assignDrafts(draftsPack) : addDrafts(draftsPack),
          );
          dispatch(setIsEnd(res.isEnd));
        } else {
          isInitial && dispatch(clearDrafts());
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
    fetchDraftsPack();
  }, [isEnd, searchText.current]);

  React.useEffect(() => {
    listener.startListening({
      matcher: isAnyOf(updateDraft, addDraft),

      effect: ({ payload }, listenerAPI) => {
        const trimmedSearchText = searchText.current.trim();

        const drafts = (listenerAPI.getState() as RootState).drafts.drafts;

        if (
          trimmedSearchText.length &&
          drafts.findIndex((draft) => draft.id === payload.id) !== -1
        ) {
          if (
            !stringSearch(payload.title || '', trimmedSearchText) &&
            !stringSearch(payload.content || '', trimmedSearchText)
          )
            dispatch(removeDraft(payload.id));
        }
      },
    });
  }, []);

  if (isError) return <Error />;
  if (isLoading) return <Loading />;

  return (
    <DraftsView>
      <DraftsContentView>
        {drafts.length ? (
          <DraftsList
            onEndReached={() => {
              fetchDraftsPack(FETCH_PACK_TYPES.LOAD_MORE);
            }}
            onEndReachedThreshold={0.3}
            ListFooterComponent={isPackLoading ? <Spinner /> : null}
          >
            {drafts}
          </DraftsList>
        ) : (
          <NoItemsText>
            {searchText.current ? 'Nothing found' : 'No drafts'}
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
            onPress={() => navigation.navigate(NAVIGATION_NAMES.NOTES_MANAGING)}
          />
        )}
      </DraftsContentView>
    </DraftsView>
  );
}
