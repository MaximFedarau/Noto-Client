//Types
import { ReactElement } from 'react';

//Components
import Content from '@components/Auth/SignIn/Content/Content.component';

import { AuthScreenContainer } from '@components/Default/View/View.component';

//React Native Toast Message
import Toast from 'react-native-toast-message';

export default function Auth(): ReactElement {
  return (
    <AuthScreenContainer>
      <Content />
      <Toast />
    </AuthScreenContainer>
  );
}
