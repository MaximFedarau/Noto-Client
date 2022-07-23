//Types
import { ReactElement } from 'react';

//Components
import Content from '@components/Auth/SignIn/Content/Content.component';

import { AuthScreenContainer } from '@components/Default/View/View.component';

export default function Auth(): ReactElement {
  return (
    <AuthScreenContainer>
      <Content />
    </AuthScreenContainer>
  );
}
