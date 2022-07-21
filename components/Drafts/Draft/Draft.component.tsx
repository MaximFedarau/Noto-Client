//Types
import React, { ReactElement } from 'react';
import { DraftSchema } from '@app-types/types';
import { NavigationProps } from '@app-types/types';
import { NAVIGATION_NAMES, NAVIGATION_NOTES_NAMES } from '@app-types/enum';

//Components
import { DraftContainer } from './Draft.styles';

import {
  DraftTitle,
  NoDraftText,
} from '@components/Default/Text/Text.component';

//Constants
import { contentFormat } from '@utils/contentFormat';

//React Native
import { useWindowDimensions } from 'react-native';

//React Navigation
import { useNavigation } from '@react-navigation/native';

//React Render HTML
import { RenderHTML } from 'react-native-render-html';

//Showdown
import * as showdown from 'showdown';

//Interface for Props
interface DraftProps {
  children: DraftSchema;
}

const Draft = React.memo(function Draft({
  children,
}: DraftProps): ReactElement {
  const { title, content, id } = children;
  const converter = new showdown.Converter();
  const modifiedContent = converter.makeHtml(contentFormat(content!));

  const { width } = useWindowDimensions();

  const navigation = useNavigation<NavigationProps>();

  function onDraftPressHandler() {
    if (!title && !content) return;
    navigation.navigate(NAVIGATION_NOTES_NAMES.NOTES_MANAGING, {
      id,
    });
  }

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
            html: modifiedContent!,
          }}
        />
      )}
    </DraftContainer>
  );
});

export default Draft;
