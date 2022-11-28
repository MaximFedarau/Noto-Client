import React, { ReactElement } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as showdown from 'showdown';

import { DraftContainer } from './Draft.styles';
import { DraftTitle } from '@components/Default/Text/Text.component';
import CustomRenderHTML from '@components/Default/CustomRenderHTML/CustomRenderHTML.component';
import { NavigationProps, NavigationName, Record } from '@types';
import { contentFormat } from '@utils';

//Interface for Props
interface DraftProps {
  children: Record;
}

const Draft = React.memo(function Draft({
  children,
}: DraftProps): ReactElement {
  const { title, content, id } = children;
  const converter = new showdown.Converter({ noHeaderId: true });
  const modifiedContent = contentFormat(
    converter.makeHtml(content || '<h2 style="text-align: center;">-</h2>'),
  );
  const { width } = useWindowDimensions();

  const navigation = useNavigation<NavigationProps>();

  // going to the notes overview screen passing route.id as a prop
  const onDraftPressHandler = () => {
    if (!title && !content) return;
    navigation.navigate(NavigationName.NOTES_MANAGING, {
      draftId: id,
    });
  };

  return (
    <DraftContainer
      onPress={onDraftPressHandler}
      style={({ pressed }) => (pressed ? { opacity: 0.8 } : {})}
    >
      <DraftTitle ellipsizeMode="tail" numberOfLines={3}>
        {title || '-'}
      </DraftTitle>
      <CustomRenderHTML contentWidth={width - 32}>
        {/* 32 is the padding of the container */}
        {modifiedContent}
      </CustomRenderHTML>
    </DraftContainer>
  );
});

export default Draft;