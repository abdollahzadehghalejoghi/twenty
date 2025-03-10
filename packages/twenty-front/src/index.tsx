import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { ApolloProvider } from '@/apollo/components/ApolloProvider';
import { ClientConfigProvider } from '@/client-config/components/ClientConfigProvider';
import { ApolloDevLogEffect } from '@/debug/components/ApolloDevLogEffect';
import { RecoilDebugObserverEffect } from '@/debug/components/RecoilDebugObserver';
import { AppErrorBoundary } from '@/error-handler/components/AppErrorBoundary';
import { ExceptionHandlerProvider } from '@/error-handler/components/ExceptionHandlerProvider';
import { PromiseRejectionEffect } from '@/error-handler/components/PromiseRejectionEffect';
import { ApolloMetadataClientProvider } from '@/object-metadata/components/ApolloMetadataClientProvider';
import { ObjectMetadataItemsProvider } from '@/object-metadata/components/ObjectMetadataItemsProvider';
import { IconsProvider } from '@/ui/display/icon/components/IconsProvider';
import { DialogManager } from '@/ui/feedback/dialog-manager/components/DialogManager';
import { DialogManagerScope } from '@/ui/feedback/dialog-manager/scopes/DialogManagerScope';
import { SnackBarProvider } from '@/ui/feedback/snack-bar-manager/components/SnackBarProvider';
import { SnackBarProviderScope } from '@/ui/feedback/snack-bar-manager/scopes/SnackBarProviderScope';
import { AppI18nProvider } from '@/ui/i18n/components/AppI18nProvider.tsx';
import { AppThemeProvider } from '@/ui/theme/components/AppThemeProvider';
import { ThemeType } from '@/ui/theme/constants/theme';
import { UserProvider } from '@/users/components/UserProvider';
import { PageChangeEffect } from '~/effect-components/PageChangeEffect';

import '@emotion/react';

import { App } from './App';

import './index.css';
import 'react-loading-skeleton/dist/skeleton.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <AppI18nProvider>
    <RecoilRoot>
      <AppErrorBoundary>
        <RecoilDebugObserverEffect />
        <ApolloDevLogEffect />
        <BrowserRouter>
          <SnackBarProviderScope snackBarManagerScopeId="snack-bar-manager">
            <IconsProvider>
              <ExceptionHandlerProvider>
                <ApolloProvider>
                  <HelmetProvider>
                    <ClientConfigProvider>
                      <UserProvider>
                        <ApolloMetadataClientProvider>
                          <ObjectMetadataItemsProvider>
                            <AppThemeProvider>
                              <SnackBarProvider>
                                <DialogManagerScope dialogManagerScopeId="dialog-manager">
                                  <DialogManager>
                                    <StrictMode>
                                      <PromiseRejectionEffect />
                                      <App />
                                    </StrictMode>
                                  </DialogManager>
                                </DialogManagerScope>
                              </SnackBarProvider>
                            </AppThemeProvider>
                            <PageChangeEffect />
                          </ObjectMetadataItemsProvider>
                        </ApolloMetadataClientProvider>
                      </UserProvider>
                    </ClientConfigProvider>
                  </HelmetProvider>
                </ApolloProvider>
              </ExceptionHandlerProvider>
            </IconsProvider>
          </SnackBarProviderScope>
        </BrowserRouter>
      </AppErrorBoundary>
    </RecoilRoot>
  </AppI18nProvider>,
);

declare module '@emotion/react' {
  export interface Theme extends ThemeType {
  }
}
