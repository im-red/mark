import React, { useState, useRef } from 'react';
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
    IonAlert,
} from '@ionic/react';
import { useBoard } from '../data/BoardContext';
import { useMarkSuite } from '../data/MarkSuiteContext';
import { parseImportFile, mergeImportedBoards, mergeImportedSuites } from '../util/import';
import { Board, MarkSuite } from '../models';

const ImportOverlay: React.FC = () => {
    const { boards, importBoards } = useBoard();
    const { markSuites, importSuites } = useMarkSuite();
    const [status, setStatus] = useState<'idle' | 'preview'>('idle');
    const [previewBoards, setPreviewBoards] = useState<Board[]>([]);
    const [previewSuites, setPreviewSuites] = useState<MarkSuite[]>([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const result = await parseImportFile(file);
        if (result.success && result.boards) {
            setPreviewBoards(result.boards);
            setPreviewSuites(result.markSuites || []);
            setStatus('preview');
        } else {
            setAlertMessage('Import failed: ' + (result.error || 'Unknown error'));
            setShowAlert(true);
        }
    };

    const handleImport = () => {
        try {
            const newBoards = mergeImportedBoards(boards, previewBoards);
            importBoards(newBoards);

            if (previewSuites.length > 0) {
                const newSuites = mergeImportedSuites(markSuites, previewSuites);
                importSuites(newSuites);
            }

            setAlertMessage('Import successful!');
            setShowAlert(true);
            setStatus('idle');
        } catch {
            setAlertMessage('Failed to import data. Please try again.');
            setShowAlert(true);
        }
    };

    const handleReset = () => {
        setStatus('idle');
        setPreviewBoards([]);
        setPreviewSuites([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const totalMarks = previewBoards.reduce(
        (sum, board) => sum + Object.keys(board.marks).length,
        0
    );

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/" />
                    </IonButtons>
                    <IonTitle>Import Data</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {status === 'idle' && (
                    <>
                        <p className="overlay__text">
                            Import boards, marks, and custom mark suites from a previously exported JSON file.
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json,application/json"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                        <IonButton expand="block" onClick={() => fileInputRef.current?.click()}>
                            Select File
                        </IonButton>
                    </>
                )}

                {status === 'preview' && (
                    <>
                        <p className="overlay__text">Ready to import:</p>
                        <IonList>
                            <IonItem>
                                <IonLabel>Boards</IonLabel>
                                <IonNote slot="end">{previewBoards.length}</IonNote>
                            </IonItem>
                            <IonItem>
                                <IonLabel>Total Marks</IonLabel>
                                <IonNote slot="end">{totalMarks}</IonNote>
                            </IonItem>
                            {previewSuites.length > 0 && (
                                <IonItem>
                                    <IonLabel>Custom Suites</IonLabel>
                                    <IonNote slot="end">{previewSuites.length}</IonNote>
                                </IonItem>
                            )}
                        </IonList>
                        <IonButton expand="block" onClick={handleImport} className="ion-margin-top">
                            Import
                        </IonButton>
                        <IonButton expand="block" fill="outline" onClick={handleReset}>
                            Cancel
                        </IonButton>
                    </>
                )}

                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header="Import"
                    message={alertMessage}
                    buttons={['OK']}
                />
            </IonContent>
        </IonPage>
    );
};

export default ImportOverlay;
