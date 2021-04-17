import { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import { createStorage, get } from './lib/utils/ionicStorage';
import { useAppSelector, useAppDispatch } from './lib/store/hooks';
import { loadBookmarks, clearBookmarks } from './lib/store/bookmarksSlice';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import BookmarksMenu from './components/BookmarksMenu';
import AlertPopup from './components/AlertPopup';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/Global.css';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const bookmarkState = useAppSelector(state => state.bookmarks);
  const isServiceWorkerUpdated = useAppSelector(
    state => state.sw.serviceWorkerUpdated
  );
  const serviceWorkerRegistration = useAppSelector(
    state => state.sw.serviceWorkerRegistration
  );
  const [showSwAlert, setShowSwAlert] = useState<boolean>(false);
  const [showClearAlert, setShowClearAlert] = useState<boolean>(false);
  const [tutorialCompleted, setTutorialCompleted] = useState<boolean>(false);

  useEffect(() => {
    const setupStorage = async () => {
      await createStorage('GeneratorDB');
      const exists = await get('tutorialCompleted');

      if (exists) {
        setTutorialCompleted(true);
      }
    };
    setupStorage();
  }, []);

  useEffect(() => {
    dispatch(loadBookmarks());
  }, [dispatch]);

  useEffect(() => {
    if (isServiceWorkerUpdated) {
      setShowSwAlert(true);
    }
  }, [isServiceWorkerUpdated]);

  const updateServiceWorker = () => {
    const registrationWaiting = serviceWorkerRegistration!.waiting;
    if (registrationWaiting) {
      registrationWaiting.postMessage({ type: 'SKIP_WAITING' });
      registrationWaiting.addEventListener('statechange', (e: any) => {
        if (e.target.state === 'activated') {
          window.location.reload();
        }
      });
    }
  };

  const clearBookmarksHandler = () => {
    setShowClearAlert(true);
  };

  return (
    <IonApp>
      <AlertPopup
        showAlert={showSwAlert}
        setShowAlert={setShowSwAlert}
        actionHandler={updateServiceWorker}
        header="App Update Available"
        message="An updated version of this app is available.  Update now?"
      />
      <AlertPopup
        showAlert={showClearAlert}
        setShowAlert={setShowClearAlert}
        actionHandler={() => dispatch(clearBookmarks())}
        header="Confirm Delete"
        message="Click 'OK' to delete all of your Bookmarks."
      />
      <IonReactRouter>
        <BookmarksMenu
          bookmarkState={bookmarkState}
          clearBookmarksHandler={clearBookmarksHandler}
        />
        <IonRouterOutlet id="main">
          <Route
            exact
            path="/home"
            render={() => {
              return tutorialCompleted ? (
                <Home />
              ) : (
                <Onboarding completedTutorialHandler={setTutorialCompleted} />
              );
            }}
          />
          <Redirect exact from="/" to="/home" />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
