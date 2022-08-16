import React, { ReactElement } from 'react';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native';

import Draft from '@components/Drafts/Draft/Draft.component';
import IconButton from '@components/Default/IconButton/IconButton.component';
import { DraftSchema } from '@app-types/types';

import { styles } from './DraftsList.styles';

//Interface for Props
interface DraftsListProps {
  children: DraftSchema[];
}

export default function DraftsList({
  children,
}: DraftsListProps): ReactElement {
  const [threshold, setThreshold] = React.useState<number>(0);
  const [contentHeight, setContentHeight] = React.useState<number>(0);
  const [layoutHeight, setLayoutHeight] = React.useState<number>(0);
  const [offset, setOffset] = React.useState<number>(0);

  const ref = React.useRef<FlashList<DraftSchema>>(null);

  React.useEffect(() => {
    // setting threshold for scroll to the latest note button
    setThreshold(contentHeight - layoutHeight);
  }, [layoutHeight, contentHeight]);

  function scrollToEndHandler() {
    if (ref.current) {
      ref.current.scrollToOffset({ animated: true, offset: threshold });
    }
  }

  return (
    <>
      <FlashList
        data={children}
        renderItem={(item) => <Draft>{item.item}</Draft>}
        scrollsToTop
        inverted
        ref={ref}
        onScroll={(event) => {
          // setting user's current scroll position
          setOffset(event.nativeEvent.contentOffset.y);
        }}
        onLayout={(event) => {
          // setting available height for list
          setLayoutHeight(event.nativeEvent.layout.height);
        }}
        onContentSizeChange={(_, height) => {
          if (height > 0) {
            // setting required height for list data
            setContentHeight(height);
          }
        }}
        estimatedItemSize={302}
      />
      {Math.trunc(offset) < Math.trunc(threshold) && offset >= 0 && (
        <SafeAreaView>
          <IconButton
            style={styles.scrollToEndButton}
            iconName="arrow-up"
            size={24}
            color="white"
            onPress={scrollToEndHandler}
          >
            There are new note(-s).
          </IconButton>
        </SafeAreaView>
      )}
    </>
  );
}
