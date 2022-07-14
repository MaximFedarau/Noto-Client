//Styled componets
import styled from 'styled-components/native';

// ! Default

export const DefaultView = styled.View`
  flex: 1;
  flex-direction: column;
`;

export const DefaultScrollView = styled.ScrollView`
  flex: 1;
  flex-direction: column;
`;

// ! App

export const RightHeaderView = styled(DefaultView)`
  margin-right: 12px;
  flex: none;
`;

export const LeftHeaderView = styled(DefaultView)`
  margin-left: 12px;
  flex: none;
`;

// ! Notes Screen

export const NotesView = styled(DefaultView)`
  align-items: center;
  justify-content: center;
`;

// ! Notes Managing Screen

export const FormView = styled(DefaultScrollView)`
  margin-vertical: 16px;
`;

// ! Drafts Screen

export const DraftsView = styled(DefaultView)`
  align-items: center;
  justify-content: center;
`;
