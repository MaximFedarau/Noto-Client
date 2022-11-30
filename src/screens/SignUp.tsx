import React, { FC } from 'react';

import Content from '@components/Auth/Screens/SignUp/Content';
import { AuthScreenContainer } from '@components/Default/View/View.component';

export const SignUp: FC = () => (
  <AuthScreenContainer>
    <Content />
  </AuthScreenContainer>
);
