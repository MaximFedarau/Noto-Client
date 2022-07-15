//Types
import React, { ReactElement } from 'react';
import { DraftSchema } from '@app-types/types';

//Constants
import { fetchDrafts } from '@utils/db/drafts/fetch';

//Screens
import Error from '@screens/Error/Error.screen';

//React Native
import { View, Text, FlatList } from 'react-native';

//Componets
import { DraftsView } from '@components/Default/View/View.component';
import { NoItemsText } from '@components/Default/Text/Text.component';

export default function Drafts(): ReactElement {
  const [isSetupError, setIsSetupError] = React.useState<boolean>(false);
  const [drafts, setDrafts] = React.useState<DraftSchema[]>([]);

  React.useEffect(() => {
    fetchDrafts()
      .then((result) => {
        setDrafts(result);
        setIsSetupError(false);
      })
      .catch((error) => {
        console.log(error, 'Drafts set up');
        setIsSetupError(true);
      });
  }, [drafts]);

  if (isSetupError) return <Error />;

  return (
    <DraftsView>
      {drafts.length === 0 && <NoItemsText>No drafts</NoItemsText>}
      {drafts.length > 0 && (
        <FlatList
          data={drafts}
          keyExtractor={(item) => item.id}
          renderItem={(item) => (
            <View style={{ marginVertical: 16 }}>
              <Text>{item.item.id}</Text>
              <Text>{item.item.title}</Text>
              <Text>{item.item.content}</Text>
            </View>
          )}
        />
      )}
    </DraftsView>
  );
}
