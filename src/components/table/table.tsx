import Table from 'react-bootstrap/Table'
import { PatientProps } from '../../utilities/api/calls';

interface PatientPropsArray {
  patients: PatientProps[]
}

export default function BasicTable(props : PatientPropsArray) {
  const formatDate = (birthdate : string) =>{
    var date = new Date(birthdate);
    return date.toLocaleDateString()
  }

  return (
    <div>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Birthdate</th>
          </tr>
        </thead>
        <tbody>
          {props.patients.map((patient : PatientProps) => (
            <tr key={patient.id}>
              <td>{patient.firstName}</td>
              <td>{patient.lastName}</td>
              <td>{formatDate(patient.birthdate)}</td>
            </tr>
            ))}
        </tbody>
      </Table>
    </div>  
  );
}
