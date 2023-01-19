import { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/esm/Button'
import FormControl from 'react-bootstrap/esm/FormControl'
import InputGroup from 'react-bootstrap/esm/InputGroup'
import { PatientGroupProps } from '../../utilities/api/calls'
import SearchIcon from './search_white_48dp.svg'
import DeleteIcon from '../swsp-admin/delete_forever_white_24dp.svg'
import { UpdatePatientGroupModal } from '../modals/updatePatientGroupModal'
import GroupIcon from '../caregivers/groups_white_24dp.svg'
import PatientGroupModal from '../modals/patientGroupModal/patientGroupModal'

type TablePropsArray = {
  onRemove: (id: string) => void
  update: () => void
  patientGroups: PatientGroupProps[]
}

const BasicPgTable = ({ onRemove, patientGroups, update }: TablePropsArray) => {
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<PatientGroupProps[]>([])

  const [showPatientGroupModal, setShowPatientGroupModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<PatientGroupProps>()

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  useEffect(() => {
    const results = patientGroups.filter((pg) =>
      pg.groupName.toLowerCase().includes(search.toLowerCase()),
    )
    setSearchResults(results)
  }, [search, patientGroups])

  const onDeleteClickHandler = (patientGroup: PatientGroupProps) => {
    if (
      window.confirm(
        `Are you sure you want to delete this patient-group: ${patientGroup.groupName}?`,
      )
    ) {
      onRemove(patientGroup.id ? patientGroup.id : '1')
    }
  }

  const openPatientGroup = (patientGroup: PatientGroupProps) => {
    setSelectedGroup(patientGroup)
    setShowPatientGroupModal(true)
  }

  const closePatientGroup = () => {
    setSelectedGroup(undefined)
    setShowPatientGroupModal(false)
  }

  return (
    <div>
      <PatientGroupModal
        closeModal={closePatientGroup}
        show={showPatientGroupModal}
        patientGroup={selectedGroup}
      />
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
            <th style={{ width: '10px' }}></th>
            <th style={{ width: '10px' }}></th>
            <th style={{ width: '10px' }}></th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((patientGroup: PatientGroupProps) => (
            <tr key={patientGroup.id}>
              <td>{patientGroup.groupName}</td>
              <td>{patientGroup.description}</td>
              <td>
                <Button
                  onClick={() => openPatientGroup(patientGroup)}
                  variant="success"
                  style={{
                    display: 'flex',
                    marginLeft: 'auto',
                    width: '36px',
                    justifyContent: 'center',
                  }}
                >
                  <img style={{ margin: 'auto' }} src={GroupIcon} alt="users" />
                </Button>
              </td>
              <td>
                <UpdatePatientGroupModal
                  patientGroup={patientGroup}
                  update={update}
                />
              </td>
              <td>
                <Button
                  style={{
                    display: 'flex',
                    width: '36px',
                    justifyContent: 'center',
                  }}
                  onClick={() => onDeleteClickHandler(patientGroup)}
                  variant="danger"
                >
                  <img src={DeleteIcon} alt="delete" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default BasicPgTable
