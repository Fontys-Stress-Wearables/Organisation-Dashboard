import Table from 'react-bootstrap/Table'
import { PatientProps } from '../../utilities/api/calls';

interface PatientPropsArray {
  patients: PatientProps[]
}

export default function BasicTable(props : PatientPropsArray) {
  
  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
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
              <td>{patient.birthdate}</td>
            </tr>
            ))}
        </tbody>
      </Table>
    </div>  
  );
}
