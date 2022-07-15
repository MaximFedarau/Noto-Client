//Types
import React, { ReactElement } from 'react';

//Components
import { LoadingView } from '@components/Default/View/View.component';
import { NoItemsText } from '@components/Default/Text/Text.component';

export default function Loading(): ReactElement {
  return (
    <LoadingView>
      <NoItemsText>Loading...</NoItemsText>
    </LoadingView>
  );
}
