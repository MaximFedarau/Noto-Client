import React, { FC } from 'react';

import ContentScrollView from '@components/Auth/Default/ContentScrollView';
import Logo from '@components/Auth/Default/Logo';
import Form from '@components/Auth/Screens/Form';
import { AuthScreenContainer } from '@components/Default/View/View.component';

export const SignUp: FC = () => (
  <AuthScreenContainer>
    <ContentScrollView>
      <Logo />
      <Form hasAccount={false} />
    </ContentScrollView>
  </AuthScreenContainer>
);
