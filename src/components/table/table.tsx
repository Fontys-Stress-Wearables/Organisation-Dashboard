import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table'
import { PatientProps } from '../../utilities/api/calls';
import Button from "react-bootstrap/esm/Button"
import FormControl from "react-bootstrap/esm/FormControl"
import InputGroup from "react-bootstrap/esm/InputGroup"
import SearchIcon from "./search_white_48dp.svg"

interface TablePropsArray {
  patients: PatientProps[]
}

const BasicTable: React.FC<TablePropsArray> = ({patients}) => {
  const formatDate = (birthdate : string) =>{
    var date = new Date(birthdate);
    return date.toLocaleDateString()
  }

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<PatientProps[]>([])
  
  const handleSearch = (event : React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }

  useEffect(() => {
    const results = patients.filter(p =>
      p.firstName.toLowerCase().includes(search)
    );
    setSearchResults(results);
  }, [search, patients]);

  return (
    <div>
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
          </tr>
        </thead>
        <tbody>
          {searchResults.map((patient : PatientProps) => (
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

export default BasicTable