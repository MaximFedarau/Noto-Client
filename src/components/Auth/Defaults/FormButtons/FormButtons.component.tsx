import { ReactElement } from 'react';

import { AuthFormButtonsContainer } from '@components/Default/View/View.component';

import { FormSubmitButton, HomeButton } from './FormButtons.styles';

//Interface for Props
interface FormButtonsProps {
  children: string;
  onSubmit: () => void;
  onHomeReturn: () => void;
}

export default function FormButtons({
  children,
  onSubmit,
  onHomeReturn,
}: FormButtonsProps): ReactElement {
  return (
    <AuthFormButtonsContainer>
      <FormSubmitButton
        onPress={onSubmit}
        style={({ pressed }) => (pressed ? { opacity: 0.8 } : {})}
        textStyle={{
          color: 'white',
          fontSize: 22,
          fontWeight: 'bold',
        }}
      >
        {children}
      </FormSubmitButton>
      <HomeButton
        iconName="home"
        color="white"
        size={24}
        onPress={onHomeReturn}
      />
    </AuthFormButtonsContainer>
  );
}
