//Types
import { ReactElement } from 'react';

//Components
import { AuthScreenContainer } from '@components/Default/View/View.component';
import Content from '@components/Auth/Screens/AvatarPicker/Content/Content.component';

//React Native Toast Message
import Toast from 'react-native-toast-message';

export default function AvatarPicker(): ReactElement {
  return (
    <AuthScreenContainer>
      <Content />
      <Toast />
    </AuthScreenContainer>
  );
}
