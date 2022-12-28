import React, { FC, memo } from 'react';
import { RenderHTML } from 'react-native-render-html';

interface Props {
  children: string;
  contentWidth?: number;
}

// memo fixes this issue: https://stackoverflow.com/q/68966120/2779871
export const CustomRenderHTML: FC<Props> = memo(
  ({ contentWidth, children }) => (
    <RenderHTML
      contentWidth={contentWidth}
      source={{ html: children }}
      ignoredDomTags={['script', 'img', 'svg', 'button']}
      renderersProps={{
        ul: { enableExperimentalRtl: true },
        ol: { enableExperimentalRtl: true },
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
  ),
);
