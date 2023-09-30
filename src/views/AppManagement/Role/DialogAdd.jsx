import React, { useState } from 'react'

import { DialogContent, Grid, TextField } from '@mui/material'

import { LoadingButton } from '@mui/lab'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { add } from '../../../service/AppManagement/role'

const MySwal = withReactContent(Swal)

export default function DialogAdd(props) {
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
    }),
    onSubmit: ({ name }) => {
      setLoading(true)

      const formData = {
        name,
      }

      add(formData)
        .then(({ data }) => {
          formik.resetForm()
          MySwal.fire('Success', data.message, 'success')
          props.refreshPage()
          props.closeDialog()
        })
        .catch((err) => {})
        .finally(() => setLoading(false))
    },
  })

  return (
    <DialogContent>
      <div className="customP">
        <form onSubmit={formik.handleSubmit}>
          <Grid container direction="row" alignItems="center">
            <Grid item xs={6}>
              <p className="font-24 font-bold">Add {props.meta.title}</p>
            </Grid>
            <Grid item xs={6} className="text-right">
              <LoadingButton
                variant="outlined"
                onClick={() => props.closeDialog()}
                className="mr-8 mb-8"
                loading={loading}
              >
                Cancel
              </LoadingButton>
              <LoadingButton
                className="mr-8 mb-8"
                variant="contained"
                loading={loading}
                type="submit"
                disabled={!formik.isValid || !formik.dirty ? true : false}
              >
                Save
              </LoadingButton>
            </Grid>
          </Grid>

          <Grid container direction="row" className="mt-24">
            <Grid item xs={12} md={8}>
              <TextField
                name="name"
                error={formik.touched.name && formik.errors.name ? true : false}
                onChange={formik.handleChange}
                value={formik.values.name}
                className="w-fit mt-16"
                label="Name"
                variant="outlined"
                size="small"
                helperText={
                  formik.touched.name && formik.errors.name
                    ? formik.errors.name
                    : ' '
                }
                {...formik.getFieldProps('name')}
              />
            </Grid>
          </Grid>
        </form>
      </div>
    </DialogContent>
  )
}
