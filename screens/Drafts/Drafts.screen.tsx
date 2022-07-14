//Types
import { ReactElement } from 'react';

//Componets
import { DraftsView } from '@components/Default/View/View.component';
import { NoItemsText } from '@components/Default/Text/Text.component';

export default function Drafts(): ReactElement {
  return (
    <DraftsView>
      <NoItemsText>No drafts</NoItemsText>
    </DraftsView>
  );
}
