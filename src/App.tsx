import { useEffect, useState } from 'react';
import { Redirect, Route, useHistory } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/react';
import { book, heart, person } from 'ionicons/icons';
import { IonReactRouter } from '@ionic/react-router';

import { createStorage, get } from './lib/utils/ionicStorage';
import { useAppSelector, useAppDispatch } from './lib/store/hooks';
import { loadBookmarks, clearBookmarks } from './lib/store/bookmarksSlice';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import Favorites from './pages/Favorites';
import Dashboard from './pages/Dashboard';
import { CheckoutSuccess, CheckoutFailed } from './components/Checkout';
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

  // Setup state for checking is app has been updated via
  // the service worker.
  const isServiceWorkerUpdated = useAppSelector(
    state => state.sw.serviceWorkerUpdated
  );
  const serviceWorkerRegistration = useAppSelector(
    state => state.sw.serviceWorkerRegistration
  );

  // Setup state for alerts in regards app updates and confirmating
  // deletion of bookmarks.
  const [showSwAlert, setShowSwAlert] = useState<boolean>(false);
  const [showClearAlert, setShowClearAlert] = useState<boolean>(false);

  // State to help determine is the onboarding tutorial has been completed.
  const [tutorialCompleted, setTutorialCompleted] = useState<boolean>(false);

  // On initialization check storage to determine if onboarding
  // has already been completed.
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

  // Load and update the user's bookmarks as needed.
  useEffect(() => {
    dispatch(loadBookmarks());
  }, [dispatch]);

  // If an app udated is detected show an alert to the user.
  useEffect(() => {
    if (isServiceWorkerUpdated) {
      setShowSwAlert(true);
    }
  }, [isServiceWorkerUpdated]);

  /**
   * Function: run when the user views the service worker
   * alert and chooses to update immediately.
   */
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

  /**
   * Function: runs when user clicks to clear all their bookmarks.
   * Open an IonAlert.
   */
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
        {tutorialCompleted ? (
          <>
            <BookmarksMenu
              bookmarkState={bookmarkState}
              clearBookmarksHandler={clearBookmarksHandler}
            />
            <TabsRouterOutlet />
          </>
        ) : (
          <OnboardingRouterOutlet setTutorialCompleted={setTutorialCompleted} />
        )}
      </IonReactRouter>
    </IonApp>
  );
};

/**
 * Component: TabsRouterOutlet
 * If the user has completed the onboarding process this component
 * is displayed.
 */
const TabsRouterOutlet: React.FC = () => {
  // HACK: patch until ionic fixes a bug that causes swiping
  // the menu to affect router navigation.
  const history = useHistory();
  const handleTabClick: any = (href: any) => (ref: any) => {
    if (!ref) {
      return;
    }
    ref.handleIonTabButtonClick = () => {
      history.replace(href);
    };
  };

  return (
    <IonTabs>
      <IonRouterOutlet id="main">
        <Route exact path="/:tab(home)" component={Home} />
        <Route exact path="/:tab(favorites)" component={Favorites} />
        <Route exact path="/:tab(dashboard)" component={Dashboard} />
        <Route
          exact
          path="/:tab(dashboard)/success"
          component={CheckoutSuccess}
        />
        <Route
          exact
          path="/:tab(dashboard)/failed"
          component={CheckoutFailed}
        />
        <Redirect exact from="/" to="/home" />
      </IonRouterOutlet>
      <IonTabBar slot="bottom" color="primary">
        <IonTabButton tab="home" ref={handleTabClick('/home')} href="/home">
          <IonIcon icon={book} />
          <IonLabel>Verses</IonLabel>
        </IonTabButton>
        <IonTabButton
          tab="favorites"
          ref={handleTabClick('/favorites')}
          href="/favorites"
        >
          <IonIcon icon={heart} />
          <IonLabel>Favorites</IonLabel>
        </IonTabButton>
        <IonTabButton
          tab="dashboard"
          ref={handleTabClick('/dashboard')}
          href="/dashboard"
        >
          <IonIcon icon={person} />
          <IonLabel>Account</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

/**
 * Component: OnboardingRouterOutlet
 * If the onboarding has not been completed this component
 * is display instead of the main app.
 */
interface OnboardingRouterOutletProps {
  setTutorialCompleted: React.Dispatch<React.SetStateAction<boolean>>;
}

const OnboardingRouterOutlet: React.FC<OnboardingRouterOutletProps> = ({
  setTutorialCompleted,
}) => (
  <IonRouterOutlet>
    <Route
      exact
      path="/home"
      render={() => (
        <Onboarding completedTutorialHandler={setTutorialCompleted} />
      )}
    />
    <Redirect exact from="/" to="/home" />
  </IonRouterOutlet>
);

export default App;
