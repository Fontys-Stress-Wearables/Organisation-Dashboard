import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table'
import { PatientGroupProps } from '../../utilities/api/calls';
import Button from "react-bootstrap/esm/Button"
import FormControl from "react-bootstrap/esm/FormControl"
import InputGroup from "react-bootstrap/esm/InputGroup"
import SearchIcon from "./search_white_48dp.svg"
import EditIcon from "./edit.svg"
import DeleteIcon from "../swsp-admin/delete_forever_white_24dp.svg"

interface TablePropsArray {
  onRemove: (id: string) => void
  onEdit: (patientGroup: PatientGroupProps) => void
  patientGroups: PatientGroupProps[]
}

const BasicPgTable: React.FC<TablePropsArray> = ({onRemove, onEdit, patientGroups}) => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<PatientGroupProps[]>([])
  
  const handleSearch = (event : React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }

  useEffect(() => {
    const results = patientGroups.filter(pg =>
      pg.groupName.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(results);
  }, [search, patientGroups]);

  const onDeleteClickHandler = (patientGroup : PatientGroupProps) => {
    if(window.confirm(`Are you sure about deleting this patient-group: ${patientGroup.groupName}?`)) onRemove(patientGroup.id ? patientGroup.id : "1")
  }

  const onClickHandler = (patientGroup : PatientGroupProps) => {
    onEdit(patientGroup);
  }

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
            <th>Group Name</th>
            <th>Description</th>
            <th style={{width: "10px"}}></th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((patientGroup : PatientGroupProps) => (
            <tr key={patientGroup.id}>
              <td>{patientGroup.groupName}</td>
              <td>{patientGroup.description}</td>
              <td> 
                <Button onClick={() => onDeleteClickHandler(patientGroup)} variant="danger">
                  <img alt="deleteicon" src={DeleteIcon}></img>
                </Button>
              </td>
              <td> 
                <Button onClick={() => onClickHandler(patientGroup)}>
                  <img alt="editicon" src={EditIcon}></img>
                </Button>
              </td>
            </tr>
            ))}
        </tbody>
      </Table>
    </div>  
  );
}

export default BasicPgTable