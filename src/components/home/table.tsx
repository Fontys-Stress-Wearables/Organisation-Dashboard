import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { PatientProps } from '../../utilities/api/calls';

interface PatientPropsArray {
  patients: PatientProps[]
}

export default function BasicTable(props : PatientPropsArray) {
  
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Firstname</TableCell>
            <TableCell align="right">Lastname</TableCell>
            <TableCell align="right">Birthday</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.patients.map((patient : PatientProps) => (
            <TableRow
              key={patient.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >

              <TableCell align="right">{patient.firstName}</TableCell>
              <TableCell align="right">{patient.lastName}</TableCell>
              <TableCell align="right">{patient.birthdate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
