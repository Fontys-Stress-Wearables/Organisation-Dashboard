import React from 'react'
import Button from 'react-bootstrap/esm/Button'
import FormControl from 'react-bootstrap/esm/FormControl'
import InputGroup from 'react-bootstrap/esm/InputGroup'
import SearchIcon from './search_white_48dp.svg'

function Searchbar() {
  return (
    <div>
      <InputGroup className="mb-3">
        <FormControl aria-label="Search" aria-describedby="basic-addon1" />
        <Button>
          <img src={SearchIcon} alt="search"></img>
        </Button>
      </InputGroup>
    </div>
  )
}

export default Searchbar
