import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RenderHTML } from 'react-native-render-html';
import * as showdown from 'showdown';

import { NoteContainer } from './Note.styles';
import { NoteTitle, NoNoteText } from '@components/Default/Text/Text.component';
import { NavigationProps, NoteSchema } from '@app-types/types';
import { NAVIGATION_NOTES_NAMES } from '@app-types/enum';
import { SOFT_BLUE } from '@constants/colors';
import { contentFormat } from '@utils/contentFormat';

//Interface for Props
interface NoteProps {
  children: NoteSchema;
}

const Note = React.memo(function Note({ children }: NoteProps): ReactElement {
  const { title, content, id } = children;
  const converter = new showdown.Converter();
  const modifiedContent = converter.makeHtml(contentFormat(content || ''));

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
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <Ionicons size={24} name="download" color={SOFT_BLUE} />
        <NoteTitle style={{ flex: 1, marginRight: 24 }}>
          {title || ''}
        </NoteTitle>
      </View>
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
