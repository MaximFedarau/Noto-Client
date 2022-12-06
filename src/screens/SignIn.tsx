import React, { FC } from 'react';

import ContentScrollView from '@components/Auth/ContentScrollView';
import Logo from '@components/Auth/Logo';
import Form from '@components/Auth/Form';
import { AuthScreenContainer } from '@components/Default/View';

export const SignIn: FC = () => (
  <AuthScreenContainer>
    <ContentScrollView>
      <Logo />
      <Form hasAccount />
    </ContentScrollView>
  </AuthScreenContainer>
);
