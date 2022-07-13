//Types
import React, { ReactElement } from 'react';
import { TextInputProps, useWindowDimensions } from 'react-native';

//Components
import FormField from '../FormField/FormField.component';

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

export default function MarkdownField({
  children,
  errorMessage,
  value,
  ...props
}: MarkdownFieldProps): ReactElement {
  const window = useWindowDimensions();

  const [renderedHTML, setRenderdHTML] = React.useState<string>('');

  const converter = new showdown.Converter();
  React.useEffect(() => {
    setRenderdHTML(converter.makeHtml(value || ''));
  }, [value]);
  return (
    <>
      <FormField
        {...props}
        value={value}
        errorMessage={errorMessage}
        multiline
        autoComplete="off"
        leftIcon={<Ionicons name="logo-markdown" size={20} />}
      >
        {children}
      </FormField>
      <RenderHtml
        contentWidth={window.width}
        source={{
          html: renderedHTML,
        }}
        ignoredDomTags={['script', 'style', 'img', 'svg']}
        renderersProps={{
          ul: {
            enableExperimentalRtl: true,
          },
          ol: {
            enableExperimentalRtl: true,
          },
        }}
      />
    </>
  );
}
