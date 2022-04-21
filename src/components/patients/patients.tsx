import { useEffect, useState } from "react";
import { Accordion, Alert } from "react-bootstrap";
import { getPatients, PatientProps } from "../../utilities/api/calls";
import { Patientcard } from "../patientcard";
import { Searchbar } from "../searchbar";
import styles from "./patients.module.scss";
import EditIcon from "./edit_black.svg";
import {CreatePatientModal} from "../createPatientModal";

const Patients = () => {
    const obj = {firstName: "", lastName: "", birthdate: ""}

    const [error, setError] = useState(false);
    const [patients, setPatients] = useState<PatientProps[]>([]);
    const [patientToggle, setPatientToggle] = useState(false);
    const [patient, setPatient] = useState<PatientProps>(obj);

    useEffect(() => {
        getPatients().then((response) => {
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
      }, [])

    return(
       <div className={styles.container}>
          <div>
            <div className={styles.actionBar}>
              <div className={styles.searchbar}>
                <Searchbar/>
              </div>
              <div className={styles.createPatientModal}>
                <CreatePatientModal/>
              </div>
            </div>
            <div className={styles.accordion}>
              <Accordion defaultActiveKey="0">
                {patients && patients.length ? (
                  patients.map((p, index) =>(
                    <Accordion.Item eventKey={index.toString()}>
                      <Accordion.Header> {p.firstName} </Accordion.Header>
                      <Accordion.Body>
                        The patient is part of the following patient-groups: {p.patientGroups}. 
                        Do you wish to edit the patientdata: 
                        <img src={EditIcon}></img>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))
                ) : (
                  <div>
                    <Alert variant="primary">No patients found</Alert>
                  </div>
                )}
              </Accordion>
            </div>
          </div> 
          

          {/* <div className={styles.patientcard}>
            <Patientcard patient={patient}/>
          </div> */}
       </div>
    );
}

export default Patients