//Styled componets
import styled from 'styled-components/native';

// ! Default

export const DefaultView = styled.View`
  flex: 1;
  flex-direction: column;
`;

// ! Notes Screen

export const NotesView = styled(DefaultView)`
  align-items: center;
  justify-content: center;
`;

// ! Drafts Screen

export const DraftsView = styled(DefaultView)`
  align-items: center;
  justify-content: center;
`;
