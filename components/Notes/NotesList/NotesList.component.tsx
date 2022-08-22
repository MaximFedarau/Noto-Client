import React, { ReactElement } from 'react';
import { FlashList } from '@shopify/flash-list';

import Note from '@components/Notes/Note/Note.component';
import GoUpButton from '@components/Auth/Defaults/GoUpButton/GoUpButton.component';
import { NoteSchema } from '@app-types/types';
import { SOFT_BLUE } from '@constants/colors';

//Interface for Props
interface NotesListProps {
  children: NoteSchema[];
}

export default function NotesList({ children }: NotesListProps): ReactElement {
  const [threshold, setThreshold] = React.useState<number>(0);
  const [contentHeight, setContentHeight] = React.useState<number>(0);
  const [layoutHeight, setLayoutHeight] = React.useState<number>(0);
  const [offset, setOffset] = React.useState<number>(0);

  const ref = React.useRef<FlashList<NoteSchema>>(null);

  React.useEffect(() => {
    // setting threshol9d for scroll to the latest note button
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
        renderItem={(item) => <Note>{item.item}</Note>}
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
        <GoUpButton color={SOFT_BLUE} onPress={scrollToEndHandler} />
      )}
    </>
  );
}
