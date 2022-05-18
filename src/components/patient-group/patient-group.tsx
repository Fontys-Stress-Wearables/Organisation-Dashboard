import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { PatientGroupProps } from "../../utilities/api/calls";
import styles from "./patient-group.module.scss";

interface IPatientGroup {
    patientGroup: PatientGroupProps
}

const PatientGroup: React.FC<IPatientGroup> = ({patientGroup}) => {
    const [groupName, setGroupName] = useState("");

    const handleChangeGroupName = (event: React.ChangeEvent<HTMLInputElement>) => {
      setGroupName(event.target.value);
    };

    const [description, setDescription] = useState("");

    const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
      setDescription(event.target.value);
    };


    return(
        <div className={styles.container}>
            <Form>
                <Form.Group controlId="formGroupName" className="mb-3">
                    <Form.Label>Group name</Form.Label>
                    <Form.Control
                        type="string"
                        placeholder={patientGroup.groupName}
                        autoFocus
                        onChange={handleChangeGroupName}
                    />
                </Form.Group>
                <Form.Group controlId="formDescription" className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="string"
                        placeholder={patientGroup.description}
                        autoFocus
                        onChange={handleChangeDescription}
                    />
                </Form.Group>
                <Button type="reset" variant="secondary">cancel</Button>
                <Button type="submit">Submit</Button>
            </Form>
        </div>
    );
}

export default PatientGroup