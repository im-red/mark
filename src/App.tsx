import React from 'react';
import { Route, useHistory } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { SplashScreen } from '@capacitor/splash-screen';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { BoardProvider } from './data/BoardContext';
import { MarkSuiteProvider } from './data/MarkSuiteContext';
import HomePage from './pages/HomePage';
import BoardDetailPage from './pages/BoardDetailPage';
import MarkManagementPage from './pages/MarkManagementPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import SideMenu from './components/SideMenu';
import ExportOverlay from './pages/ExportOverlay';
import ImportOverlay from './pages/ImportOverlay';
import './theme/variables.css';
import './App.scss';

setupIonicReact({
  mode: 'md',
});

const App: React.FC = () => {
  const history = useHistory();

  React.useEffect(() => {
    const hideSplash = async () => {
      try {
        await SplashScreen.hide();
      } catch (err) {
        console.warn('Error hiding splash screen', err);
      }
    };
    hideSplash();
  }, []);

  React.useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const backButtonHandler = CapacitorApp.addListener(
      'backButton',
      ({ canGoBack }) => {
        if (canGoBack) {
          history.goBack();
        } else {
          CapacitorApp.exitApp();
        }
      }
    );

    return () => {
      backButtonHandler.then(handler => handler.remove());
    };
  }, [history]);

  return (
    <IonApp>
      <BoardProvider>
        <MarkSuiteProvider>
          <IonReactRouter>
            <SideMenu />
            <IonRouterOutlet id="main">
              <Route exact path="/" component={HomePage} />
              <Route exact path="/board/:id" component={BoardDetailPage} />
              <Route exact path="/mark-management" component={MarkManagementPage} />
              <Route exact path="/settings" component={SettingsPage} />
              <Route exact path="/about" component={AboutPage} />
              <Route exact path="/export" component={ExportOverlay} />
              <Route exact path="/import" component={ImportOverlay} />
            </IonRouterOutlet>
          </IonReactRouter>
        </MarkSuiteProvider>
      </BoardProvider>
    </IonApp>
  );
};

export default App;
