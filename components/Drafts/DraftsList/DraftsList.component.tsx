import { ReactElement } from 'react';
import { FlatList } from 'react-native';

import Draft from '@components/Drafts/Draft/Draft.component';
import { DraftSchema } from '@app-types/types';

//Interface for Props
interface DraftsListProps {
  children: DraftSchema[];
}

export default function DraftsList({
  children,
}: DraftsListProps): ReactElement {
  return (
    <FlatList
      data={children}
      renderItem={(item) => <Draft>{item.item}</Draft>}
      scrollsToTop
      inverted
    />
  );
}
