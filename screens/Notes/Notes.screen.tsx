import { ReactElement } from 'react';

import { NotesView } from '@components/Default/View/View.component';
import { NoItemsText } from '@components/Default/Text/Text.component';

export default function Notes(): ReactElement {
  return (
    <NotesView>
      <NoItemsText>No notes</NoItemsText>
    </NotesView>
  );
}
