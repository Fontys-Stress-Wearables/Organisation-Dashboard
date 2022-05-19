import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table'
import { PatientProps } from '../../utilities/api/calls';
import Button from "react-bootstrap/esm/Button"
import FormControl from "react-bootstrap/esm/FormControl"
import InputGroup from "react-bootstrap/esm/InputGroup"
import SearchIcon from "./search_white_48dp.svg"
import GroupIcon from  "./groups_white_24dp.svg"
import styles from "../caregivers/caregivers.module.scss";
import { PatientPatientGroupModal } from '../patientPatientGroupModal';
import { UpdatePatientModal } from '../updatePatientModal';

interface TablePropsArray {
  patients: PatientProps[]
}

const BasicTable: React.FC<TablePropsArray> = ({patients}) => {
  const [selectedPatient, setSelectedPatient] = useState<PatientProps>();
  const [showPatientGroups , setShowPatientGroups] = useState(false);

  const formatDate = (birthdate : string) =>{
    var date = new Date(birthdate);
    return date.toLocaleDateString()
  }

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<PatientProps[]>([])
  
  const handleSearch = (event : React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }

  const openPatientGroups = (patient : PatientProps) => {
    setSelectedPatient(patient);
    setShowPatientGroups(true)
  }

  useEffect(() => {
    const results = patients.filter(p =>
      p.firstName.toLowerCase().includes(search)
    );
    setSearchResults(results);
  }, [search, patients]);

  return (
    <div>
      <div className={styles.createPatientGroupModal}>
        <PatientPatientGroupModal patient={selectedPatient} show={showPatientGroups} closeModal={() => setShowPatientGroups(false)}/>
      </div>
      <div>
        <InputGroup className="mb-3">
          <FormControl
            aria-label="Search"
            aria-describedby="basic-addon1"
            onChange={handleSearch}
          />
          <Button>
            <img alt="searchicon" src={SearchIcon}></img>
          </Button>
        </InputGroup>
      </div>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Birthdate</th>
            <th style={{width: "10px"}}/>
            <th style={{width: "10px"}}/>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((patient : PatientProps) => (
            <tr key={patient.id}>
              <td>{patient.firstName}</td>
              <td>{patient.lastName}</td>
              <td>{formatDate(patient.birthdate)}</td>
              <td><UpdatePatientModal patient={patient}/></td>
              <td><Button onClick={() => openPatientGroups(patient)} variant="success" style={{display: "flex", width: "36px", justifyContent: "center"}}><img alt="groupicon" style={{margin: "auto"}} src={GroupIcon}></img></Button></td>
            </tr>
            ))}
        </tbody>
      </Table>
    </div>  
  );
}

export default BasicTable