import React, { FC, useEffect, useState } from 'react';
import { FAB } from '@rneui/base';
import { useDispatch, useSelector } from 'react-redux';
import { isAnyOf } from '@reduxjs/toolkit';
import { useNavigation } from '@react-navigation/native';
import { debounce } from 'lodash';

import { Error } from './Error';
import { Loading } from './Loading';
import IconButton from '@components/Default/IconButton';
import SearchBar from '@components/Records/SearchBar';
import RecordsList from '@components/Records/RecordsList';
import Spinner from '@components/Default/Spinner';
import { fetchDraftPack } from '@utils';
import {
  RecordsContainer,
  RecordsContent,
  LeftHeader,
} from '@components/Default/View';
import { NoItemsText, RecordsHeaderTitle } from '@components/Default/Text';
import {
  NavigationProps,
  NavigationName,
  Record,
  FetchPackType,
  RecordType,
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
import { CYBER_YELLOW } from '@constants/colors';
import { sizes } from '@constants/sizes';
import { stringSearch } from '@utils';

export const Drafts: FC = () => {
  const dispatch = useDispatch();
  const drafts = useSelector(draftsSelector);
  const isEnd = useSelector(isEndSelector);

  const [isLoading, setIsLoading] = useState(true);
  const [isPackLoading, setIsPackLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [openSearchBar, setOpenSearchBar] = useState(false);
  const [searchText, setSearchText] = useState('');

  const navigation = useNavigation<NavigationProps>();

  const onSearchBarChange = debounce((text) => {
    setSearchText(text);
    dispatch(setIsEnd(false));
  }, 300);

  const clearAuthHeader = () => {
    setOpenSearchBar(false);
    setSearchText('');
    navigation.setOptions({
      headerTitle: (props) => <RecordsHeaderTitle {...props} />,
      headerLeft: () => null,
    });
  };

  const onSearchButtonClickHandler = () => {
    setOpenSearchBar(!openSearchBar);
    // do not fetch again, when searchText is already empty
    if (searchText !== '') dispatch(setIsEnd(false));
    // removing debounce
    onSearchBarChange.cancel();
    setSearchText('');
  };

  useEffect(() => {
    if (drafts.length || searchText.length) {
      navigation.setOptions({
        //Implement search bar
        headerTitle: (props) => {
          if (openSearchBar)
            return (
              <SearchBar
                placeholder="Search in Drafts:"
                onChangeText={onSearchBarChange}
              />
            );
          return <RecordsHeaderTitle {...props} />;
        },
        // open search bar button
        headerLeft: ({ tintColor }) => (
          <LeftHeader>
            <IconButton
              iconName="search"
              size={sizes.SIDE_ICON_SIZE}
              color={tintColor}
              onPress={onSearchButtonClickHandler}
            />
          </LeftHeader>
        ),
      });
    } else clearAuthHeader();

    return () => onSearchBarChange.cancel(); //removing debounce, when component is unmounted
  }, [drafts.length, openSearchBar]);

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
            color={CYBER_YELLOW}
            icon={{ name: 'add', color: 'white' }}
            onPress={() => navigation.navigate(NavigationName.RECORDS_MANAGING)}
          />
        )}
      </RecordsContent>
    </RecordsContainer>
  );
};
