import { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/esm/Button'
import FormControl from 'react-bootstrap/esm/FormControl'
import InputGroup from 'react-bootstrap/esm/InputGroup'
import SearchIcon from './search_white_48dp.svg'
import DeleteIcon from './delete_forever_white_24dp.svg'
import { OrganizationProps } from '../../utilities/api/calls'

type OrganizationPropsArray = {
  onRemove: (id: string) => void
  organizations: OrganizationProps[]
}

const OrganizationTable = ({
  onRemove,
  organizations,
}: OrganizationPropsArray) => {
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<OrganizationProps[]>([])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  useEffect(() => {
    const results = organizations.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()),
    )
    setSearchResults(results)
  }, [search, organizations])

  const onClickHandler = (organization: OrganizationProps) => {
    if (
      window.confirm(
        `Are you you want to delete this organization: ${organization.name}?`,
      )
    ) {
      onRemove(organization.id)
    }
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
            <th>Organization</th>
            <th>Tenant ID</th>
            <th style={{ width: '10px' }}></th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((organization: OrganizationProps) => (
            <tr key={organization.id}>
              <td>{organization.name}</td>
              <td>{organization.id}</td>
              <td style={{ display: 'flex' }}>
                <Button
                  onClick={() => onClickHandler(organization)}
                  variant="danger"
                  style={{
                    display: 'flex',
                    marginLeft: 'auto',
                    width: '36px',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    alt="deleteicon"
                    style={{ margin: 'auto' }}
                    src={DeleteIcon}
                  ></img>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default OrganizationTable
