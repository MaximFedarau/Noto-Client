import React, { FC } from 'react';

import Content from '@components/Auth/Screens/SignIn/Content/Content.component';
import { AuthScreenContainer } from '@components/Default/View/View.component';

export const SignIn: FC = () => (
  <AuthScreenContainer>
    <Content />
  </AuthScreenContainer>
);
