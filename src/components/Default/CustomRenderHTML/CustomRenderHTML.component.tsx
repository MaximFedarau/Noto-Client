import { ReactElement } from 'react';
import { RenderHTML } from 'react-native-render-html';

//Interface for Props
interface CustomRenderHTMLProps {
  children: string;
  contentWidth?: number;
}

export default function CustomRenderHTML({
  contentWidth,
  children,
}: CustomRenderHTMLProps): ReactElement {
  return (
    <RenderHTML
      contentWidth={contentWidth}
      source={{
        html: children,
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
      ignoredStyles={[
        'fontSize',
        'fontFamily',
        'fontWeight',
        'fontStyle',
        'height',
        'width',
      ]}
    />
  );
}
