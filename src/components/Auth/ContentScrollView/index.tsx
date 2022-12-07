import React, { FC } from 'react';
import { ScrollViewProps } from 'react-native';

import { ScrollContainer } from '@components/Default';

import { styles } from './styles';

export const ContentScrollView: FC<ScrollViewProps> = ({
  children,
}: ScrollViewProps) => (
  <ScrollContainer
    style={styles.container}
    contentContainerStyle={styles.contentContainer}
    bounces={false}
    showsVerticalScrollIndicator={false}
  >
    {children}
  </ScrollContainer>
);
