//Types
import { ReactElement } from 'react';
import { TextInputProps } from 'react-native';

//Components
import { View, TextInput } from 'react-native';

export default function SearchBar(props: TextInputProps): ReactElement {
  return (
    <View
      style={{ width: '100%', minWidth: 240, height: 40, alignSelf: 'center' }}
    >
      <TextInput
        selectionColor="black"
        style={{
          backgroundColor: 'white',
          fontSize: 16,
          height: '100%',
          width: '100%',
          borderRadius: 10,
          padding: 8,
        }}
        {...props}
      />
    </View>
  );
}
