import React, { ReactElement } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import Error from '@screens/Error/Error.screen';
import Loading from '@screens/Loading/Loading.screen';
import { NotesView } from '@components/Default/View/View.component';
import NotesList from '@components/Notes/NotesList/NotesList.component';
import { NoItemsText } from '@components/Default/Text/Text.component';
import { NoteSchema } from '@app-types/types';
import { createAPIInstance } from '@utils/requests/instance';
import {
  setIsAuth,
  setPublicData,
  publicDataInitialState,
} from '@store/publicData/publicData.slice';
import { publicDataAuthSelector } from '@store/publicData/publicData.selector';

export default function Notes(): ReactElement {
  const focus = useIsFocused();

  const dispatch = useDispatch();
  const isAuth = useSelector(publicDataAuthSelector);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isError, setIsError] = React.useState<boolean>(false);

  const [notes, setNotes] = React.useState<NoteSchema[]>([]);

  React.useEffect(() => {
    if (!focus) return;
    const instance = createAPIInstance(() => {
      setNotes([]);
      dispatch(setPublicData(publicDataInitialState));
      dispatch(setIsAuth(false));
      setIsLoading(false);
    });
    const fetchNotes = async () => {
      const res = await instance.get('/notes');
      if (res.data) setNotes(res.data);
    };
    if (isAuth) {
      fetchNotes()
        .then(() => {
          setIsError(false);
        })
        .catch((error) => {
          console.error(error, 'Notes setup');
          if (error.response.status != 401) setIsError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setNotes([]);
      setIsLoading(false);
    }
  }, [isAuth, focus]);

  // as authenthicated user always has a nickname, then when it is empty, we can say, that user is logged out

  if (isError) return <Error />;
  if (isLoading) return <Loading />;

  return (
    <NotesView>
      {notes.length ? (
        <NotesList>{notes}</NotesList>
      ) : (
        <NoItemsText>No Notes</NoItemsText>
      )}
    </NotesView>
  );
}
