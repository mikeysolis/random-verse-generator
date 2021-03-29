import { IonSlide, IonSlides } from '@ionic/react';

import { IVerse } from '../pages/Home';

interface ScriptureSlidesProps {
  volumeId: string | undefined;
  verses: IVerse[];
}

const ScriptureSlides: React.FC<ScriptureSlidesProps> = ({
  volumeId,
  verses,
}) => {
  return (
    <>
      {volumeId ? (
        <IonSlides>
          {verses.map(verse => (
            <IonSlide key={verse.verseTitle}>
              <p>Verse Title: {verse.verseTitle}</p>
            </IonSlide>
          ))}
        </IonSlides>
      ) : (
        <p>Please select a volume of scripture.</p>
      )}
    </>
  );
};

export default ScriptureSlides;
