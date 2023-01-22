import React, { FC, useCallback, useMemo, memo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { marked } from 'marked';

import { CustomRenderHTML, RecordTitle } from '@components/Default';
import { SIZES } from '@constants';
import {
  RecordsTabScreenProps,
  NavigationRecordsName,
  NavigationName,
  Record as IRecord,
  RecordType,
} from '@types';
import { contentFormat } from '@utils';

import { Container } from './styles';

interface Props {
  children: IRecord;
  type: RecordType;
}

type ScreenProps =
  | RecordsTabScreenProps<NavigationRecordsName.NOTES>
  | RecordsTabScreenProps<NavigationRecordsName.DRAFTS>;

// add caching to optimize parent list re-renders
export const Record: FC<Props> = memo(({ children, type }) => {
  const { title, content, id } = children;
  const { width } = useWindowDimensions();
  const navigation = useNavigation<ScreenProps['navigation']>();

  const modifiedContent = useMemo(
    () => contentFormat(marked.parse(content || '', { headerIds: false })),
    [content],
  );

  const onPressHandler = useCallback(() => {
    if (!title && !content) return;
    navigation.navigate(NavigationName.RECORDS_MANAGING, {
      ...(type === RecordType.DRAFT ? { draftId: id } : { noteId: id }),
    });
  }, [title, content, navigation, type, id]);

  return (
    <Container
      onPress={onPressHandler}
      style={({ pressed }) => (pressed ? { opacity: 0.8 } : {})}
    >
      {title && (
        <RecordTitle ellipsizeMode="tail" numberOfLines={3}>
          {title}
        </RecordTitle>
      )}
      <CustomRenderHTML contentWidth={width - SIZES.lg * 2}>
        {/* SIZES.lg is the padding of the container */}
        {modifiedContent}
      </CustomRenderHTML>
    </Container>
  );
});
