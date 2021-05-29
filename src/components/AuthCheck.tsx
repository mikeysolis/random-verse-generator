import { IonText } from '@ionic/react';
import { useUserContext } from '../lib/user/context';

// The components children should only be shown to logged in users
interface AuthCheckProps {
  fallback: React.ReactNode;
}
const AuthCheck: React.FC<AuthCheckProps> = ({ fallback, children }) => {
  const { user } = useUserContext();

  return (
    <>
      {user ? children : fallback || <IonText>You must be logged in</IonText>}
    </>
  );
};

export default AuthCheck;
