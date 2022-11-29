import React, { FC } from 'react';
import { StatusBar } from 'expo-status-bar';

import { LoadingView } from '@components/Default/View/View.component';
import { NoItemsText } from '@components/Default/Text/Text.component';

export const Loading: FC = () => (
  <>
    <StatusBar style="dark" />
    <LoadingView>
      <NoItemsText>Loading...</NoItemsText>
    </LoadingView>
  </>
);
