import React, { ReactElement } from 'react';
import { TextInputProps, Platform } from 'react-native';
import { IconNode } from '@rneui/base';
import { Input } from '@rneui/themed';

//Interface for Props
interface FormFieldProps extends TextInputProps {
  children?: string;
  errorMessage?: string;
  leftIcon?: IconNode;
}

const FormField = React.memo(function FormField({
  children,
  errorMessage,
  ...props
}: FormFieldProps): ReactElement {
  return (
    <Input
      {...(Platform.OS === 'ios' && { selectionColor: 'black' })}
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
});

export default FormField;
