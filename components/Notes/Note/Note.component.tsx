import React, { ReactElement } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RenderHTML } from 'react-native-render-html';
import * as showdown from 'showdown';

import { NoteContainer } from './Note.styles';
import { NoteTitle, NoNoteText } from '@components/Default/Text/Text.component';
import { NavigationProps, NoteSchema } from '@app-types/types';
import { NAVIGATION_NOTES_NAMES } from '@app-types/enum';
import { titleFormat } from '@utils/stringInteraction/titleFormat';
import { contentFormat } from '@utils/stringInteraction/contentFormat';

//Interface for Props
interface NoteProps {
  children: NoteSchema;
}

const Note = React.memo(function Note({ children }: NoteProps): ReactElement {
  const { title, content, id } = children;
  const converter = new showdown.Converter({ noHeaderId: true });
  const modifiedContent = contentFormat(converter.makeHtml(content || ''));

  const { width } = useWindowDimensions();

  const navigation = useNavigation<NavigationProps>();

  // going to the notes overview screen passing route.id as a prop
  const onNotePressHandler = () => {
    if (!title && !content) return;
    navigation.navigate(NAVIGATION_NOTES_NAMES.NOTES_MANAGING, {
      noteId: id,
    });
  };

  return (
    <NoteContainer
      onPress={onNotePressHandler}
      style={({ pressed }) => (pressed ? { opacity: 0.8 } : {})}
    >
      <NoteTitle>{titleFormat(title || '')}</NoteTitle>
      {content ? (
        <RenderHTML
          contentWidth={width}
          source={{
            html: modifiedContent,
          }}
        />
      ) : (
        <NoNoteText>-</NoNoteText>
      )}
    </NoteContainer>
  );
});

export default Note;