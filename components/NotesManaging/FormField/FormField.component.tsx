//Types
import { ReactElement } from 'react';
import { TextInputProps } from 'react-native';

//React Native Elements
import { Input } from '@rneui/themed';

//Interface for Props
interface FormFieldProps extends TextInputProps {
  children: string;
  errorMessage?: string;
}

export default function FormField({
  children,
  errorMessage,
  ...props
}: FormFieldProps): ReactElement {
  return (
    <Input
      label={children}
      {...props}
      labelStyle={{ fontWeight: '400' }}
      errorStyle={{ fontSize: 15 }}
      errorMessage={errorMessage}
      containerStyle={{ marginVertical: 24 }}
    />
  );
}
