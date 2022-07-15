//Types
import { ReactElement } from 'react';
import { DraftSchema } from '@app-types/types';

//Components
import Draft from '@components/Drafts/Draft/Draft.component';

//React Native
import { FlatList } from 'react-native';

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
