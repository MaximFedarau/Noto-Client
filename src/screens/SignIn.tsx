import React, { FC } from 'react';

import {
  ContentScrollView,
  AuthForm,
  Logo,
  AuthScreenContainer,
} from '@components';

export const SignIn: FC = () => (
  <AuthScreenContainer>
    <ContentScrollView>
      <Logo />
      <AuthForm hasAccount />
    </ContentScrollView>
  </AuthScreenContainer>
);
