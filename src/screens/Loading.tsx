import React, { FC } from 'react';
import { StatusBar } from 'expo-status-bar';

import { LoadingContainer, NoItemsText } from '@components/Default';

export const Loading: FC = () => (
  <>
    <StatusBar style="dark" />
    <LoadingContainer>
      <NoItemsText>Loading...</NoItemsText>
    </LoadingContainer>
  </>
);
