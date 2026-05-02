import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
} from '@ionic/react';
import { informationCircle } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

function SettingsPage() {
    const history = useHistory();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/" />
                    </IonButtons>
                    <IonTitle>Settings</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList lines="full">
                    <IonItem button onClick={() => history.push('/about')}>
                        <IonIcon icon={informationCircle} slot="start" />
                        <IonLabel>
                            <h2>About</h2>
                        </IonLabel>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonPage>
    );
}

export default SettingsPage;
