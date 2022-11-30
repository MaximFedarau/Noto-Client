import React, { FC } from 'react';

import { FormButtonsContainer } from '@components/Default/View/View.component';

import { FormSubmitButton, HomeButton, styles } from './styles';

interface Props {
  children: string;
  onSubmit: () => void;
  onHomeReturn: () => void;
}

const FormButtons: FC<Props> = ({ children, onSubmit, onHomeReturn }) => (
  <FormButtonsContainer>
    <FormSubmitButton
      onPress={onSubmit}
      style={({ pressed }) => (pressed ? { opacity: 0.8 } : {})}
      textStyle={styles.buttonText}
    >
      {children}
    </FormSubmitButton>
    <HomeButton
      iconName="home"
      color="white"
      size={24}
      onPress={onHomeReturn}
    />
  </FormButtonsContainer>
);

export default FormButtons;
