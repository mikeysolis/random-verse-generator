import {
  IonMenu,
  IonContent,
  IonList,
  IonHeader,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/react';
import { bookmark } from 'ionicons/icons';

import './BookmarksMenu.css';
import { useAppDispatch } from '../lib/store/hooks';
import { updateBookmarks } from '../lib/store/bookmarksSlice';
import { Verse } from '../lib/store/types';
import VerseCard from '../components/VerseCard';

interface BookmarksMenuProps {
  bookmarkState: {
    data: Verse[];
    loading: string;
  };
  clearBookmarksHandler: () => void;
}

const BookmarksMenu: React.FC<BookmarksMenuProps> = ({
  bookmarkState,
  clearBookmarksHandler,
}) => {
  const dispatch = useAppDispatch();

  const onClearBookmarksClickHandler = () => {
    clearBookmarksHandler();
  };

  const onDeleteBookmarkHandler = (verse: Verse) => {
    dispatch(updateBookmarks(verse));
  };

  if (!bookmarkState.data || bookmarkState.data.length === 0) {
    return (
      <IonMenu menuId="bookmarks" contentId="main">
        <IonHeader>
          <IonButton
            disabled={true}
            className="clear-button"
            expand="full"
            color="tertiary"
          >
            No Bookmarks Found
          </IonButton>
        </IonHeader>
        <IonContent className="ion-padding">
          <div>
            Bookmarks are a great way to quickly keep track of interesting
            verses as you search. Tap on the bookmark icon and the verse will be
            saved here.
          </div>
          <div className="bookmark-icon-example">
            <IonIcon color="secondary" icon={bookmark} />
          </div>
        </IonContent>
      </IonMenu>
    );
  }

  if (bookmarkState.loading === 'failed') {
    return (
      <IonMenu menuId="bookmarks" contentId="main">
        <IonHeader>
          <IonButton
            disabled={true}
            className="clear-button"
            expand="full"
            color="danger"
          >
            Unable to load Bookmarks
          </IonButton>
        </IonHeader>
        <IonContent className="ion-padding">
          <div>
            Bookmarks weren't able to be loaded at this time. Please try again
            later.
          </div>
        </IonContent>
      </IonMenu>
    );
  }

  if (bookmarkState.loading === 'pending') {
    return (
      <IonMenu menuId="bookmarks" contentId="main">
        <IonHeader>
          <IonButton
            disabled={true}
            className="clear-button"
            expand="full"
            color="green"
          >
            Loading Bookmarks
          </IonButton>
        </IonHeader>
        <IonContent className="ion-padding">
          <p className="bookmarks-menu-spinner">
            <IonSpinner />
          </p>
        </IonContent>
      </IonMenu>
    );
  }

  return (
    <IonMenu menuId="bookmarks" contentId="main">
      <IonHeader>
        <IonButton
          onClick={onClearBookmarksClickHandler}
          className="clear-button"
          expand="full"
          color="danger"
        >
          Clear All Bookmarks
        </IonButton>
      </IonHeader>
      <IonContent>
        <IonList>
          {bookmarkState.data.map((bookmark, i) => (
            <VerseCard
              key={`${i}-${bookmark.verseId}`}
              verse={bookmark}
              isBookmarked={null}
              onBookmarkDeleteClickHandler={() =>
                onDeleteBookmarkHandler(bookmark)
              }
              isVerseForMenu={true}
            />
          ))}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default BookmarksMenu;
