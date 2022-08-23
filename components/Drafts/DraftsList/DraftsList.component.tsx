import React, { ReactElement } from 'react';
import { FlatList } from 'react-native';

import Draft from '@components/Drafts/Draft/Draft.component';
import GoUpButton from '@components/Auth/Defaults/GoUpButton/GoUpButton.component';
import { DraftSchema } from '@app-types/types';
import { CYBER_YELLOW } from '@constants/colors';

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

  const ref = React.useRef<FlatList<DraftSchema>>(null);

  // after all content renders
  React.useLayoutEffect(() => {
    // setting threshold for scroll to the latest note item + a little timeout, because we should wait for heights to be set
    const timer = setTimeout(() => {
      setThreshold(contentHeight - layoutHeight);
    }, 100);
    return () => clearTimeout(timer);
  }, [layoutHeight, contentHeight]);

  function scrollToEndHandler() {
    if (ref.current) {
      ref.current.scrollToOffset({ animated: true, offset: threshold });
    }
  }

  return (
    <>
      <FlatList
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
          // setting available list height
          setLayoutHeight(event.nativeEvent.layout.height);
        }}
        onContentSizeChange={(_, height) => {
          // min height of one item
          if (height >= 104) {
            // setting required height for list data
            setContentHeight(height);
          }
        }}
      />
      {offset >= 0 && // if user has scrolled (bounced)
        layoutHeight > 0 && // when list is rendered => layoutHeight (its height) is not 0
        Math.trunc(offset) < Math.trunc(threshold) && ( // when user has not scrolled to the end
          <GoUpButton color={CYBER_YELLOW} onPress={scrollToEndHandler} />
        )}
    </>
  );
}
