import { useState } from 'react';
import iconSvg from '../../resources/icon.svg';
import useAppVersion from '../hooks/useAppVersion';
import './AboutPage.scss';
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
    IonAlert,
} from '@ionic/react';
import { globe, documentText, refresh } from 'ionicons/icons';

const GITHUB_REPO_URL = 'https://github.com/im-red/mark';
const GITHUB_RELEASES_URL = 'https://github.com/im-red/mark/releases';

function compareVersions(a: string, b: string): number {
    const partsA = a.split('.').map(Number);
    const partsB = b.split('.').map(Number);
    const len = Math.max(partsA.length, partsB.length);
    for (let i = 0; i < len; i++) {
        const numA = partsA[i] || 0;
        const numB = partsB[i] || 0;
        if (numA > numB) return 1;
        if (numA < numB) return -1;
    }
    return 0;
}

function AboutPage() {
    const { versionName: currentVersion, fullString: versionString } = useAppVersion();
    const [checking, setChecking] = useState(false);
    const [updateAlert, setUpdateAlert] = useState<{
        show: boolean;
        hasUpdate: boolean;
        latestVersion: string;
        currentVersion: string;
    }>({ show: false, hasUpdate: false, latestVersion: '', currentVersion: '' });

    const handleViewWebsite = () => {
        window.open(GITHUB_REPO_URL, '_blank');
    };

    const handleCheckUpdate = async () => {
        setChecking(true);
        try {
            const response = await fetch('https://api.github.com/repos/im-red/mark/releases/latest');
            const data = await response.json();
            const latestVersion = data.tag_name?.replace(/^v/, '') || '';

            if (!latestVersion) {
                setUpdateAlert({
                    show: true,
                    hasUpdate: false,
                    latestVersion: '',
                    currentVersion,
                });
                return;
            }

            const hasUpdate = compareVersions(latestVersion, currentVersion) > 0;
            setUpdateAlert({
                show: true,
                hasUpdate,
                latestVersion,
                currentVersion,
            });
        } catch {
            setUpdateAlert({
                show: true,
                hasUpdate: false,
                latestVersion: '',
                currentVersion,
            });
        } finally {
            setChecking(false);
        }
    };

    const handleViewRelease = () => {
        window.open(GITHUB_RELEASES_URL, '_blank');
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
            <IonContent className="ion-text-center">
                <div className="about-app-info">
                    <img className="about-app-icon" src={iconSvg} alt="Mark" />
                    <div className="about-app-name">Mark</div>
                    <div className="about-app-version">{versionString}</div>
                </div>

                <IonList lines="full">
                    <IonItem button onClick={handleCheckUpdate} disabled={checking}>
                        <IonIcon icon={refresh} slot="start" />
                        <IonLabel>
                            <h2>{checking ? 'Checking...' : 'Check for Updates'}</h2>
                        </IonLabel>
                    </IonItem>
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

                <IonAlert
                    isOpen={updateAlert.show}
                    onDidDismiss={() => setUpdateAlert(prev => ({ ...prev, show: false }))}
                    header={updateAlert.hasUpdate ? 'New Version Available' : 'Up to Date'}
                    cssClass="update-alert"
                    message={updateAlert.hasUpdate
                        ? `Latest Version: v${updateAlert.latestVersion}\nCurrent Version: v${updateAlert.currentVersion}`
                        : `Current Version: v${updateAlert.currentVersion}`}
                    buttons={[
                        {
                            text: updateAlert.hasUpdate ? 'View Update' : 'View Releases',
                            handler: handleViewRelease,
                        },
                        'Close',
                    ]}
                />
            </IonContent>
        </IonPage>
    );
}

export default AboutPage;
