import React, { FC } from 'react';

import { FormButtonsContainer } from '@components/Default';

import { FormSubmitButton, HomeButton, styles } from './styles';

interface Props {
  children: string;
  onSubmit: () => void;
  onHomeReturn: () => void;
}

export const FormButtons: FC<Props> = ({
  children,
  onSubmit,
  onHomeReturn,
}) => (
  <FormButtonsContainer>
    <FormSubmitButton onPress={onSubmit} textStyle={styles.buttonText}>
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
