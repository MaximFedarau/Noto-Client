import React, { FC } from 'react';

import {
  ContentScrollView,
  AuthForm,
  Logo,
  AuthScreenContainer,
} from '@components';

export const SignUp: FC = () => (
  <AuthScreenContainer>
    <ContentScrollView>
      <Logo />
      <AuthForm hasAccount={false} />
    </ContentScrollView>
  </AuthScreenContainer>
);
