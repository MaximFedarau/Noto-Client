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

export default function Drafts(): ReactElement {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [isError, setIsError] = React.useState<boolean>(false);
  const [drafts, setDrafts] = React.useState<DraftSchema[]>([]);

  React.useEffect(() => {
    fetchDrafts()
      .then((result) => {
        setDrafts(result);
        setIsError(false);
      })
      .catch((error) => {
        console.log(error, 'Drafts set up');
        setIsError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [drafts]);

  if (isError) return <Error />;
  if (loading)
    return (
      <DraftsView>
        <NoItemsText>Loading...</NoItemsText>
      </DraftsView>
    );

  return (
    <DraftsView>
      {drafts.length > 0 ? (
        <DraftsList>{drafts}</DraftsList>
      ) : (
        <NoItemsText>No drafts</NoItemsText>
      )}
    </DraftsView>
  );
}
