import React from 'react';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonMenuToggle,
  IonFooter,
} from '@ionic/react';
import { colorPalette, cloudUpload, cloudDownload, settings } from 'ionicons/icons';
import useAppVersion from '../hooks/useAppVersion';

const SideMenu: React.FC = () => {
  const versionInfo = useAppVersion();

  return (
    <IonMenu contentId="main" menuId="side-menu" side="start">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList lines="full">
          <IonMenuToggle autoHide={false}>
            <IonItem button routerLink="/mark-management" routerDirection="none">
              <IonIcon icon={colorPalette} slot="start" />
              <IonLabel>Manage Marks</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle autoHide={false}>
            <IonItem button routerLink="/export" routerDirection="none">
              <IonIcon icon={cloudUpload} slot="start" />
              <IonLabel>Export Data</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle autoHide={false}>
            <IonItem button routerLink="/import" routerDirection="none">
              <IonIcon icon={cloudDownload} slot="start" />
              <IonLabel>Import Data</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle autoHide={false}>
            <IonItem button routerLink="/settings" routerDirection="none">
              <IonIcon icon={settings} slot="start" />
              <IonLabel>Settings</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonTitle size="small" className="ion-text-center">{versionInfo.fullString}</IonTitle>
        </IonToolbar>
      </IonFooter>
    </IonMenu>
  );
};

export default SideMenu;
