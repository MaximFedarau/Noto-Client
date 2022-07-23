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
  forceShowingError?: boolean;
}

export default function FormField({
  children,
  placeholder,
  onChangeText,
  error,
  forceShowingError,
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
      {forceShowingError
        ? error && <AuthFormErrorText>{error}</AuthFormErrorText>
        : error && !children && <AuthFormErrorText>{error}</AuthFormErrorText>}
      {/* Statement above means, that is forceShowingError is true, then we check if error exists and then show this error.
      Else we show error only if error exists and input is not empty. */}
    </>
  );
}
