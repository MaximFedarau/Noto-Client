import { ReactElement } from 'react';
import { ScrollViewProps } from 'react-native';

import { DefaultScrollView } from '@components/Default/View/View.component';

import { styles } from './ContentScrollView.styles';

export default function ContentScrollView({
  children,
}: ScrollViewProps): ReactElement {
  return (
    <DefaultScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      bounces={false}
    >
      {children}
    </DefaultScrollView>
  );
}
