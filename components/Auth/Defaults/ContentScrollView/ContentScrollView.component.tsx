//Types
import { ReactElement } from 'react';
import { ScrollViewProps } from 'react-native';

//Constants
import { styles } from './ContentScrollView.styles';

//Components
import { DefaultScrollView } from '@components/Default/View/View.component';

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
