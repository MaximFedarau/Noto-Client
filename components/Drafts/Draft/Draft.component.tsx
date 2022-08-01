import React, { ReactElement } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RenderHTML } from 'react-native-render-html';
import * as showdown from 'showdown';

import { DraftContainer } from './Draft.styles';
import {
  DraftTitle,
  NoDraftText,
} from '@components/Default/Text/Text.component';
import { DraftSchema, NavigationProps } from '@app-types/types';
import { NAVIGATION_NOTES_NAMES } from '@app-types/enum';
import { contentFormat } from '@utils/contentFormat';

//Interface for Props
interface DraftProps {
  children: DraftSchema;
}

const Draft = React.memo(function Draft({
  children,
}: DraftProps): ReactElement {
  const { title, content, id } = children;
  const converter = new showdown.Converter();
  const modifiedContent = converter.makeHtml(contentFormat(content || ''));

  const { width } = useWindowDimensions();

  const navigation = useNavigation<NavigationProps>();

  // going to the notes overview screen passing route.id as a prop
  const onDraftPressHandler = () => {
    if (!title && !content) return;
    navigation.navigate(NAVIGATION_NOTES_NAMES.NOTES_MANAGING, {
      id,
    });
  };

  return (
    <DraftContainer
      onPress={onDraftPressHandler}
      style={({ pressed }) => [pressed ? { opacity: 0.75 } : {}]}
    >
      <DraftTitle>{title || ''}</DraftTitle>
      {!content ? (
        <NoDraftText>-</NoDraftText>
      ) : (
        <RenderHTML
          contentWidth={width}
          source={{
            html: modifiedContent,
          }}
        />
      )}
    </DraftContainer>
  );
});

export default Draft;
