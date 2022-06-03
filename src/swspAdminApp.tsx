import './App.css';
import SWSPHeader from './components/swsp-admin/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import OrganizationTable from './components/swsp-admin/table';
import styles from "./components/swsp-admin/patients.module.scss";
import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { getOrganizations, OrganizationProps, removeOrganization } from './utilities/api/calls';
import CreateOrganizationModal from './components/swsp-admin/createOrganizationModal';
import { AUTH_REQUEST_SCOPE_URL } from "./utilities/environment";

const SWSPApp: React.FC = () => {
  const [error, setError] = useState(false);
  const [updateTable, setUpdateTable] = useState(false);
  const { instance, accounts } = useMsal();
  const [organizations, setOrganizations] = useState<OrganizationProps[]>([]);
  

  const request = {
    scopes: [AUTH_REQUEST_SCOPE_URL, "User.Read"],
    account: accounts[0]
  };

  const updateOrganizationTable = (update: boolean):void => {
    fetchOrganizations()
  }

  useEffect(() => {
    fetchOrganizations();
  }, [updateTable]);

  const fetchOrganizations = () => {
    instance.acquireTokenSilent(request).then((res: any) => {
      getOrganizations(res.accessToken).then((response) => {
        if(response.error){
          setError(true)
        } else {
          const foundOrganizations = response.response
          setError(false)
          setOrganizations([...foundOrganizations])
        }
      }).catch((err) => {
        console.error('Error occurred while fetching organizations', err)
        setError(true)
      })
    }).catch((e: any) => {
      instance.acquireTokenPopup(request).then((res: any) => {
        getOrganizations(res.accessToken).then((response) => {
          if(response.error){
            setError(true)
          } else {
            const foundOrganizations = response.response
            setError(false)
            setOrganizations([...foundOrganizations])
          }
        }).catch((err) => {
          console.error('Error occurred while fetching organizations', err)
          setError(true)
        })
      });
    });  
  }

  const onRemove = (id: string) => {
    instance.acquireTokenSilent(request).then((res: any) => {
      removeOrganization(res.accessToken, id).then(() => {
          fetchOrganizations()
        }
      ).catch((err) => {
        console.error('Error occurred while removing organization', err)
        setError(true)
      })
    }).catch((e: any) => {
      instance.acquireTokenPopup(request).then((res: any) => {
        removeOrganization(res.accessToken, id).then(() => {
          fetchOrganizations()
        }).catch((err) => {
          console.error('Error occurred while removing organization', err)
          setError(true)
        })
      });
    });  
  }

  return (
    <div className="App" >
      {!error ? (
        <div>
          <SWSPHeader />
          <div className={styles.container}>
    
          <div className={styles.createPatientModal}>
                    <CreateOrganizationModal update={updateTable} updateOrganizationTable={updateOrganizationTable}/>
                  </div>
            <div className={styles.Table}>
              <OrganizationTable onRemove={onRemove} organizations={organizations} />
            </div>
          </div>
        </div>
      ):(
        <h2> ERROR PLEASE RELOAD THE PAGE</h2>
      )}
      
    </div>    
  );
}

export default SWSPApp;
