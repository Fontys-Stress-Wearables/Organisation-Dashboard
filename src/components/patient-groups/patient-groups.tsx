import { useState } from "react";
import { PatientGroupProps } from "../../utilities/api/calls";

const PatientGroups: React.FC = () => {
    const [patientGroups, setPatientGroups] = useState<PatientGroupProps[]>([])
    return(
        <div>
            <h2>hallo patientgroups</h2>
        </div>
    );
}

export default PatientGroups