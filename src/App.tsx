import React, { useState, useEffect, useRef } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { BoardProvider, useBoard } from './context/BoardContext';
import { MarkSuiteProvider } from './context/MarkSuiteContext';
import HomePage from './components/HomePage';
import BoardDetailPage from './components/BoardDetailPage';
import SideMenu from './components/SideMenu';
import ExportOverlay from './components/ExportOverlay';
import ImportOverlay from './components/ImportOverlay';
import MarkManagementPage from './components/MarkManagementPage';
import SettingsPage from './components/SettingsPage';
import AboutPage from './components/AboutPage';
import './styles.css';

type Page = 'home' | 'board-detail' | 'mark-management' | 'settings' | 'about';

const AppContent: React.FC = () => {
  const { boards, createBoard, updateBoard, deleteBoard } = useBoard();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [showExportOverlay, setShowExportOverlay] = useState(false);
  const [showImportOverlay, setShowImportOverlay] = useState(false);
  const sideMenuRef = useRef<HTMLDivElement>(null);

  // Refs for back button handler to read latest state without re-registration
  const currentPageRef = useRef<Page>('home');
  const isSideMenuOpenRef = useRef(false);
  const showExportOverlayRef = useRef(false);
  const showImportOverlayRef = useRef(false);
  // Ref for child components to register overlay close handlers
  const overlayCloseRef = useRef<(() => boolean) | null>(null);

  useEffect(() => {
    // Hide splash screen once the app component is mounted and idioms are available
    const hideSplash = async () => {
      try {
        await SplashScreen.hide();
      } catch (err) {
        console.warn('Error hiding splash screen', err);
      }
    };
    hideSplash();
  }, []);

  // Keep refs in sync with state
  useEffect(() => { currentPageRef.current = currentPage; }, [currentPage]);
  useEffect(() => { isSideMenuOpenRef.current = isSideMenuOpen; }, [isSideMenuOpen]);
  useEffect(() => { showExportOverlayRef.current = showExportOverlay; }, [showExportOverlay]);
  useEffect(() => { showImportOverlayRef.current = showImportOverlay; }, [showImportOverlay]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sideMenuRef.current && !sideMenuRef.current.contains(event.target as Node)) {
        setIsSideMenuOpen(false);
      }
    };
    if (isSideMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSideMenuOpen]);

  // Register back button listener once using refs to avoid re-registration race condition
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let handle: Awaited<ReturnType<typeof CapacitorApp.addListener>> | null = null;

    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      // Child component overlay has priority
      if (overlayCloseRef.current?.()) {
        return;
      }
      if (isSideMenuOpenRef.current) {
        setIsSideMenuOpen(false);
        return;
      }
      if (showExportOverlayRef.current) {
        setShowExportOverlay(false);
        return;
      }
      if (showImportOverlayRef.current) {
        setShowImportOverlay(false);
        return;
      }
      if (currentPageRef.current === 'about') {
        setCurrentPage('settings');
        return;
      }
      if (currentPageRef.current === 'settings') {
        setCurrentPage('home');
        return;
      }
      if (currentPageRef.current === 'mark-management') {
        setCurrentPage('home');
        return;
      }
      if (currentPageRef.current === 'board-detail') {
        setCurrentPage('home');
        setSelectedBoardId(null);
        return;
      }
      if (canGoBack) {
        window.history.back();
      } else {
        CapacitorApp.exitApp();
      }
    }).then(h => { handle = h; });

    return () => {
      handle?.remove();
    };
  }, []);

  const handleSelectBoard = (boardId: string) => {
    setSelectedBoardId(boardId);
    setCurrentPage('board-detail');
  };

  const handleNavigateHome = () => {
    setCurrentPage('home');
    setSelectedBoardId(null);
  };

  const handleOpenMenu = () => {
    setIsSideMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsSideMenuOpen(false);
  };

  const handleCreateAndNavigate = (name: string) => {
    const board = createBoard(name);
    setSelectedBoardId(board.id);
    setCurrentPage('board-detail');
  };

  const handleManageMarks = () => {
    setCurrentPage('mark-management');
  };

  const handleOpenSettings = () => {
    setCurrentPage('settings');
  };

  const handleOpenAbout = () => {
    setCurrentPage('about');
  };

  const selectedBoard = boards.find((b) => b.id === selectedBoardId) ?? null;

  if (currentPage === 'about') {
    return (
      <div className="app-shell">
        <AboutPage onBack={() => setCurrentPage('settings')} />
      </div>
    );
  }

  if (currentPage === 'settings') {
    return (
      <div className="app-shell">
        <SettingsPage onBack={handleNavigateHome} onViewAbout={handleOpenAbout} />
      </div>
    );
  }

  if (currentPage === 'mark-management') {
    return (
      <div className="app-shell">
        <MarkManagementPage onBack={handleNavigateHome} overlayCloseRef={overlayCloseRef} />
      </div>
    );
  }

  if (currentPage === 'board-detail' && selectedBoard) {
    return (
      <div className="app-shell">
        <BoardDetailPage
          board={selectedBoard}
          onBack={handleNavigateHome}
          onUpdateBoard={updateBoard}
          onDeleteBoard={deleteBoard}
          overlayCloseRef={overlayCloseRef}
        />

        {showExportOverlay && (
          <ExportOverlay onClose={() => setShowExportOverlay(false)} />
        )}

        {showImportOverlay && (
          <ImportOverlay onClose={() => setShowImportOverlay(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="app-shell">
      <HomePage
        boards={boards}
        onSelectBoard={handleSelectBoard}
        onOpenMenu={handleOpenMenu}
        onCreateBoard={handleCreateAndNavigate}
        overlayCloseRef={overlayCloseRef}
      />

      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={handleCloseMenu}
        onExport={() => setShowExportOverlay(true)}
        onImport={() => setShowImportOverlay(true)}
        onManageMarks={handleManageMarks}
        onSettings={handleOpenSettings}
        sideMenuRef={sideMenuRef}
      />

      {showExportOverlay && (
        <ExportOverlay onClose={() => setShowExportOverlay(false)} />
      )}

      {showImportOverlay && (
        <ImportOverlay onClose={() => setShowImportOverlay(false)} />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BoardProvider>
      <MarkSuiteProvider>
        <AppContent />
      </MarkSuiteProvider>
    </BoardProvider>
  );
};

export default App;
