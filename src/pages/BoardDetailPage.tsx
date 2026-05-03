import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonButton,
    IonActionSheet,
    IonAlert,
    IonModal,
    IonInput,
    IonItem,
    IonList,
    IonIcon,
} from '@ionic/react';
import { ellipsisVertical, create, trash, image } from 'ionicons/icons';
import Calendar from '../components/Calendar';
import MarkSelector from '../components/MarkSelector';
import { Board, Mark } from '../models';
import { useMarkSuite } from '../data/MarkSuiteContext';
import { useBoard } from '../data/BoardContext';
import { exportViewAsImage } from '../util/exportImage';
import './BoardDetailPage.scss';

interface BoardDetailPageProps {
    match?: { params: { id: string } };
}

const BoardDetailPage: React.FC<BoardDetailPageProps> = ({ match }) => {
    const boardId = match?.params.id;
    const { boards, updateBoard, deleteBoard, updateRecentMarks } = useBoard();
    const { getMark } = useMarkSuite();
    const board = boards.find(b => b.id === boardId);

    const [showMarkSelector, setShowMarkSelector] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showActionSheet, setShowActionSheet] = useState(false);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [newName, setNewName] = useState('');
    const [calendarViewDate, setCalendarViewDate] = useState(() => {
        const now = new Date();
        return { year: now.getFullYear(), month: now.getMonth() };
    });
    const [calendarViewMode, setCalendarViewMode] = useState<'month' | 'year'>('month');
    const exportContentRef = useRef<HTMLDivElement>(null);

    const handleDateClick = (date: string) => {
        setSelectedDate(date);
        setShowMarkSelector(true);
    };

    const handleMarkSelect = (markId: string | null) => {
        if (board && selectedDate) {
            const newMarks = { ...board.marks };
            if (markId === null) {
                delete newMarks[selectedDate];
            } else {
                newMarks[selectedDate] = markId;
                updateRecentMarks(markId);
            }
            updateBoard(board.id, { marks: newMarks });
        }
    };

    const handleSaveComment = (comment: string | null) => {
        if (board && selectedDate) {
            const newComments = { ...board.comments };
            if (comment === null) {
                delete newComments[selectedDate];
            } else {
                newComments[selectedDate] = comment;
            }
            updateBoard(board.id, { comments: newComments });
        }
    };

    const handleCloseMarkSelector = () => {
        setShowMarkSelector(false);
        setSelectedDate(null);
    };

    const handleClearRecentMarks = () => {
        if (board) {
            updateBoard(board.id, { recentMarkIds: [] });
        }
    };

    const handleRename = () => {
        if (board && newName.trim()) {
            updateBoard(board.id, { name: newName.trim() });
            setShowRenameModal(false);
            setNewName('');
        }
    };

    const handleDelete = () => {
        if (board) {
            deleteBoard(board.id);
        }
    };

    const handleExportImage = async () => {
        setShowActionSheet(false);
        if (exportContentRef.current && board) {
            const viewLabel = calendarViewMode === 'year'
                ? `${calendarViewDate.year}`
                : `${calendarViewDate.year}${String(calendarViewDate.month + 1).padStart(2, '0')}`;
            try {
                await exportViewAsImage(exportContentRef.current, board.name, viewLabel);
            } catch (err) {
                console.error('[BoardDetailPage] Export image failed:', err);
            }
        }
    };

    const markStats = useMemo(() => {
        if (!board) return [];
        const counts: Record<string, number> = {};
        if (calendarViewMode === 'year') {
            const yearPrefix = `${calendarViewDate.year}-`;
            Object.entries(board.marks).forEach(([dateKey, markId]) => {
                if (dateKey.startsWith(yearPrefix)) {
                    counts[markId] = (counts[markId] || 0) + 1;
                }
            });
        } else {
            const monthPrefix = `${calendarViewDate.year}-${String(calendarViewDate.month + 1).padStart(2, '0')}`;
            Object.entries(board.marks).forEach(([dateKey, markId]) => {
                if (dateKey.startsWith(monthPrefix)) {
                    counts[markId] = (counts[markId] || 0) + 1;
                }
            });
        }
        const entries = Object.entries(counts)
            .map(([markId, count]) => {
                const mark = getMark(markId);
                return mark ? { mark, count } : null;
            })
            .filter((entry): entry is { mark: Mark; count: number } => entry !== null)
            .sort((a, b) => b.count - a.count);
        return entries;
    }, [board, getMark, calendarViewDate, calendarViewMode]);

    const handleViewDateChange = useCallback((year: number, month: number, viewMode: 'month' | 'year') => {
        setCalendarViewDate({ year, month });
        setCalendarViewMode(viewMode);
    }, []);

    const maxCount = markStats.length > 0 ? markStats[0].count : 0;

    if (!board) {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/" />
                        </IonButtons>
                        <IonTitle>Board Not Found</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <p>This board no longer exists.</p>
                </IonContent>
            </IonPage>
        );
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/" />
                    </IonButtons>
                    <IonTitle>{board.name}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => setShowActionSheet(true)}>
                            <IonIcon icon={ellipsisVertical} style={{ fontSize: '24px' }} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="ion-padding">
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">{board.name}</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <div className="export-capture-area" ref={exportContentRef}>
                    <div className="export-capture-area__header">
                        <div className="export-capture-area__title">{board.name}</div>
                        <div className="export-capture-area__subtitle">
                            {calendarViewMode === 'year'
                                ? `${calendarViewDate.year}`
                                : `${calendarViewDate.year}-${String(calendarViewDate.month + 1).padStart(2, '0')}`}
                        </div>
                    </div>
                    <Calendar
                        markIds={board.marks}
                        comments={board.comments}
                        getMarkById={getMark}
                        onDateClick={handleDateClick}
                        onViewDateChange={handleViewDateChange}
                    />

                    {markStats.length > 0 && (
                        <div className="mark-stats">
                            <div className="mark-stats__title">Statistics</div>
                            {markStats.map(({ mark, count }) => (
                                <div className="mark-stats__item" key={mark.id}>
                                    <span className="mark-stats__emoji">{mark.emojis.join('')}</span>
                                    <div className="mark-stats__bar-wrapper">
                                        <div
                                            className="mark-stats__bar"
                                            style={{
                                                width: `${(count / maxCount) * 100}%`,
                                                backgroundColor: mark.backgroundColor,
                                            }}
                                        />
                                    </div>
                                    <span className="mark-stats__count">{count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </IonContent>

            <MarkSelector
                isOpen={showMarkSelector}
                selectedMarkId={selectedDate ? board.marks[selectedDate] || null : null}
                recentMarkIds={board.recentMarkIds}
                selectedDate={selectedDate}
                existingComment={selectedDate ? board.comments[selectedDate] || null : null}
                onSelect={handleMarkSelect}
                onSaveComment={handleSaveComment}
                onClearRecentMarks={handleClearRecentMarks}
                onClose={handleCloseMarkSelector}
            />

            <IonActionSheet
                isOpen={showActionSheet}
                onDidDismiss={() => setShowActionSheet(false)}
                buttons={[
                    {
                        text: 'Rename',
                        handler: () => {
                            setNewName(board.name);
                            setShowRenameModal(true);
                        },
                    },
                    {
                        text: 'Export as Image',
                        handler: handleExportImage,
                    },
                    {
                        text: 'Delete',
                        role: 'destructive',
                        handler: () => {
                            setShowDeleteAlert(true);
                        },
                    },
                    {
                        text: 'Cancel',
                        role: 'cancel',
                    },
                ]}
            />

            <IonModal isOpen={showRenameModal} onDidDismiss={() => setShowRenameModal(false)}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Rename Board</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setShowRenameModal(false)}>Cancel</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonList>
                        <IonItem>
                            <IonInput
                                label="Board name"
                                labelPlacement="stacked"
                                placeholder="Enter board name"
                                value={newName}
                                onIonInput={(e) => setNewName(e.detail.value ?? '')}
                                autofocus
                            />
                        </IonItem>
                    </IonList>
                    <IonButton
                        expand="block"
                        onClick={handleRename}
                        disabled={!newName.trim()}
                    >
                        Rename
                    </IonButton>
                </IonContent>
            </IonModal>

            <IonAlert
                isOpen={showDeleteAlert}
                onDidDismiss={() => setShowDeleteAlert(false)}
                header="Delete Board?"
                message={`Are you sure you want to delete "${board.name}"? This action cannot be undone.`}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                    },
                    {
                        text: 'Delete',
                        role: 'destructive',
                        handler: handleDelete,
                    },
                ]}
            />
        </IonPage>
    );
};

export default BoardDetailPage;
