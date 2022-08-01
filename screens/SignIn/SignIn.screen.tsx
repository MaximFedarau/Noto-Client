import { ReactElement } from 'react';
import Toast from 'react-native-toast-message';

import Content from '@components/Auth/Screens/SignIn/Content/Content.component';
import { AuthScreenContainer } from '@components/Default/View/View.component';

export default function Auth(): ReactElement {
  return (
    <AuthScreenContainer>
      <Content />
      <Toast />
    </AuthScreenContainer>
  );
}
