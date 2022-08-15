import React, { ReactElement } from 'react';
import { TextInputProps, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RenderHtml from 'react-native-render-html';
import * as showdown from 'showdown';

import FormField from '@components/NotesManaging/FormField/FormField.component';
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
  const window = useWindowDimensions();
  const converter = new showdown.Converter();

  const [renderedHTML, setRenderdHTML] = React.useState<string>('');
  const [tabIndex, setTabIndex] = React.useState<number>(0);

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
            setRenderdHTML(converter.makeHtml(value || '')); // when we switch to markdown (html) tab, then we convert our value to html
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
          <RenderHtml
            contentWidth={window.width}
            source={{
              html: renderedHTML,
            }}
            ignoredDomTags={['script', 'img', 'svg', 'button']}
            renderersProps={{
              ul: {
                enableExperimentalRtl: true, // enabling feature
              },
              ol: {
                enableExperimentalRtl: true, // enabling feature
              },
            }}
          />
        </MarkdownContainer>
      )}
    </>
  );
});

export default MarkdownField;
