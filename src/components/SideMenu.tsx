import React, { useRef, RefObject, useEffect } from 'react';
import useAppVersion from '../hooks/useAppVersion';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  onImport: () => void;
  onManageMarks: () => void;
  onSettings: () => void;
  sideMenuRef: RefObject<HTMLDivElement | null>;
}

const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  onClose,
  onExport,
  onImport,
  onManageMarks,
  onSettings,
  sideMenuRef,
}) => {
  const versionInfo = useAppVersion();
  const startX = useRef<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (sideMenuRef.current && isOpen) {
        startX.current = e.touches[0].clientX;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (startX.current !== null && sideMenuRef.current && isOpen) {
        const currentX = e.touches[0].clientX;
        const diff = currentX - startX.current;
        if (diff < -50) {
          onClose();
          startX.current = null;
        }
      }
    };

    const handleTouchEnd = () => {
      startX.current = null;
    };

    const menuEl = sideMenuRef.current;
    if (menuEl) {
      menuEl.addEventListener('touchstart', handleTouchStart);
      menuEl.addEventListener('touchmove', handleTouchMove);
      menuEl.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (menuEl) {
        menuEl.removeEventListener('touchstart', handleTouchStart);
        menuEl.removeEventListener('touchmove', handleTouchMove);
        menuEl.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isOpen, onClose, sideMenuRef]);

  const handleItemClick = (action: () => void) => {
    onClose();
    action();
  };

  return (
    <>
      {isOpen && <div className="side-menu-backdrop" onClick={onClose} />}
      <div
        ref={sideMenuRef}
        className={`side-menu ${isOpen ? 'side-menu--open' : ''}`}
      >
        <div className="side-menu__header">
          <h2>Menu</h2>
          <button className="side-menu__close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="side-menu__content">
          <button
            className="side-menu__item"
            onClick={() => handleItemClick(onManageMarks)}
          >
            <span className="side-menu__icon">🎨</span>
            Manage Marks
          </button>
          <button
            className="side-menu__item"
            onClick={() => handleItemClick(onExport)}
          >
            <span className="side-menu__icon">📤</span>
            Export Data
          </button>
          <button
            className="side-menu__item"
            onClick={() => handleItemClick(onImport)}
          >
            <span className="side-menu__icon">📥</span>
            Import Data
          </button>
          <div className="side-menu__divider" />
          <button
            className="side-menu__item"
            onClick={() => handleItemClick(onSettings)}
          >
            <span className="side-menu__icon">⚙️</span>
            Settings
          </button>
        </div>
        <div className="side-menu__footer">{versionInfo.fullString}</div>
      </div>
    </>
  );
};

export default SideMenu;
