import { ReactElement } from 'react';
import Toast from 'react-native-toast-message';

import { AuthScreenContainer } from '@components/Default/View/View.component';
import Content from '@components/Auth/Screens/AvatarPicker/Content/Content.component';

export default function AvatarPicker(): ReactElement {
  return (
    <AuthScreenContainer>
      <Content />
      <Toast />
    </AuthScreenContainer>
  );
}
