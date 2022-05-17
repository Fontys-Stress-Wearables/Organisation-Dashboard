import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table'
import { PatientGroupProps } from '../../utilities/api/calls';
import Button from "react-bootstrap/esm/Button"
import FormControl from "react-bootstrap/esm/FormControl"
import InputGroup from "react-bootstrap/esm/InputGroup"
import SearchIcon from "./search_white_48dp.svg"

interface TablePropsArray {
  patientGroups: PatientGroupProps[]
}

const BasicPgTable: React.FC<TablePropsArray> = ({patientGroups}) => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<PatientGroupProps[]>([])
  
  const handleSearch = (event : React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }

  useEffect(() => {
    const results = patientGroups.filter(p =>
      p.groupName.toLowerCase().includes(search)
    );
    setSearchResults(results);
  }, [search]);

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
            <img src={SearchIcon}></img>
          </Button>
        </InputGroup>
      </div>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Group Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((patientGroup : PatientGroupProps) => (
            <tr key={patientGroup.id}>
              <td>{patientGroup.id}</td>
              <td>{patientGroup.groupName}</td>
              <td>{patientGroup.description}</td>
            </tr>
            ))}
        </tbody>
      </Table>
    </div>  
  );
}

export default BasicPgTable