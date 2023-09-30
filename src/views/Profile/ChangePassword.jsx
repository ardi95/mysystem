import React, { useState } from 'react'

import { Grid, TextField } from '@mui/material'

import { LoadingButton } from '@mui/lab'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { changePassword } from '../../service/auth'

const MySwal = withReactContent(Swal)

export default function ChangePassword(props) {
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      password_before: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      password_before: Yup.string()
        .required('Previous Password is required')
        .min(6, 'Previous Password must be at least 6 characters')
        .max(20, 'Previous Password must not be greater than 6 characters'),
      password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
        .max(20, 'Password must not be greater than 6 characters'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Confirm Passwords do not match')
        .required('Confirm Password is required'),
    }),
    onSubmit: ({ password_before, password }) => {
      setLoading(true)

      let formData = {
        password_before,
        password,
      }

      changePassword(formData)
        .then(({ data }) => {
          setLoading(true)
          MySwal.fire('Success', data.message, 'success')

          props.updateProfile()
        })
        .catch((err) => {})
        .finally(() => setLoading(false))
    },
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container direction="row" className="mt-24">
        <Grid item xs={12} md={8}>
          <TextField
            type="password"
            name="password_before"
            error={
              formik.touched.password_before && formik.errors.password_before
                ? true
                : false
            }
            onChange={formik.handleChange}
            value={formik.values.password_before}
            className="w-fit"
            label="Previous Password"
            variant="outlined"
            size="small"
            helperText={
              formik.touched.password_before && formik.errors.password_before
                ? formik.errors.password_before
                : ' '
            }
            {...formik.getFieldProps('password_before')}
          />

          <TextField
            type="password"
            name="password"
            error={
              formik.touched.password && formik.errors.password ? true : false
            }
            onChange={formik.handleChange}
            value={formik.values.password}
            className="w-fit mt-16"
            label="Password"
            variant="outlined"
            size="small"
            helperText={
              formik.touched.password && formik.errors.password
                ? formik.errors.password
                : ' '
            }
            {...formik.getFieldProps('password')}
          />

          <TextField
            type="password"
            name="confirm_password"
            error={
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? true
                : false
            }
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
            className="w-fit mt-16"
            label="Confirm Password"
            variant="outlined"
            size="small"
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? formik.errors.confirmPassword
                : ' '
            }
            {...formik.getFieldProps('confirmPassword')}
          />
        </Grid>
      </Grid>

      <Grid container direction="row" className="mt-24">
        <Grid item xs={12} className="text-right">
          <LoadingButton
            variant="outlined"
            onClick={() => props.updateProfile()}
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
            disabled={!formik.isValid ? true : false}
          >
            Save
          </LoadingButton>
        </Grid>
      </Grid>
    </form>
  )
}
