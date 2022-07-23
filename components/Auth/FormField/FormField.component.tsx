//Types
import { ReactElement } from 'react';

//Components
import { AuthInput } from '@components/Default/Input/Input.component';
import { AuthFormErrorText } from '@components/Default/Text/Text.component';

//React Native
import { Platform } from 'react-native';

//Interface for Props
interface FormFieldProps {
  children: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  error?: string;
}

export default function FormField({
  children,
  placeholder,
  onChangeText,
  error,
}: FormFieldProps): ReactElement {
  const formSelectionColor = {
    ...(Platform.OS === 'ios' && { selectionColor: 'black' }),
  };
  return (
    <>
      <AuthInput
        value={children}
        onChangeText={onChangeText}
        placeholder={placeholder}
        {...formSelectionColor}
      />
      {error && !children && <AuthFormErrorText>{error}</AuthFormErrorText>}
    </>
  );
}
