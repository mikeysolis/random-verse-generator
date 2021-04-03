import { useState, useRef } from 'react';
import { useLazyQuery } from '@apollo/client';
import {
  IonContent,
  IonPage,
  IonSlides,
  IonSlide,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/react';

import './Home.css';
import { GET_RANDOM_VERSES } from '../lib/apollo/queries';
import { useAppContext } from '../lib/state/State';
import { ActionType } from '../lib/state/reducer';
import SkeletonVerse from '../components/SkeletonVerse';

const Home: React.FC = () => {
  const { state, dispatch } = useAppContext();
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
      dispatch({
        type: ActionType.ADD_VERSES,
        payload: {
          verses: data.get_random_verses,
          // sliderIndex,
        },
      });

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

  const onIonSlideDidChangeHandler = async () => {
    const sliderCurrentIndex = await sliderRef.current?.getActiveIndex();

    if (sliderCurrentIndex !== undefined) setSliderIndex(sliderCurrentIndex);
  };

  const onIonSlideReachEndHandler = () => {
    fetchVerses();
  };

  if (loading) {
    return (
      <HomeLayout setVolumeId={setVolumeId}>
        <div className="container">
          <SkeletonVerse />
        </div>
      </HomeLayout>
    );
  }

  if (!volumeId) {
    return (
      <HomeLayout setVolumeId={setVolumeId}>
        <div className="container">
          <p>Please select a volume of scripture.</p>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout setVolumeId={setVolumeId}>
      <div className="container">
        <IonSlides
          ref={sliderRef}
          onIonSlideDidChange={onIonSlideDidChangeHandler}
          onIonSlideReachEnd={onIonSlideReachEndHandler}
          className="ion-slides-home"
        >
          {state.verses.map(verse => (
            <IonSlide key={verse.verseTitle}>
              <figure className="verse">
                <blockquote>{verse.scriptureText}</blockquote>
                <figcaption className="verse-title">
                  {verse.verseTitle}
                </figcaption>
              </figure>
            </IonSlide>
          ))}
          <IonSlide key={'empty verse'}>
            <SkeletonVerse />
          </IonSlide>
        </IonSlides>
      </div>
    </HomeLayout>
  );
};

interface VolumeSegmentProps {
  changeHandler: (e: any) => void;
}

const VolumeSegment: React.FC<VolumeSegmentProps> = ({ changeHandler }) => {
  const onIonChangeHandler = (e: any) => {
    changeHandler(e);
  };

  return (
    <IonSegment
      onIonChange={onIonChangeHandler}
      scrollable={true}
      swipeGesture={false}
      color="secondary"
    >
      <IonSegmentButton value="1">
        <IonLabel>OT</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="2">
        <IonLabel>NT</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="3">
        <IonLabel>BM</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="4">
        <IonLabel>DC</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="5">
        <IonLabel>PGP</IonLabel>
      </IonSegmentButton>
    </IonSegment>
  );
};

interface HomeLayoutProps {
  setVolumeId: (e: any) => void;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ setVolumeId, children }) => {
  const onIonSegmentChangeHandler = (e: any) => {
    setVolumeId(e.detail.value);
  };

  return (
    <IonPage>
      <IonContent color="primary">{children}</IonContent>
      <VolumeSegment changeHandler={onIonSegmentChangeHandler} />
    </IonPage>
  );
};

export default Home;
