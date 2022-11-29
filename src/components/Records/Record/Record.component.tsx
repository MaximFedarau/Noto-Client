import React, { FC, memo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import showdown from 'showdown';

import { RecordTitle } from '@components/Default/Text/Text.component';
import CustomRenderHTML from '@components/Default/CustomRenderHTML/CustomRenderHTML.component';
import {
  NavigationProps,
  NavigationName,
  Record as IRecord,
  RecordType,
} from '@types';
import { contentFormat } from '@utils';

import { Container } from './Record.styles';

interface Props {
  children: IRecord;
  type: RecordType;
}

const Record: FC<Props> = memo(({ children, type }) => {
  const { title, content, id } = children;
  const { width } = useWindowDimensions();

  const converter = new showdown.Converter({ noHeaderId: true });
  const modifiedContent = contentFormat(converter.makeHtml(content || ''));

  const navigation = useNavigation<NavigationProps>();

  const onPressHandler = () => {
    if (!title && !content) return;
    navigation.navigate(NavigationName.NOTES_MANAGING, {
      ...(type === RecordType.DRAFT ? { draftId: id } : { noteId: id }),
    });
  };

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
      <CustomRenderHTML contentWidth={width - 32}>
        {/* 32 is the padding of the container */}
        {modifiedContent}
      </CustomRenderHTML>
    </Container>
  );
});

export default Record;
