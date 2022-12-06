import React, { FC } from 'react';
import { StatusBar } from 'expo-status-bar';

import { LoadingContainer } from '@components/Default/View';
import { NoItemsText } from '@components/Default/Text';

export const Loading: FC = () => (
  <>
    <StatusBar style="dark" />
    <LoadingContainer>
      <NoItemsText>Loading...</NoItemsText>
    </LoadingContainer>
  </>
);
