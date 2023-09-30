import React, { useState } from 'react'
import { DialogContent, Grid, IconButton } from '@mui/material'
import { Close } from '@mui/icons-material'

import UpdateProfile from './UpdateProfile';
import ChangePassword from './ChangePassword';

export default function Profile(props) {
  const [form, setForm] = useState('updateProfile');

  const refreshPage = () => {
    props.refreshPage()
  }

  return (
    <DialogContent>
      <div className="customP p-24">
        <Grid container direction="row" alignItems="center">
          <Grid item xs={6}>
            <p className="font-24 font-bold">Profile</p>
          </Grid>
          <Grid item xs={6} className="text-right">
            <IconButton
              onClick={() => props.closeDialog()}
              size="small"
              style={{ height: '16px' }}
            >
              <Close className="font-16"></Close>
            </IconButton>
          </Grid>
        </Grid>

        {form === 'updateProfile' && (
          <UpdateProfile refreshPage={refreshPage} changePassword={() => setForm('changePassword')} closeDialog={() => props.closeDialog()}></UpdateProfile>
        )}

        {form === 'changePassword' && (
          <ChangePassword updateProfile={() => setForm('updateProfile')}></ChangePassword>
        )}
      </div>
    </DialogContent>
  )
}
