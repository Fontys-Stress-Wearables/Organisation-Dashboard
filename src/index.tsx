import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { PUBLIC_URL } from './utilities/environment'
import { PublicClientApplication, InteractionType } from "@azure/msal-browser";
import { MsalProvider, MsalAuthenticationTemplate } from "@azure/msal-react";
import { msalConfig, appRoles } from "./authConfig";
import Loading from "./components/loading/loading"
import { AppGuard } from './AppGuard';

const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.render(
  <BrowserRouter basename={PUBLIC_URL}>
    <MsalProvider instance={msalInstance}>
      <MsalAuthenticationTemplate
        interactionType={InteractionType.Redirect}
        loadingComponent={Loading}
      >
        <AppGuard exact roles={[appRoles.Admin]}>
          <App/>
        </AppGuard>
      </MsalAuthenticationTemplate>
    </MsalProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
