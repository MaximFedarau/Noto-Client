//Types
import { ReactElement } from 'react';

//Components
import Content from '@components/Auth/SignUp/Content/Content.component';
import { AuthScreenContainer } from '@components/Default/View/View.component';

export default function SignUp(): ReactElement {
  return (
    <AuthScreenContainer>
      <Content />
    </AuthScreenContainer>
  );
}
