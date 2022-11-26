import React, { ReactElement } from 'react';
import { StatusBar } from 'expo-status-bar';

import { LoadingView } from '@components/Default/View/View.component';
import { NoItemsText } from '@components/Default/Text/Text.component';

export default function Loading(): ReactElement {
  return (
    <>
      <StatusBar style="dark" />
      <LoadingView>
        <NoItemsText>Loading...</NoItemsText>
      </LoadingView>
    </>
  );
}
