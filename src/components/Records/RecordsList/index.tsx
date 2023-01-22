import React, { FC, useState, useRef, memo, useCallback } from 'react';
import { FlatList, FlatListProps } from 'react-native';

import { Record } from '@components/Records/Record';
import { GoUpButton } from '@components/Records/GoUpButton';
import { COLORS } from '@constants';
import { Record as IRecord, RecordType } from '@types';

interface Props
  extends Omit<FlatListProps<IRecord>, 'children' | 'data' | 'renderItem'> {
  children: IRecord[];
  type: RecordType;
}

// add caching to optimize list re-renders
export const RecordsList: FC<Props> = memo(({ children, type, ...props }) => {
  const [{ contentHeight, layoutHeight, offset }, setLayoutParams] = useState({
    contentHeight: 0, // height of all Records
    layoutHeight: 0, // height of visible Records
    offset: 0, // current scroll position
  });

  const ref = useRef<FlatList<IRecord>>(null);

  const scrollToEndHandler = useCallback(() => {
    ref.current?.scrollToOffset({ animated: true, offset: 0 });
  }, [ref]);

  return (
    <>
      <FlatList
        {...props}
        data={children}
        renderItem={({ item }) => <Record type={type}>{item}</Record>}
        ref={ref}
        onScroll={({ nativeEvent: { contentOffset } }) => {
          setLayoutParams((params) => ({ ...params, offset: contentOffset.y }));
        }}
        onLayout={({ nativeEvent: { layout } }) => {
          setLayoutParams((params) => ({
            ...params,
            layoutHeight: layout.height,
          }));
        }}
        onContentSizeChange={(_, height) => {
          setLayoutParams((params) => ({ ...params, contentHeight: height }));
        }}
      />
      {[offset, contentHeight, layoutHeight].every((value) => value > 0) && // check if user has scrolled down (offset > 0) and list has rendered (height > 0)
        Math.trunc(offset) <= Math.trunc(contentHeight - layoutHeight) && ( // if user has scrolled to the bottom & reached threshold/lowest offset = contentHeight - layoutHeight)
          <GoUpButton
            color={
              type === RecordType.DRAFT ? COLORS.cyberYellow : COLORS.softBlue
            }
            onPress={scrollToEndHandler}
          />
        )}
    </>
  );
});
