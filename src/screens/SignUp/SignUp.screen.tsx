import { ReactElement } from 'react';

import Content from '@components/Auth/Screens/SignUp/Content/Content.component';
import { AuthScreenContainer } from '@components/Default/View/View.component';

export default function SignUp(): ReactElement {
  return (
    <AuthScreenContainer>
      <Content />
    </AuthScreenContainer>
  );
}
