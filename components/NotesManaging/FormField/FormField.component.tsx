//Types
import { ReactElement } from 'react';
import { TextInputProps } from 'react-native';
import { IconNode } from '@rneui/base';

//React Native Elements
import { Input } from '@rneui/themed';

//Interface for Props
interface FormFieldProps extends TextInputProps {
  children?: string;
  errorMessage?: string;
  leftIcon?: IconNode;
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
      errorStyle={{ fontSize: 16 }}
      errorMessage={errorMessage}
      containerStyle={{
        marginBottom: 24,
      }}
      inputStyle={{
        fontSize: 20,
      }}
    />
  );
}
