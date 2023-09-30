import React from 'react'
import { Link } from 'react-router-dom'

import { Grid, Button } from '@mui/material'

export default function NotFound() {
  return (
    <div className="customP" style={{ paddingTop: '10vh' }}>
      <Grid container direction="row" alignItems="center">
        <Grid item xs={12} className="text-center">
          <p className="text-center font-bold" style={{ fontSize: '200px' }}>
            404
          </p>

          <p className="font-bold font-18">Halaman tidak ditemukan</p>

          <Button
            component={Link}
            variant="contained"
            size="large"
            className="mt-24"
            to="/home"
          >
            Ke Laman Utama
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}
