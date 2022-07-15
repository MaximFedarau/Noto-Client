//Types
import React, { ReactElement } from 'react';
import { TextInputProps, useWindowDimensions } from 'react-native';

//Components
import FormField from '@components/NotesManaging/FormField/FormField.component';

import {
  MarkdownFieldContainer,
  TabContainer,
  TabText,
  MarkdownContainer,
} from './MarkdownField.styles';

//Expo
import { Ionicons } from '@expo/vector-icons';

//React Render HTML
import RenderHtml from 'react-native-render-html';

// Showdown
import * as showdown from 'showdown';

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

  const [renderedHTML, setRenderdHTML] = React.useState<string>('');
  const [tabIndex, setTabIndex] = React.useState<number>(0);

  const converter = new showdown.Converter();
  React.useEffect(() => {
    setRenderdHTML(converter.makeHtml(value || ''));
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
            setTabIndex(1);
          }}
        >
          <TabText isActive={tabIndex === 1}>Preview</TabText>
        </TabContainer>
      </MarkdownFieldContainer>
      {tabIndex === 0 && (
        <FormField
          {...props}
          selectionColor="black"
          value={value}
          errorMessage={errorMessage}
          multiline
          autoComplete="off"
          leftIcon={<Ionicons name="logo-markdown" size={20} />}
        />
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
                enableExperimentalRtl: true,
              },
              ol: {
                enableExperimentalRtl: true,
              },
            }}
          />
        </MarkdownContainer>
      )}
    </>
  );
});

export default MarkdownField;
