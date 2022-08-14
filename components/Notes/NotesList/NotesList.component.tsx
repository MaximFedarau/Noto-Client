import { ReactElement } from 'react';
import { FlatList } from 'react-native';

import Note from '@components/Notes/Note/Note.component';
import { NoteSchema } from '@app-types/types';

//Interface for Props
interface NotesListProps {
  children: NoteSchema[];
}

export default function NotesList({ children }: NotesListProps): ReactElement {
  return (
    <FlatList
      data={children}
      renderItem={(item) => <Note>{item.item}</Note>}
      scrollsToTop
      inverted
    />
  );
}
