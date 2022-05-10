import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { PatientProps } from "../../utilities/api/calls";
import styles from "./patientcard.module.scss";

interface PatientcardProps {
    patient: PatientProps;
}

const Patientcard = (props : PatientcardProps) => {
    const [onEdit, setOnEdit] = useState(false);


    return(
        <div className={styles.patientcard}>
            <Form>
                <Form.Group className="mb-3" controlId="patientFirstName">
                    <Form.Label>First name</Form.Label>
                    <Form.Control type="string" placeholder={props.patient.lastName} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="patientLastName">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control type="string" placeholder={props.patient.lastName} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Label>Birthdate</Form.Label>
                    <Form.Control type="date" name="date_of_birth"/>
                </Form.Group>
                
                <Button variant="secondary" type="reset">
                    Cancel
                </Button>{' '}
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
}

export default Patientcard
