import { useEffect, useState } from "react";
import { Accordion, Alert, Button } from "react-bootstrap";
import { getPatients, PatientProps } from "../../utilities/api/calls";
import { Searchbar } from "../searchbar";
import styles from "./patients.module.scss";
import EditIcon from "./edit_black.svg";
import {CreatePatientModal} from "../createPatientModal";
import { useMsal } from "@azure/msal-react";
import BasicTable from "../table/table";


const Patients = () => {
    const [error, setError] = useState(false);
    const [patients, setPatients] = useState<PatientProps[]>([]);
    const { instance, accounts } = useMsal();

    const request = {
      scopes: ["api://5720ed34-04b7-4397-9239-9eb8581ce2b7/access_as_caregiver", "User.Read"],
      account: accounts[0]
    };

    useEffect(() => {
      instance.acquireTokenSilent(request).then((res: any) => {
        getPatients(res.accessToken).then((response) => {
          if(response.error){
            setError(true)
          } else {
            const foundPatients = response.response
            setError(false)
            setPatients(foundPatients)
          }
        }).catch((err) => {
          console.error('Error occured while fetching patients', err)
          setError(true)
        })
    }).catch((e: any) => {
        instance.acquireTokenPopup(request).then((res: any) => {
          getPatients(res.accessToken).then((response) => {
            if(response.error){
              setError(true)
            } else {
              const foundPatients = response.response
              setError(false)
              setPatients(foundPatients)
            }
          }).catch((err) => {
            console.error('Error occured while fetching patients', err)
            setError(true)
          })
        });
    });  
    }, [])

    return(
       <div className={styles.container}>
              <div className={styles.searchbar}>
                <Searchbar/>
              </div>
              <div className={styles.createPatientModal}>
                <CreatePatientModal/>
              </div>
            <div className={styles.Table}>
              {patients && patients.length ?(
                <BasicTable patients={patients}/>
            ) : (
              <div>
                <Alert variant="primary">No patients found</Alert>
              </div>
              )}            
            </div>
          </div> 
    );
}

export default Patients