/**
 * Component: BookmarksMenu
 * The side menu that is available via swiping from the left.
 * The menu displays the users current bookmarks and enables
 * deleting an individual bookmark or all bookmars.
 */

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
import { Verse } from '../lib/types';
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

  /**
   * Function: onClearBookmarksClickHandler
   * Allows user to delete a single bookmark. Passed down
   * as a prop.
   */
  const onClearBookmarksClickHandler = () => {
    clearBookmarksHandler();
  };

  /**
   * Function: onDeleteBookmarkHandler
   * Allows deletion of all the user's bookmarks in one
   * go.
   */
  const onDeleteBookmarkHandler = (verse: Verse) => {
    dispatch(updateBookmarks(verse));
  };

  const onFavoriteClickHandler = (verse: Verse) => {
    // all the codes go here
  };

  // Render if no bookmarks are set.
  if (!bookmarkState.data || bookmarkState.data.length === 0) {
    return (
      <IonMenuContainer>
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
      </IonMenuContainer>
    );
  }

  // Render if bookmarks fail to load.
  if (bookmarkState.loading === 'failed') {
    return (
      <IonMenuContainer>
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
      </IonMenuContainer>
    );
  }

  // Render if bookmarks are loading. This is likely unneccessary
  // as bookmarks don't load asyncronously.
  if (bookmarkState.loading === 'pending') {
    return (
      <IonMenuContainer>
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
      </IonMenuContainer>
    );
  }

  // Render if there are booksmarks and there are no errors.
  return (
    <IonMenuContainer>
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
      <IonContent className="menu">
        <IonList>
          {bookmarkState.data.map((bookmark, i) => (
            <VerseCard
              key={`${i}-${bookmark.verseId}`}
              verse={bookmark}
              isBookmarked={null}
              onBookmarkDeleteClickHandler={() =>
                onDeleteBookmarkHandler(bookmark)
              }
              onFavoriteClickHandler={() => onFavoriteClickHandler(bookmark)}
              isVerseForMenu={true}
            />
          ))}
        </IonList>
      </IonContent>
    </IonMenuContainer>
  );
};

/**
 * Component: IonMenuContainer
 * Simple component to help keep down clutter above
 */
const IonMenuContainer: React.FC = ({ children }) => (
  <IonMenu menuId="bookmarks" contentId="main">
    {children}
  </IonMenu>
);

export default BookmarksMenu;
