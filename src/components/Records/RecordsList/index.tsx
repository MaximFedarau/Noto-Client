import React, { FC, useState, useRef, useEffect } from 'react';
import { FlatList, FlatListProps } from 'react-native';

import { Record } from '@components/Records/Record';
import { GoUpButton } from '@components/Records/GoUpButton';
import { SIZES, COLORS } from '@constants';
import { Record as IRecord, RecordType } from '@types';

interface Props
  extends Omit<FlatListProps<IRecord>, 'children' | 'data' | 'renderItem'> {
  children: IRecord[];
  type: RecordType;
}

export const RecordsList: FC<Props> = ({ children, type, ...props }) => {
  const [threshold, setThreshold] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [layoutHeight, setLayoutHeight] = useState(0);
  const [offset, setOffset] = useState(0);

  const ref = useRef<FlatList<IRecord>>(null);

  // after all content renders
  useEffect(() => {
    // setting threshold for scroll to the latest note item + a little timeout, because we should wait for heights to be set
    const timer = setTimeout(() => {
      setThreshold(contentHeight - layoutHeight);
    }, 100);
    return () => clearTimeout(timer);
  }, [layoutHeight, contentHeight]);

  const scrollToEndHandler = () => {
    if (ref.current)
      ref.current.scrollToOffset({ animated: true, offset: threshold });
  };

  return (
    <>
      <FlatList
        {...props}
        data={children}
        renderItem={({ item }) => <Record type={type}>{item}</Record>}
        scrollsToTop
        inverted
        ref={ref}
        onScroll={({ nativeEvent }) => {
          // setting user's current scroll position
          setOffset(nativeEvent.contentOffset.y);
        }}
        onLayout={({ nativeEvent }) => {
          // setting available list height
          setLayoutHeight(nativeEvent.layout.height);
        }}
        onContentSizeChange={(_, height) => {
          // SIZES['22xl'] - min height of one item
          if (height >= SIZES['22xl']) {
            // setting required height for list data
            setContentHeight(height);
          }
        }}
      />
      {offset >= 0 && // if user has scrolled (bounced)
        layoutHeight > 0 && // when list is rendered => layoutHeight (its height) is not 0
        Math.trunc(offset) < Math.trunc(threshold) && ( // when user has not scrolled to the end
          <GoUpButton
            color={
              type === RecordType.DRAFT ? COLORS.cyberYellow : COLORS.softBlue
            }
            onPress={scrollToEndHandler}
          />
        )}
    </>
  );
};
