import React, { useState } from "react"
import Button from "react-bootstrap/esm/Button"
import FormControl from "react-bootstrap/esm/FormControl"
import InputGroup from "react-bootstrap/esm/InputGroup"
import SearchIcon from "./search_white_48dp.svg"

interface Searchbar {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Searchbar = (props : Searchbar ) => {
    return(
        <div>
            <InputGroup className="mb-3">
                <FormControl
                    aria-label="Search"
                    aria-describedby="basic-addon1"
                />
                <Button>
                    <img src={SearchIcon}></img>
                </Button>
            </InputGroup>
        </div>
    )
}

export default Searchbar