//Types
import { ReactElement } from 'react';

//Components
import { AuthFormButtonsContainer } from '@components/Default/View/View.component';

//React Native
import { ActivityIndicator } from 'react-native';

export default function Spinner(): ReactElement {
  return (
    <AuthFormButtonsContainer>
      <ActivityIndicator size="large" />
    </AuthFormButtonsContainer>
  );
}
