import { useRef } from 'react';
import {
  IonContent,
  IonPage,
  IonButton,
  IonSlide,
  IonSlides,
} from '@ionic/react';

import './Onboarding.css';
import { set } from '../lib/ionicStorage';

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
      <IonContent className="ion-padding">
        <IonSlides ref={sliderRef} pager={true}>
          <IonSlide className="ion-padding">
            <img src="assets/slide1.png" alt="" />

            <div className="slider-text">
              <h2>Easy Exchange!</h2>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                ultricies, erat vitae porta consequat.
              </p>
            </div>

            <div className="navigator">
              <IonButton color="primary" fill="clear" onClick={skip}>
                SKIP
              </IonButton>
              <IonButton color="primary" fill="clear" onClick={next}>
                NEXT
              </IonButton>
            </div>
          </IonSlide>
          <IonSlide className="ion-padding">
            <img src="assets/slide2.png" alt="" />

            <div className="slider-text">
              <h2>Easy to Use!</h2>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                ultricies, erat vitae porta consequat.
              </p>
            </div>

            <div className="navigator">
              <IonButton color="primary" fill="clear" onClick={skip}>
                SKIP
              </IonButton>
              <IonButton color="primary" fill="clear" onClick={next}>
                NEXT
              </IonButton>
            </div>
          </IonSlide>
          <IonSlide className="ion-padding">
            <img src="assets/slide3.png" alt="" />

            <div className="slider-text">
              <h2>Connect with Others</h2>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                ultricies, erat vitae porta consequat.
              </p>
            </div>

            <IonButton onClick={skip} color="primary">
              GET STARTED
            </IonButton>
          </IonSlide>
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};

export default Onboarding;
