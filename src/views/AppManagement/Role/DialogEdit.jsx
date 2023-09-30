import React, { useEffect, useState } from 'react'

import { DialogContent, Grid, TextField } from '@mui/material'

import { Delete as DeleteIcon } from '@mui/icons-material'

import { LoadingButton } from '@mui/lab'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { useGlobal } from '../../../AppContext'

import { profile } from '../../../service/auth'

import { update, deleteData } from '../../../service/AppManagement/role'

import { dataWarningSA } from '../../../utils/tools'

const MySwal = withReactContent(Swal)

export default function DialogEdit(props) {
  const { addProfileGlobal } = useGlobal()

  const [permission, setPermission] = useState({
    access: false,
    create: false,
    update: false,
    delete: false,
  })

  const [loading, setLoading] = useState(false)

  const [id, setId] = useState(null)
  const [initialValues, setIntialValues] = useState({
    name: '',
  })

  const submitDelete = () => {
    const data = {
      title: 'Delete Data',
      html: `Are you sure you want to delete this data?`,
      confirmButtonText: 'Yes',
    }

    MySwal.fire(dataWarningSA(data)).then((result) => {
      if (result.isConfirmed) {
        setLoading(true)

        deleteData(id)
          .then(({ data }) => {
            MySwal.fire('Success', data.message, 'success')

            profile()
              .then(({ data }) => {
                addProfileGlobal(data)
              })
              .catch(() => {})

            props.refreshPage()
            props.closeDialog()
          })
          .catch((err) => {})
          .finally(() => setLoading(false))
      }
    })
  }

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
    }),
    onSubmit: ({ name }) => {
      setLoading(true)

      const formData = {
        name,
      }

      update(id, formData)
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

  useEffect(() => {
    setLoading(true)

    const { id, name } = props.selectData

    setPermission(props.permission)
    setId(id)
    setIntialValues({
      name,
    })

    setLoading(false)
  }, [props])

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
                disabled={!formik.isValid ? true : false}
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
          {permission.delete === true && (
            <Grid container direction="row" className="mt-24">
              <Grid item xs={12}>
                <LoadingButton
                  className="w-fit"
                  variant="contained"
                  loading={loading}
                  type="button"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={submitDelete}
                >
                  Delete
                </LoadingButton>
              </Grid>
            </Grid>
          )}
        </form>
      </div>
    </DialogContent>
  )
}
