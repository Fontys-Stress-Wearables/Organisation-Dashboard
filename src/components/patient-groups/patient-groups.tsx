import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { CaregiverGraphProps, getPatientGroups, PatientGroupProps, removePatientGroup } from "../../utilities/api/calls";
import styles from "./patient-groups.module.scss"
import Alert from "react-bootstrap/esm/Alert";
import BasicPgTable from "./table";
import { CreatePatientGroupModal } from "../createPatientGroupModal";
import { callMsGraph } from "../../utilities/api/graph";

const PatientGroups: React.FC = () => {
    const [patientGroups, setPatientGroups] = useState<PatientGroupProps[]>([])
    const [caregivers, setCaregivers] = useState<CaregiverGraphProps[]>([])
    const [error, setError] = useState(false);
    const [updateTable, setUpdateTable] = useState(false);
    const { instance, accounts } = useMsal();

    const updatePatientGroupTable = (update: boolean):void => {
      setUpdateTable(update);
    };
  
    const request = {
        scopes: ["api://5720ed34-04b7-4397-9239-9eb8581ce2b7/access_as_caregiver", "User.Read"],
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

    const onRemove = (id: string) => {
      instance.acquireTokenSilent(request).then((res: any) => {
        removePatientGroup(res.accessToken, id).then(() => {
          fetchPatientGroups()
        }).catch((err) => {
          console.error('Error occured while removing patient-group', err)
          setError(true)
        })
      }).catch((e: any) => {
        instance.acquireTokenPopup(request).then((res: any) => {
          removePatientGroup(res.accessToken, id).then(() => {
            fetchPatientGroups()
          }).catch((err) => {
            console.error('Error occured while removing patient-group', err)
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
            setPatientGroups(foundPatientGroups)
          }
        }).catch((err) => {
          console.error('Error occured while fetching patient groups', err)
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
              setPatientGroups(foundPatientGroups)
            }
          }).catch((err) => {
            console.error('Error occured while fetching patient groups', err)
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
        <div className={styles.container}>
            <div className={styles.createPatientGroupModal}>
              <CreatePatientGroupModal update={updateTable} updatePatientGroupTable={updatePatientGroupTable} caregivers={caregivers}/>
            </div>
            <div className={styles.Table}>
              {patientGroups && patientGroups.length ?(
                <BasicPgTable onRemove={onRemove} patientGroups={patientGroups}/>
            ) : (
              <div>
                <Alert variant="primary">No patient-groups found</Alert>
              </div>
              )}            
            </div>
          </div> 
    );
}

export default PatientGroups