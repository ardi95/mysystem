import React, { useRef, useState } from 'react'

import { Grid, Dialog } from '@mui/material'

import { Add } from '@mui/icons-material'

import { LoadingButton } from '@mui/lab'

import SimpleDatatable from '../../../utils/SimpleDatatable'

import DialogAdd from './DialogAdd'

export default function Index(props) {
  const header = useRef([
    {
      text: 'Kode',
      align: 'left',
      sortable: false,
      value: 'name',
    },
    {
      text: 'Jenis',
      align: 'left',
      sortable: false,
      value: 'name',
    },
    {
      text: 'NPWP',
      align: 'left',
      sortable: false,
      value: 'name',
    },
    {
      text: 'Nama',
      align: 'left',
      sortable: false,
      value: 'name',
    },
  ])

  const [dialogAdd, setDialogAdd] = useState(false)

  return (
    <>
      <div className="customP p-24">
        <Grid container direction="row" alignItems="center">
          <Grid item xs={12}>
            <p className="font-24 font-bold">{props.meta.title}</p>
          </Grid>
        </Grid>

        <Grid container direction="row" className="mt-24">
          <Grid item xs={12}>
            <LoadingButton
              variant="contained"
              startIcon={<Add />}
              style={{ height: '40px' }}
              onClick={() => setDialogAdd(true)}
            >
              Add
            </LoadingButton>
          </Grid>
        </Grid>

        <Grid container direction="row" className="mt-24">
          <Grid item xs={12}>
            <SimpleDatatable header={header.current}>

            </SimpleDatatable>
          </Grid>
        </Grid>
      </div>

      <Dialog
        open={dialogAdd}
        fullWidth={true}
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '100%',
              maxWidth: '700px', // Set your width here
              '& .MuiDialogContent-root': {
                padding: '0px'
              },
            },
          },
        }}
      >
        {dialogAdd && (
          <DialogAdd
            meta={props.meta}
            closeDialog={() => setDialogAdd(false)}
          ></DialogAdd>
        )}
      </Dialog>
    </>
  )
}
