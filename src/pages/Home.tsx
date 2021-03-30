import { useState, useRef } from 'react';
import { useLazyQuery } from '@apollo/client';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSpinner,
  IonSlides,
  IonSlide,
  IonButton,
} from '@ionic/react';

import './Home.css';
import { GET_RANDOM_VERSES } from '../lib/queries';
import { useContext } from '../lib/context';
import { set } from '../lib/ionicStorage';
import VolumeSegment from '../components/VolumeSegment';

const Home: React.FC = () => {
  const { verses, updateVerses, setTutorialCompleted } = useContext();
  const [volumeId, setVolumeId] = useState<string | undefined>('');
  const [sliderIndex, setSliderIndex] = useState<number>(0);
  const [isFirstFetch, setIsFirstFetch] = useState(true);
  const sliderRef = useRef<HTMLIonSlidesElement | null>(null);

  const [fetchVerses, { loading }] = useLazyQuery(GET_RANDOM_VERSES, {
    variables: {
      limit: 5,
      volumeId,
    },
    onCompleted: async data => {
      updateVerses(data.get_random_verses, sliderIndex);

      if (isFirstFetch) {
        sliderRef.current?.slideTo(sliderIndex, 0);
      } else {
        sliderRef.current?.slideTo(sliderIndex + 1, 0);
      }

      setIsFirstFetch(false);
    },
    onError: error => {
      console.log('error', error);
    },
    fetchPolicy: 'no-cache',
  });

  const onIonSegmentChangeHandler = (e: any) => {
    setVolumeId(e.detail.value);
    fetchVerses();
  };

  const onIonSlideDidChangeHandler = async () => {
    const sliderCurrentIndex = await sliderRef.current?.getActiveIndex();

    if (sliderCurrentIndex !== undefined) setSliderIndex(sliderCurrentIndex);
  };

  const onIonSlideReachEndHandler = () => {
    fetchVerses();
  };

  const onClickHandler = () => {
    setTutorialCompleted(true);
    set('tutorialCompleted', true);
  };

  if (!volumeId) {
    return (
      <HomeLayout>
        <VolumeSegment changeHandler={onIonSegmentChangeHandler} />
        <div className="container">
          <p>Please select a volume of scripture.</p>
          <IonButton onClick={onClickHandler}>My Button</IonButton>
        </div>
      </HomeLayout>
    );
  }

  if (loading) {
    return (
      <HomeLayout>
        <VolumeSegment changeHandler={onIonSegmentChangeHandler} />
        <div className="container">
          <IonSpinner />
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <VolumeSegment changeHandler={onIonSegmentChangeHandler} />
      <div className="container">
        <IonSlides
          ref={sliderRef}
          onIonSlideDidChange={onIonSlideDidChangeHandler}
          onIonSlideReachEnd={onIonSlideReachEndHandler}
        >
          {verses.map(verse => (
            <IonSlide key={verse.verseTitle}>
              <p>{verse.verseTitle}</p>
            </IonSlide>
          ))}
          <IonSlide key={'empty verse'}>
            <IonSpinner />
          </IonSlide>
        </IonSlides>
      </div>
    </HomeLayout>
  );
};

const HomeLayout: React.FC = ({ children }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Scripture Generator</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Scripture Generator</IonTitle>
          </IonToolbar>
        </IonHeader>
        {children}
      </IonContent>
    </IonPage>
  );
};

export default Home;
