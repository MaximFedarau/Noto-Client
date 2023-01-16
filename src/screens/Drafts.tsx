import React, { FC, useEffect, useState } from 'react';
import { FAB } from '@rneui/base';
import { useDispatch, useSelector } from 'react-redux';
import { isAnyOf } from '@reduxjs/toolkit';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { debounce } from 'lodash';

import { Error } from './Error';
import { Loading } from './Loading';
import {
  IconButton,
  Spinner,
  RecordsContainer,
  RecordsContent,
  NoItemsText,
  RecordsHeaderTitle,
  RecordsList,
  SearchBar,
} from '@components';
import { fetchDraftPack } from '@utils';
import {
  NavigationProps,
  NavigationName,
  Record,
  FetchPackType,
  RecordType,
  MAIN_NAVIGATOR_ID,
} from '@types';
import {
  draftsSelector,
  isEndSelector,
  assignDrafts,
  clearDrafts,
  addDrafts,
  setIsEnd,
  updateDraft,
  addDraft,
  removeDraft,
} from '@store/drafts';
import { listener, AppStartListening } from '@store/middlewares';
import { SIZES, COLORS } from '@constants';
import { stringSearch } from '@utils';

export const Drafts: FC = () => {
  const dispatch = useDispatch();
  const drafts = useSelector(draftsSelector);
  const isEnd = useSelector(isEndSelector);

  const [isLoading, setIsLoading] = useState(false);
  const [isPackLoading, setIsPackLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [openSearchBar, setOpenSearchBar] = useState(false);
  const [searchText, setSearchText] = useState('');

  const navigation = useNavigation<NavigationProps>();
  const isFocused = useIsFocused();
  const parentNavigator = navigation.getParent<NavigationProps>(
    MAIN_NAVIGATOR_ID as any,
  );

  const onSearchBarDebounce = debounce(() => {
    dispatch(setIsEnd(false));
  }, 300);

  const onSearchBarChange = (text: string) => {
    setSearchText(text);
    onSearchBarDebounce();
  };

  const onSearchButtonClickHandler = () => {
    setOpenSearchBar(!openSearchBar);
    // do not fetch again, when searchText is already empty
    if (searchText !== '') dispatch(setIsEnd(false));
    // removing debounce
    onSearchBarDebounce.cancel();
    setSearchText('');
  };

  useEffect(() => {
    if (!isFocused) return;
    parentNavigator.setOptions({
      //Implement search bar
      headerTitle: (props) => {
        if (openSearchBar && (drafts.length || searchText))
          return (
            <SearchBar
              placeholder="Search in Drafts:"
              onChangeText={onSearchBarChange}
              defaultValue={searchText}
            />
          );
        return <RecordsHeaderTitle {...props}>Drafts</RecordsHeaderTitle>;
      },
      // open search bar button
      headerLeft: ({ tintColor }) =>
        (drafts.length || searchText) && (
          <IconButton
            iconName="search"
            size={SIZES['4xl']}
            color={tintColor}
            onPress={onSearchButtonClickHandler}
          />
        ),
    });

    return () => onSearchBarDebounce.cancel(); //removing debounce, when component is unmounted
  }, [drafts.length, openSearchBar, isFocused]);

  const fetchDraftsPack = async (
    type: FetchPackType = FetchPackType.INITIAL,
  ) => {
    if (isEnd || isPackLoading) return;
    const isInitial = type === FetchPackType.INITIAL;

    isInitial ? setIsLoading(true) : setIsPackLoading(true);
    try {
      const { draftsPack, isEnd } = await fetchDraftPack(
        isInitial ? 0 : drafts.length, // when searching we need to have first pack
        searchText.trim(),
      );
      if (draftsPack.length) {
        dispatch(isInitial ? assignDrafts(draftsPack) : addDrafts(draftsPack));
        dispatch(setIsEnd(isEnd));
      } else {
        isInitial && dispatch(clearDrafts()); // when searching we need to clear first seearch result
        dispatch(setIsEnd(true));
      }
    } catch (error) {
      setIsError(true);
    } finally {
      isInitial ? setIsLoading(false) : setIsPackLoading(false);
    }
  };

  useEffect(() => {
    fetchDraftsPack();
  }, [isEnd, searchText]);

  useEffect(() => {
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
    <RecordsContainer>
      <RecordsContent>
        {drafts.length ? (
          <RecordsList
            type={RecordType.DRAFT}
            onEndReached={() => fetchDraftsPack(FetchPackType.LOAD_MORE)}
            onEndReachedThreshold={0.3}
            ListFooterComponent={isPackLoading ? <Spinner /> : null}
          >
            {drafts}
          </RecordsList>
        ) : (
          <NoItemsText>
            {searchText ? 'Nothing found' : 'No drafts'}
          </NoItemsText>
        )}
        {!openSearchBar && (
          <FAB
            placement="right"
            color={COLORS.cyberYellow}
            icon={{ name: 'add', color: COLORS.white }}
            onPress={() => navigation.navigate(NavigationName.RECORDS_MANAGING)}
          />
        )}
      </RecordsContent>
    </RecordsContainer>
  );
};
