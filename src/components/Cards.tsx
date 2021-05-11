import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
} from '@ionic/react';

// Simple card component for display a title, message and optional button
interface CardProps {
  title: string;
  button?: React.ReactNode;
}

export const BasicCard: React.FC<CardProps> = ({ title, button, children }) => {
  return (
    <div className="container">
      <IonCard>
        <IonCardHeader>
          <IonCardSubtitle>{title}</IonCardSubtitle>
          <IonCardContent>{children}</IonCardContent>
        </IonCardHeader>
        {button && button}
      </IonCard>
    </div>
  );
};

// Little bit more complex card for display infor on the Dashboard and like places
export const PrettyCard: React.FC<CardProps> = ({
  title,
  button,
  children,
}) => {
  return (
    <IonCard className="ion-no-padding ion-padding-top ion-padding-start ion-padding-end">
      <IonCardSubtitle color="primary">{title}</IonCardSubtitle>
      <IonCardContent className="ion-no-padding ion-padding-top ion-padding-bottom">
        {children}
      </IonCardContent>
      {button && button}
    </IonCard>
  );
};
