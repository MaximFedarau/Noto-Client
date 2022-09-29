import { ReactElement } from 'react';

import Content from '@components/Auth/Screens/SignIn/Content/Content.component';
import { AuthScreenContainer } from '@components/Default/View/View.component';

export default function Auth(): ReactElement {
  return (
    <AuthScreenContainer>
      <Content />
    </AuthScreenContainer>
  );
}
