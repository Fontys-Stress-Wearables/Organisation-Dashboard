import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { CaregiverGraphProps, getPatientGroups, PatientGroupProps, removePatientGroup } from "../../utilities/api/calls";
import styles from "./patient-groups.module.scss"
import Alert from "react-bootstrap/esm/Alert";
import BasicPgTable from "./table";
import { CreatePatientGroupModal } from "../createPatientGroupModal";
import { callMsGraph } from "../../utilities/api/graph";
import { AUTH_REQUEST_SCOPE_URL } from "../../utilities/environment";

const PatientGroups: React.FC = () => {
    const [patientGroups, setPatientGroups] = useState<PatientGroupProps[]>([]);
    const [caregivers, setCaregivers] = useState<CaregiverGraphProps[]>([]);
    const [error, setError] = useState(false);
    const [updateTable, setUpdateTable] = useState(false);
    const { instance, accounts } = useMsal();
    const [edit, setEdit] = useState(false);
    const [patientGroupToEdit, setPatientGroupToEdit] = useState<PatientGroupProps>();
    

    const updatePatientGroupTable = (update: boolean):void => {
      fetchPatientGroups()
    };
  
    const request = {
        scopes: [AUTH_REQUEST_SCOPE_URL, "User.Read"],
        account: accounts[0]
    };

    const requestCaregivers = () => {
      const graphRequest = {
        scopes: ["User.Read"],
        account: accounts[0],
      }
  
      instance.acquireTokenSilent(graphRequest).then((response: any) => {
        callMsGraph(response.accessToken).then((response: any) => {
          if(response.error){
            setError(true)
          } else {
            const resCaregivers = response
            setError(false)
            setCaregivers(resCaregivers)
            console.log(resCaregivers)
          }
        })
      }).catch((e: any) => {
        instance.acquireTokenPopup(graphRequest).then((response: any) => {
          callMsGraph(response.accessToken).then((response: any) => {
            if(response.error){
              setError(true)
            } else {
              const resCaregivers = response
              setError(false)
              setCaregivers(resCaregivers)
            }
          })
        });
      });
    }

    const onEdit = (patientGroup : PatientGroupProps) => {
      setEdit(true);
      setPatientGroupToEdit(patientGroup);
    }

    const onRemove = (id: string) => {
      instance.acquireTokenSilent(request).then((res: any) => {
        removePatientGroup(res.accessToken, id).then(() => {
          fetchPatientGroups()
        }).catch((err) => {
          console.error('Error occurred while removing patient-group', err)
          setError(true)
        })
      }).catch((e: any) => {
        instance.acquireTokenPopup(request).then((res: any) => {
          removePatientGroup(res.accessToken, id).then(() => {
            fetchPatientGroups()
          }).catch((err) => {
            console.error('Error occurred while removing patient-group', err)
            setError(true)
          })
        });
      });
    }
    

    const fetchPatientGroups = () => {
      instance.acquireTokenSilent(request).then((res: any) => {
        getPatientGroups(res.accessToken).then((response) => {
          if(response.error){
            setError(true)
          } else {
            const foundPatientGroups = response.response
            setError(false)
            setPatientGroups([...foundPatientGroups])
          }
        }).catch((err) => {
          console.error('Error occurred while fetching patient groups', err)
          setError(true)
        })
      }).catch((e: any) => {
        instance.acquireTokenPopup(request).then((res: any) => {
          getPatientGroups(res.accessToken).then((response) => {
            if(response.error){
              setError(true)
            } else {
              const foundPatientGroups = response.response
              setError(false)
              setPatientGroups([...foundPatientGroups])
            }
          }).catch((err) => {
            console.error('Error occurred while fetching patient groups', err)
            setError(true)
          })
        });
      });
    }

    useEffect(() => {
      fetchPatientGroups();
      requestCaregivers();
    }, [updateTable]);

    return(
      <div>
        {!error ? (
          <div className={styles.container}>
            <div className={styles.createPatientGroupModal}>
              <CreatePatientGroupModal update={updateTable} updatePatientGroupTable={updatePatientGroupTable}/>
            </div>
            <div className={styles.Table}>
              {patientGroups && patientGroups.length ?(
                <BasicPgTable onEdit={onEdit} onRemove={onRemove} patientGroups={patientGroups} update={fetchPatientGroups}/>
              ) : (
                <div>
                  <Alert variant="primary">No patient-groups found</Alert>
                </div>
              )}             
            </div>
          </div>
         ) : (
            <h2>ERROR PLEASE RELOAD PAGE</h2>
         ) 
        }
      </div> 
    );
}

export default PatientGroups