import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table'
import { CaregiverGraphProps } from "../../utilities/api/calls";
import Button from "react-bootstrap/esm/Button"
import FormControl from "react-bootstrap/esm/FormControl"
import InputGroup from "react-bootstrap/esm/InputGroup"
import SearchIcon from "./search_white_48dp.svg"
import GroupIcon from  "./groups_white_24dp.svg"
import InfoIcon from "./info_outline_white_24dp.svg"
import styles from "./caregivers.module.scss";
import CaregiverDetailsModal from "../caregiverDetailsModal/caregiverDetailsModal";
import CaregiverPatientGroupModal from "../caregiverPatientGroupModal/caregiverPatientGroupModal";

interface TablePropsArray {
  caregivers: CaregiverGraphProps[]
}

const CaregiverTable: React.FC<TablePropsArray> = ({caregivers}) => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<CaregiverGraphProps[]>([])

  const [selectedCaregiver, setSelectedCaregiver] = useState<CaregiverGraphProps>();
  const [showDetails, setShowDetails] = useState(false);
  const [showPatientGroups , setShowPatientGroups] = useState(false);
  
  const handleSearch = (event : React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }

  useEffect(() => {
    const results = caregivers.filter(p =>
      p.givenName.toLowerCase().includes(search.toLowerCase()) || p.surname.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(results);
  }, [search, caregivers]);

  const openCaregiverDetails = (caregiver : CaregiverGraphProps) => {
    setSelectedCaregiver(caregiver);
    setShowDetails(true)
  }

  const openCaregiverPatientGroups = (caregiver : CaregiverGraphProps) => {
    setSelectedCaregiver(caregiver);
    setShowPatientGroups(true)
  }

  return (
    <div>
      <div className={styles.createPatientGroupModal}>
        <CaregiverDetailsModal caregiver={selectedCaregiver} show={showDetails} closeModal={() => setShowDetails(false)}/>
      </div>
      <div>
        <CaregiverPatientGroupModal caregiver={selectedCaregiver} show={showPatientGroups} closeModal={() => setShowPatientGroups(false)}/>
      </div>
      <div>
        <InputGroup className="mb-3">
          <FormControl
            aria-label="Search"
            aria-describedby="basic-addon1"
            onChange={handleSearch}
          />
          <Button>
            <img src={SearchIcon}></img>
          </Button>
        </InputGroup>
      </div>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Job Title</th>
            <th style={{width: "10px"}}/>
            <th style={{width: "10px"}}/>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((caregiver : CaregiverGraphProps) => (
            <tr key={caregiver.id}>
              <td>{caregiver.givenName}</td>
              <td>{caregiver.surname}</td>
              <td>{caregiver.jobTitle}</td>
              <td style={{display: "flex"}}><Button onClick={() => openCaregiverDetails(caregiver)} variant="success" style={{display: "flex", marginLeft: "auto", width: "36px", justifyContent: "center"}}><img style={{margin: "auto"}} src={InfoIcon}></img></Button></td>
              <td><Button onClick={() => openCaregiverPatientGroups(caregiver)} variant="success" style={{display: "flex", marginLeft: "auto", width: "36px", justifyContent: "center"}}><img style={{margin: "auto"}} src={GroupIcon}></img></Button></td>
            </tr>
            ))}
        </tbody>
      </Table>
    </div>  
  );
}

export default CaregiverTable