import React, { useRef } from 'react'

import {
  DialogContent,
  Grid,
  TextField,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material'

import { LoadingButton } from '@mui/lab'

import SimpleDatatable from '../../../utils/SimpleDatatable'

export default function DialogAdd(props) {
  const header = useRef([
    {
      text: 'Kode Kota',
      align: 'left',
      sortable: false,
      value: 'name',
    },
    {
      text: 'Alamat',
      align: 'left',
      sortable: false,
      value: 'name',
    },
    {
      text: 'No Telp',
      align: 'left',
      sortable: false,
      value: 'name',
    },
    {
      text: 'Email',
      align: 'left',
      sortable: false,
      value: 'name',
    },
  ])

  return (
    <DialogContent>
      <div className="customP p-24">
        <Grid container direction="row" alignItems="center">
          <Grid item xs={6}>
            <p className="font-24 font-bold">Add {props.meta.title}</p>
          </Grid>
          <Grid item xs={6} className="text-right">
            <LoadingButton
              variant="outlined"
              onClick={() => props.closeDialog()}
              className="mr-8 mb-8"
            >
              Cancel
            </LoadingButton>

            <LoadingButton className="mr-8 mb-8" variant="contained">
              Save
            </LoadingButton>
          </Grid>
        </Grid>

        <Grid container direction="row" className="mt-24">
          <Grid item xs={12} md={8}>
            <TextField
              name="kode"
              className="w-fit mt-16"
              label="Kode"
              variant="outlined"
              size="small"
            />

            <TextField
              name="jenis"
              className="w-fit mt-16"
              label="Jenis"
              variant="outlined"
              size="small"
            />

            <TextField
              name="npwp"
              className="w-fit mt-16"
              label="NPWP"
              variant="outlined"
              size="small"
            />

            <TextField
              name="name"
              className="w-fit mt-16"
              label="Name"
              variant="outlined"
              size="small"
            />
          </Grid>
        </Grid>

        <Grid container direction="row" className="mt-24">
          <Grid item xs={12}>
            <SimpleDatatable header={header.current} minWidth="500px">
              <TableBody>
                <TableRow>
                  <TableCell align="left">JKT</TableCell>
                  <TableCell align="left">Lorem ipsum dolor sit amet.</TableCell>
                  <TableCell align="left">081212345678</TableCell>
                  <TableCell align="left">dummy@samudera.id</TableCell>
                </TableRow>
              </TableBody>
            </SimpleDatatable>
          </Grid>
        </Grid>
      </div>
    </DialogContent>
  )
}
