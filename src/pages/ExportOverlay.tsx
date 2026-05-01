import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
} from '@ionic/react';
import { useBoard } from '../data/BoardContext';
import { useMarkSuite } from '../data/MarkSuiteContext';
import { exportData, downloadJson } from '../util/export';

const ExportOverlay: React.FC = () => {
  const { boards } = useBoard();
  const { markSuites } = useMarkSuite();

  const handleExport = async () => {
    const appState = {
      boards,
      markSuites,
      currentBoardId: null,
    };
    const data = exportData(appState);
    await downloadJson(data);
  };

  const totalMarks = boards.reduce(
    (sum, board) => sum + Object.keys(board.marks).length,
    0
  );

  const customSuites = markSuites.filter(s => !s.isBuiltIn && !s.isDynamic);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Export Data</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p className="overlay__text">
          Export all your boards, marks, and custom mark suites to a JSON file. This file can
          be imported later to restore your data.
        </p>

        <IonList>
          <IonItem>
            <IonLabel>Boards</IonLabel>
            <IonNote slot="end">{boards.length}</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>Total Marks</IonLabel>
            <IonNote slot="end">{totalMarks}</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>Custom Suites</IonLabel>
            <IonNote slot="end">{customSuites.length}</IonNote>
          </IonItem>
        </IonList>

        <IonButton expand="block" onClick={handleExport} className="ion-margin-top">
          Export
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ExportOverlay;
