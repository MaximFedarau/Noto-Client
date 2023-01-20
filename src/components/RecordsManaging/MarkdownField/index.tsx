import React, { FC, useState, useEffect } from 'react';
import { TextInputProps, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { marked } from 'marked';

import { RecordsManagingFormField } from '@components/RecordsManaging/FormField';
import { CustomRenderHTML } from '@components/Default';
import { SIZES } from '@constants';

import {
  MarkdownFieldContainer,
  TabContainer,
  TabText,
  FieldContainer,
  MarkdownContainer,
} from './styles';

interface Props extends TextInputProps {
  children: string;
  errorMessage?: string;
}

export const MarkdownField: FC<Props> = ({
  children,
  errorMessage,
  value,
  ...props
}) => {
  const { width } = useWindowDimensions();

  const [renderedHTML, setRenderedHTML] = useState('');
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (!value && tabIndex === 1) setRenderedHTML('');
  }, [value]);

  return (
    <>
      <MarkdownFieldContainer>
        <TabContainer isActive={tabIndex === 0} onPress={() => setTabIndex(0)}>
          <TabText isActive={tabIndex === 0}>{children}</TabText>
        </TabContainer>
        <TabContainer
          isActive={tabIndex === 1}
          onPress={() => {
            setRenderedHTML(marked.parse(value || '', { headerIds: false })); // when we switch to markdown (html) tab, then we convert our value to html
            setTabIndex(1);
          }}
        >
          <TabText isActive={tabIndex === 1}>Preview</TabText>
        </TabContainer>
      </MarkdownFieldContainer>
      {tabIndex === 0 && (
        <FieldContainer>
          <RecordsManagingFormField
            {...props}
            value={value}
            errorMessage={errorMessage}
            multiline
            autoComplete="off"
            scrollEnabled={false}
            leftIcon={<Ionicons name="logo-markdown" size={SIZES.xl} />}
          />
        </FieldContainer>
      )}
      {tabIndex === 1 && (
        <MarkdownContainer>
          <CustomRenderHTML contentWidth={width}>
            {renderedHTML}
          </CustomRenderHTML>
        </MarkdownContainer>
      )}
    </>
  );
};
