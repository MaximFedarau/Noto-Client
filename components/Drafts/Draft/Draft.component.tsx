//Types
import { ReactElement } from 'react';
import { DraftSchema } from '@app-types/types';

//Components
import { DraftContainer } from './Draft.styles';

import {
  DraftTitle,
  NoDraftText,
} from '@components/Default/Text/Text.component';

//Constants
import { contentFormat } from '@utils/contentFormat';

//React Native
import { useWindowDimensions } from 'react-native';

//React Render HTML
import { RenderHTML } from 'react-native-render-html';

//Interface for Props
interface DraftProps {
  children: DraftSchema;
}

export default function Draft({ children }: DraftProps): ReactElement {
  const { title, content } = children;
  const modifiedContent = contentFormat(content!);

  const { width } = useWindowDimensions();

  return (
    <DraftContainer style={({ pressed }) => [pressed ? { opacity: 0.75 } : {}]}>
      <DraftTitle>{title}</DraftTitle>
      {!content ? (
        <NoDraftText>-</NoDraftText>
      ) : (
        <RenderHTML
          contentWidth={width}
          source={{
            html: modifiedContent!,
          }}
        />
      )}
    </DraftContainer>
  );
}
