import iconSvg from '../../resources/icon.svg';
import useAppVersion from '../hooks/useAppVersion';
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
import { globe, documentText } from 'ionicons/icons';

const GITHUB_REPO_URL = 'https://github.com/im-red/mark';

function AboutPage() {
    const { fullString: versionString } = useAppVersion();

    const handleViewWebsite = () => {
        window.open(GITHUB_REPO_URL, '_blank');
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/settings" />
                    </IonButtons>
                    <IonTitle>About</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-text-center ion-padding">
                <div className="about-app-info">
                    <img className="about-app-icon" src={iconSvg} alt="Mark" />
                    <div className="about-app-name">Mark</div>
                    <div className="about-app-version">{versionString}</div>
                </div>

                <IonList>
                    <IonItem button onClick={handleViewWebsite}>
                        <IonIcon icon={globe} slot="start" />
                        <IonLabel>
                            <h2>View Website</h2>
                            <p>GitHub Repository</p>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonIcon icon={documentText} slot="start" />
                        <IonLabel>
                            <h2>License</h2>
                            <p>MIT License</p>
                        </IonLabel>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonPage>
    );
}

export default AboutPage;
