import React, { useState } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonButton,
    IonModal,
    IonInput,
    IonItem,
    IonList,
    IonLabel,
    IonIcon,
    IonAlert,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { MarkSuite, Mark } from '../models';
import { useMarkSuite } from '../data/MarkSuiteContext';

const PRESET_COLORS = [
    '#fecaca', '#fed7aa', '#d9f99d', '#a5f3fc', '#e9d5ff',
    '#fbcfe8', '#fde68a', '#a7f3d0', '#bfdbfe', '#c4b5fd',
];

const MarkManagementPage: React.FC = () => {
    const { suites, createSuite, updateSuite, deleteSuite, createMark, updateMark, deleteMark } = useMarkSuite();
    const [selectedSuiteId, setSelectedSuiteId] = useState<string | null>(null);
    const [showSuiteModal, setShowSuiteModal] = useState(false);
    const [showMarkModal, setShowMarkModal] = useState(false);
    const [editingSuite, setEditingSuite] = useState<MarkSuite | null>(null);
    const [editingMark, setEditingMark] = useState<Mark | null>(null);
    const [suiteName, setSuiteName] = useState('');
    const [markEmojis, setMarkEmojis] = useState('');
    const [markColor, setMarkColor] = useState('#fecaca');
    const [markName, setMarkName] = useState('');
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ type: 'suite' | 'mark'; id: string; suiteId?: string } | null>(null);

    const manageSuites = suites.filter(s => !s.isDynamic);
    const selectedSuite = suites.find(s => s.id === selectedSuiteId);

    const handleCreateSuite = () => {
        if (suiteName.trim()) {
            createSuite(suiteName.trim());
            setSuiteName('');
            setShowSuiteModal(false);
        }
    };

    const handleUpdateSuite = () => {
        if (editingSuite && suiteName.trim()) {
            updateSuite(editingSuite.id, suiteName.trim());
            setSuiteName('');
            setEditingSuite(null);
            setShowSuiteModal(false);
        }
    };

    const handleDeleteConfirm = () => {
        if (!deleteTarget) return;
        if (deleteTarget.type === 'suite') {
            deleteSuite(deleteTarget.id);
            if (selectedSuiteId === deleteTarget.id) {
                setSelectedSuiteId(null);
            }
        } else if (deleteTarget.suiteId) {
            deleteMark(deleteTarget.suiteId, deleteTarget.id);
            setEditingSuite(null);
        }
        setDeleteTarget(null);
        setShowDeleteAlert(false);
    };

    const handleCreateMark = () => {
        if (selectedSuiteId && markEmojis.trim()) {
            createMark(selectedSuiteId, {
                emojis: markEmojis.trim().split(''),
                backgroundColor: markColor,
                name: markName.trim() || undefined,
            });
            setMarkEmojis('');
            setMarkColor('#f5f5f4');
            setMarkName('');
            setShowMarkModal(false);
        }
    };

    const handleUpdateMark = () => {
        if (editingSuite && editingMark && markEmojis.trim()) {
            updateMark(editingSuite.id, editingMark.id, {
                emojis: markEmojis.trim().split(''),
                backgroundColor: markColor,
                name: markName.trim() || undefined,
            });
            setMarkEmojis('');
            setMarkColor('#f5f5f4');
            setMarkName('');
            setEditingMark(null);
            setEditingSuite(null);
            setShowMarkModal(false);
        }
    };

    const openEditSuite = (suite: MarkSuite) => {
        setEditingSuite(suite);
        setSuiteName(suite.name);
        setShowSuiteModal(true);
    };

    const openEditMark = (suite: MarkSuite, mark: Mark) => {
        setEditingSuite(suite);
        setEditingMark(mark);
        setMarkEmojis(mark.emojis.join(''));
        setMarkColor(mark.backgroundColor);
        setMarkName(mark.name || '');
        setShowMarkModal(true);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/" />
                    </IonButtons>
                    <IonTitle>Manage Marks</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => {
                            setEditingSuite(null);
                            setSuiteName('');
                            setShowSuiteModal(true);
                        }}>
                            <IonIcon icon={add} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="ion-padding">
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Manage Marks</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <div className="suite-list">
                    <h2 className="section-title">Suites</h2>
                    <IonList>
                        {manageSuites.map(suite => (
                            <IonItem
                                key={suite.id}
                                button
                                detail
                                onClick={() => setSelectedSuiteId(suite.id)}
                                className={selectedSuiteId === suite.id ? 'suite-item--selected' : ''}
                            >
                                <IonLabel>
                                    <h2>{suite.name}</h2>
                                    <p>{suite.marks.length} marks</p>
                                </IonLabel>
                                {!suite.isBuiltIn && !suite.isDynamic && (
                                    <>
                                        <IonButton slot="end" fill="clear" size="small" onClick={(e) => {
                                            e.stopPropagation();
                                            openEditSuite(suite);
                                        }}>
                                            Edit
                                        </IonButton>
                                        <IonButton slot="end" fill="clear" color="danger" size="small" onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteTarget({ type: 'suite', id: suite.id });
                                            setShowDeleteAlert(true);
                                        }}>
                                            Delete
                                        </IonButton>
                                    </>
                                )}
                            </IonItem>
                        ))}
                    </IonList>
                </div>

                {selectedSuite && (
                    <div className="mark-list">
                        <div className="mark-list__header">
                            <h2 className="section-title">{selectedSuite.name}</h2>
                            {!selectedSuite.isBuiltIn && !selectedSuite.isDynamic && (
                                <IonButton size="small" onClick={() => {
                                    setEditingMark(null);
                                    setMarkEmojis('');
                                    setMarkColor('#e0e0e0');
                                    setMarkName('');
                                    setShowMarkModal(true);
                                }}>
                                    + Add Mark
                                </IonButton>
                            )}
                        </div>

                        {selectedSuite.isDynamic && (
                            <p className="mark-list__hint">
                                Recent marks are automatically added when you use marks on the calendar.
                            </p>
                        )}

                        <div className="mark-grid">
                            {selectedSuite.marks.map(mark => (
                                <div
                                    key={mark.id}
                                    className="mark-item"
                                    style={{ backgroundColor: mark.backgroundColor }}
                                    onClick={() => {
                                        if (!selectedSuite.isBuiltIn && !selectedSuite.isDynamic) {
                                            openEditMark(selectedSuite, mark);
                                        }
                                    }}
                                >
                                    <span className="mark-item__emojis">{mark.emojis.join('')}</span>
                                    {mark.name && <span className="mark-item__name">{mark.name}</span>}
                                </div>
                            ))}
                            {selectedSuite.marks.length === 0 && (
                                <p className="mark-list__empty">No marks in this suite</p>
                            )}
                        </div>
                    </div>
                )}
            </IonContent>

            <IonModal isOpen={showSuiteModal} onDidDismiss={() => setShowSuiteModal(false)}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>{editingSuite ? 'Edit Suite' : 'New Suite'}</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setShowSuiteModal(false)}>Cancel</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonList>
                        <IonItem>
                            <IonInput
                                label="Suite name"
                                labelPlacement="stacked"
                                placeholder="Enter suite name"
                                value={suiteName}
                                onIonInput={(e) => setSuiteName(e.detail.value ?? '')}
                                autofocus
                            />
                        </IonItem>
                    </IonList>
                    <IonButton
                        expand="block"
                        onClick={editingSuite ? handleUpdateSuite : handleCreateSuite}
                        disabled={!suiteName.trim()}
                    >
                        {editingSuite ? 'Save' : 'Create'}
                    </IonButton>
                </IonContent>
            </IonModal>

            <IonModal isOpen={showMarkModal} onDidDismiss={() => setShowMarkModal(false)}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>{editingMark ? 'Edit Mark' : 'New Mark'}</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setShowMarkModal(false)}>Cancel</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonList>
                        <IonItem>
                            <IonInput
                                label="Emojis"
                                labelPlacement="stacked"
                                placeholder="Enter emoji(s)"
                                value={markEmojis}
                                onIonInput={(e) => setMarkEmojis(e.detail.value ?? '')}
                                autofocus
                            />
                        </IonItem>
                        <IonItem>
                            <IonInput
                                label="Name (optional)"
                                labelPlacement="stacked"
                                placeholder="Mark name"
                                value={markName}
                                onIonInput={(e) => setMarkName(e.detail.value ?? '')}
                            />
                        </IonItem>
                    </IonList>

                    <IonLabel className="input-label">Background Color</IonLabel>
                    <div className="color-picker">
                        {PRESET_COLORS.map(color => (
                            <button
                                key={color}
                                className={`color-picker__item ${markColor === color ? 'color-picker__item--selected' : ''}`}
                                style={{ backgroundColor: color }}
                                onClick={() => setMarkColor(color)}
                            />
                        ))}
                    </div>

                    <div className="mark-preview">
                        <span>Preview:</span>
                        <div
                            className="mark-preview__item"
                            style={{ backgroundColor: markColor }}
                        >
                            {markEmojis || '?'}
                        </div>
                    </div>

                    {editingMark && (
                        <IonButton
                            expand="block"
                            fill="outline"
                            color="danger"
                            onClick={() => {
                                setDeleteTarget({ type: 'mark', id: editingMark.id, suiteId: editingSuite?.id });
                                setShowDeleteAlert(true);
                            }}
                        >
                            Delete Mark
                        </IonButton>
                    )}

                    <IonButton
                        expand="block"
                        onClick={editingMark ? handleUpdateMark : handleCreateMark}
                        disabled={!markEmojis.trim()}
                    >
                        {editingMark ? 'Save' : 'Create'}
                    </IonButton>
                </IonContent>
            </IonModal>

            <IonAlert
                isOpen={showDeleteAlert}
                onDidDismiss={() => setShowDeleteAlert(false)}
                header="Confirm Delete"
                message={`Are you sure you want to delete this ${deleteTarget?.type}?`}
                buttons={[
                    { text: 'Cancel', role: 'cancel' },
                    { text: 'Delete', role: 'destructive', handler: handleDeleteConfirm },
                ]}
            />
        </IonPage>
    );
};

export default MarkManagementPage;
