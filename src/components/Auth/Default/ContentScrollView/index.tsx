import React, { FC } from 'react';
import { ScrollViewProps } from 'react-native';

import { DefaultScrollView } from '@components/Default/View/View.component';

import { styles } from './styles';

const ContentScrollView: FC<ScrollViewProps> = ({
  children,
}: ScrollViewProps) => (
  <DefaultScrollView
    style={styles.container}
    contentContainerStyle={styles.contentContainer}
    bounces={false}
  >
    {children}
  </DefaultScrollView>
);

export default ContentScrollView;
