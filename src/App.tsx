import React from 'react';
import { Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { SplashScreen } from '@capacitor/splash-screen';
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
