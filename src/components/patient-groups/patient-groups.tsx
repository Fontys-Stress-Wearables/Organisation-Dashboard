import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { getPatientGroups, PatientGroupProps } from "../../utilities/api/calls";
import styles from "./patient-groups.module.scss"
import Alert from "react-bootstrap/esm/Alert";
import BasicPgTable from "./table";
import { CreatePatientGroupModal } from "../createPatientGroupModal";

const PatientGroups: React.FC = () => {
    const [patientGroups, setPatientGroups] = useState<PatientGroupProps[]>([])
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

    useEffect(() => {
        instance.acquireTokenSilent(request).then((res: any) => {
          getPatientGroups(res.accessToken).then((response) => {
            if(response.error){
              setError(true)
            } else {
              const foundPatientGroups = response.response
              setError(false)
              setPatientGroups(foundPatientGroups)
              console.log(foundPatientGroups)
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
      }, [updateTable]);

    return(
        <div className={styles.container}>
            <div className={styles.createPatientGroupModal}>
                <CreatePatientGroupModal update={updateTable} updatePatientGroupTable={updatePatientGroupTable}/>
              </div>
            <div className={styles.Table}>
              {patientGroups && patientGroups.length ?(
                <BasicPgTable patientGroups={patientGroups}/>
            ) : (
              <div>
                <Alert variant="primary">No patients found</Alert>
              </div>
              )}            
            </div>
          </div> 
    );
}

export default PatientGroups