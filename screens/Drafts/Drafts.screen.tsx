//Types
import React, { ReactElement } from 'react';
import { DraftSchema } from '@app-types/types';

//Constants
import { fetchDrafts } from '@utils/db/drafts/fetch';

//Screens
import Error from '@screens/Error/Error.screen';

//Components
import DraftsList from '@components/Drafts/DraftsList/DraftsList.component';
import { DraftsView } from '@components/Default/View/View.component';
import { NoItemsText } from '@components/Default/Text/Text.component';

//React Native Elemets
import { LinearProgress } from '@rneui/base';

export default function Drafts(): ReactElement {
  const [loading, setLoading] = React.useState<boolean>(true);
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
    setLoading(false);
  }, [drafts]);

  if (isSetupError) return <Error />;
  if (loading)
    return (
      <DraftsView>
        <NoItemsText>Loading...</NoItemsText>
      </DraftsView>
    );

  return (
    <DraftsView>
      {drafts.length === 0 && <NoItemsText>No drafts</NoItemsText>}
      {drafts.length > 0 && <DraftsList>{drafts}</DraftsList>}
    </DraftsView>
  );
}
