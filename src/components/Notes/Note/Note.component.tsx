import React, { ReactElement } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as showdown from 'showdown';

import { NoteTitle } from '@components/Default/Text/Text.component';
import CustomRenderHTML from '@components/Default/CustomRenderHTML/CustomRenderHTML.component';
import { NavigationProps, NavigationName, Record } from '@types';
import { contentFormat } from '@utils';
import { NoteContainer } from './Note.styles';

//Interface for Props
interface NoteProps {
  children: Record;
}

const Note = React.memo(function Note({ children }: NoteProps): ReactElement {
  const { title, content, id } = children;
  const converter = new showdown.Converter({ noHeaderId: true });
  const modifiedContent = contentFormat(
    converter.makeHtml(content || '<h2 style="text-align: center;">-</h2>'),
  );

  const { width } = useWindowDimensions();

  const navigation = useNavigation<NavigationProps>();

  // going to the notes overview screen passing route.id as a prop
  const onNotePressHandler = () => {
    if (!title && !content) return;
    navigation.navigate(NavigationName.NOTES_MANAGING, {
      noteId: id,
    });
  };

  return (
    <NoteContainer
      onPress={onNotePressHandler}
      style={({ pressed }) => (pressed ? { opacity: 0.8 } : {})}
    >
      <NoteTitle ellipsizeMode="tail" numberOfLines={3}>
        {title || '-'}
      </NoteTitle>
      <CustomRenderHTML contentWidth={width - 32}>
        {/* 32 is the padding of the container */}
        {modifiedContent}
      </CustomRenderHTML>
    </NoteContainer>
  );
});

export default Note;
