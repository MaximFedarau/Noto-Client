import React, { ReactElement } from 'react';
import { TextInputProps, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import showdown from 'showdown';

import FormField from '@components/NotesManaging/FormField/FormField.component';
import CustomRenderHTML from '@components/Default/CustomRenderHTML/CustomRenderHTML.component';
import {
  MarkdownFieldContainer,
  TabContainer,
  TabText,
  FieldContainer,
  MarkdownContainer,
} from './MarkdownField.styles';

//Interface for Props
interface MarkdownFieldProps extends TextInputProps {
  children: string;
  errorMessage?: string;
}

const MarkdownField = React.memo(function MarkdownField({
  children,
  errorMessage,
  value,
  ...props
}: MarkdownFieldProps): ReactElement {
  const { width } = useWindowDimensions();
  const converter = new showdown.Converter();

  const [renderedHTML, setRenderedHTML] = React.useState<string>('');
  const [tabIndex, setTabIndex] = React.useState<number>(0);

  // when user clears the field and is in the Preivew tab, the renderedHTML is set to an empty string
  React.useEffect(() => {
    if (!value && tabIndex === 1) setRenderedHTML('');
  }, [value]);

  return (
    <>
      <MarkdownFieldContainer>
        <TabContainer
          isActive={tabIndex === 0}
          onPress={() => {
            setTabIndex(0);
          }}
        >
          <TabText isActive={tabIndex === 0}>{children}</TabText>
        </TabContainer>
        <TabContainer
          isActive={tabIndex === 1}
          onPress={() => {
            setRenderedHTML(converter.makeHtml(value || '')); // when we switch to markdown (html) tab, then we convert our value to html
            setTabIndex(1);
          }}
        >
          <TabText isActive={tabIndex === 1}>Preview</TabText>
        </TabContainer>
      </MarkdownFieldContainer>
      {tabIndex === 0 && (
        <FieldContainer>
          <FormField
            {...props}
            value={value}
            errorMessage={errorMessage}
            multiline
            autoComplete="off"
            scrollEnabled={false}
            leftIcon={<Ionicons name="logo-markdown" size={20} />}
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
});

export default MarkdownField;
