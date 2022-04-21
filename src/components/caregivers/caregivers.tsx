import { useState } from "react";
import Accordion from "react-bootstrap/esm/Accordion";
import Alert from "react-bootstrap/esm/Alert";
import { CaregiverProps } from "../../utilities/api/calls";
import { Searchbar } from "../searchbar";
import styles from "./caregivers.module.scss"

const Caregivers = () => {
    const [caregiver, setCaregiver] = useState<CaregiverProps>();
    const [caregivers, setCaregivers] = useState<CaregiverProps[]>([]);

    return(
        <div className={styles.container}>
            <div>
                <div className={styles.accordion}>
                    <Accordion defaultActiveKey="0">
                    {caregivers && caregivers.length ? (
                        caregivers.map((c, index) =>(
                        <Accordion.Item eventKey={index.toString()}>
                            <Accordion.Header> {c.firstName} </Accordion.Header>
                            <Accordion.Body>
                            The caregiver is part of the following patient-groups: {c.patientGroups}. 
                            Do you wish to edit the patientdata: {c.emailAddress}, {c.lastName}, {c.isGuest}
                            </Accordion.Body>
                        </Accordion.Item>
                        ))
                    ) : (
                        <div>
                        <Alert variant="primary">No caregivers found</Alert>
                        </div>
                    )}
                    </Accordion>
                </div>
            </div> 
     </div>
    );
}

export default Caregivers