import React, { useState, useMemo } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonModal,
    IonInput,
    IonButton,
    IonList,
    IonItem,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useBoard } from '../data/BoardContext';
import { useMarkSuite } from '../data/MarkSuiteContext';
import BoardCard from '../components/BoardCard';
import './HomePage.scss';

const HomePage: React.FC = () => {
    const { boards, createBoard } = useBoard();
    const { getMark } = useMarkSuite();
    const history = useHistory();
    const [showNewBoardModal, setShowNewBoardModal] = useState(false);
    const [newBoardName, setNewBoardName] = useState('');

    const handleCreateBoard = () => {
        if (newBoardName.trim()) {
            const board = createBoard(newBoardName.trim());
            setNewBoardName('');
            setShowNewBoardModal(false);
            history.push(`/board/${board.id}`);
        }
    };

    const handleSelectBoard = (boardId: string) => {
        history.push(`/board/${boardId}`);
    };

    const sortedBoards = [...boards].sort((a, b) => b.updatedAt - a.updatedAt);

    const getRecentMarks = (recentMarkIds: string[]) => {
        return recentMarkIds
            .map(markId => getMark(markId))
            .filter((mark): mark is NonNullable<typeof mark> => mark !== undefined);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton menu="side-menu" />
                    </IonButtons>
                    <IonTitle>Mark</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="ion-padding">
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Mark</IonTitle>
                    </IonToolbar>
                </IonHeader>

                {boards.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state__icon">📅</div>
                        <h2 className="empty-state__title">No boards yet</h2>
                        <p className="empty-state__text">
                            Create your first board to start tracking your marks
                        </p>
                        <IonButton onClick={() => setShowNewBoardModal(true)}>
                            Create Board
                        </IonButton>
                    </div>
                ) : (
                    <div className="board-list">
                        {sortedBoards.map((board) => (
                            <BoardCard
                                key={board.id}
                                id={board.id}
                                name={board.name}
                                markCount={Object.keys(board.marks).length}
                                lastUpdated={board.updatedAt}
                                recentMarks={getRecentMarks(board.recentMarkIds)}
                                onClick={handleSelectBoard}
                            />
                        ))}
                    </div>
                )}

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => setShowNewBoardModal(true)}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
            </IonContent>

            <IonModal isOpen={showNewBoardModal} onDidDismiss={() => setShowNewBoardModal(false)}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>New Board</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setShowNewBoardModal(false)}>Cancel</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonList className="edge-to-edge">
                        <IonItem>
                            <IonInput
                                label="Board name"
                                labelPlacement="stacked"
                                placeholder="Enter board name"
                                value={newBoardName}
                                onIonInput={(e) => setNewBoardName(e.detail.value ?? '')}
                                autofocus
                            />
                        </IonItem>
                    </IonList>
                    <IonButton
                        expand="block"
                        onClick={handleCreateBoard}
                        disabled={!newBoardName.trim()}
                    >
                        Create
                    </IonButton>
                </IonContent>
            </IonModal>
        </IonPage>
    );
};

export default HomePage;
