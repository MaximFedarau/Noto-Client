import { ReactElement } from 'react';
import { ActivityIndicator } from 'react-native';

import { AuthFormButtonsContainer } from '@components/Default/View/View.component';

export default function Spinner(): ReactElement {
  return (
    <AuthFormButtonsContainer>
      <ActivityIndicator size="large" />
    </AuthFormButtonsContainer>
  );
}
