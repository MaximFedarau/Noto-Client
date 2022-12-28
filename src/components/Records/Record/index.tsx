import React, { FC } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Converter } from 'showdown';

import { CustomRenderHTML, RecordTitle } from '@components/Default';
import { SIZES } from '@constants';
import {
  NavigationProps,
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

export const Record: FC<Props> = ({ children, type }) => {
  const { title, content, id } = children;
  const { width } = useWindowDimensions();

  const converter = new Converter({ noHeaderId: true });
  const modifiedContent = contentFormat(converter.makeHtml(content || ''));

  const navigation = useNavigation<NavigationProps>();

  const onPressHandler = () => {
    if (!title && !content) return;
    navigation.navigate(NavigationName.RECORDS_MANAGING, {
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
      <CustomRenderHTML contentWidth={width - SIZES.lg * 2}>
        {/* SIZES.lg is the padding of the container */}
        {modifiedContent}
      </CustomRenderHTML>
    </Container>
  );
};
