import { useRef } from 'react';
import {
  IonContent,
  IonPage,
  IonButton,
  IonSlide,
  IonSlides,
  IonIcon,
} from '@ionic/react';
import { book, bookmark } from 'ionicons/icons';

import './Onboarding.css';
import { set } from '../lib/utils/ionicStorage';

interface OnboardingProps {
  completedTutorialHandler: (e: boolean) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({
  completedTutorialHandler,
}) => {
  const sliderRef = useRef<HTMLIonSlidesElement | null>(null);

  const next = () => {
    sliderRef.current?.slideNext();
  };

  const skip = () => {
    completedTutorialHandler(true);
    set('tutorialCompleted', true);
  };

  return (
    <IonPage>
      <IonContent>
        <IonSlides
          ref={sliderRef}
          pager={true}
          className="ion-slides-onboarding"
        >
          <IonSlide className="ion-padding swiper-slide-onboarding">
            <img height="100%" width="100%" src="assets/slide1.svg" alt="" />

            <div className="slider-text">
              <h2>Hello & Welcome!</h2>

              <p>To get started tap NEXT or swipe left.</p>
            </div>

            <div className="navigator">
              <IonButton color="dark" fill="clear" onClick={skip}>
                SKIP
              </IonButton>
              <IonButton color="dark" fill="clear" onClick={next}>
                NEXT
              </IonButton>
            </div>
          </IonSlide>
          <IonSlide className="ion-padding swiper-slide-onboarding">
            <img height="100%" width="100%" src="assets/slide2.svg" alt="" />

            <div className="slider-text">
              <h2>Select a Volume</h2>

              <p>
                After finishing the tutorial you will see a button menu at the
                top of the screen. Simply tap a button to generate random verses
                from that volume of scripture.
              </p>
            </div>

            <div className="navigator">
              <IonButton color="dark" fill="clear" onClick={skip}>
                SKIP
              </IonButton>
              <IonButton color="dark" fill="clear" onClick={next}>
                NEXT
              </IonButton>
            </div>
          </IonSlide>
          <IonSlide className="ion-padding swiper-slide-onboarding">
            <img height="100%" width="100%" src="assets/slide3.svg" alt="" />

            <div className="slider-text">
              <h2>Swipe Is Your Friend</h2>

              <p>Swipe up and down to view new and previous verses.</p>
            </div>

            <div className="navigator">
              <IonButton color="dark" fill="clear" onClick={skip}>
                SKIP
              </IonButton>
              <IonButton color="dark" fill="clear" onClick={next}>
                NEXT
              </IonButton>
            </div>
          </IonSlide>
          <IonSlide className="ion-padding swiper-slide-onboarding">
            <img height="100%" width="100%" src="assets/slide2.svg" alt="" />

            <div className="slider-text">
              <h2>Change the Volume</h2>

              <p>
                Change the volume anytime by tapping a different button from the
                menu.
              </p>
            </div>

            <div className="navigator">
              <IonButton color="dark" fill="clear" onClick={skip}>
                SKIP
              </IonButton>
              <IonButton color="dark" fill="clear" onClick={next}>
                NEXT
              </IonButton>
            </div>
          </IonSlide>
          <IonSlide className="ion-padding swiper-slide-onboarding">
            <img height="100%" width="100%" src="assets/slide5.svg" alt="" />

            <div className="slider-text">
              <h2>Save Bookmarks</h2>

              <p>
                Each verse has an bookmark button{' '}
                <IonIcon size="small" icon={bookmark} /> Tap it to save the
                verse as a Bookmark. View your saved bookmarks by swiping from
                the left side of the screen.
              </p>
            </div>

            <div className="navigator">
              <IonButton color="dark" fill="clear" onClick={skip}>
                SKIP
              </IonButton>
              <IonButton color="dark" fill="clear" onClick={next}>
                NEXT
              </IonButton>
            </div>
          </IonSlide>
          <IonSlide className="ion-padding swiper-slide-onboarding">
            <img height="100%" width="100%" src="assets/slide4.svg" alt="" />

            <div className="slider-text ion-padding-bottom">
              <h2>It's that Simple!</h2>

              <p>Enjoy your time studying the scriptures!</p>
            </div>

            <IonButton onClick={skip} color="dark">
              GET STARTED
            </IonButton>
          </IonSlide>
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};

export default Onboarding;
