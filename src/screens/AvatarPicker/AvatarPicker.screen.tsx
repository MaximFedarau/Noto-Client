import { ReactElement } from 'react';

import { AuthScreenContainer } from '@components/Default/View/View.component';
import Content from '@components/Auth/Screens/AvatarPicker/Content/Content.component';

export default function AvatarPicker(): ReactElement {
  return (
    <AuthScreenContainer>
      <Content />
    </AuthScreenContainer>
  );
}
