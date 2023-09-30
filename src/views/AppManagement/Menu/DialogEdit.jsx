import React, { useState, useEffect } from 'react'

import {
  DialogContent,
  Grid,
  TextField,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from '@mui/material'

import { LoadingButton } from '@mui/lab'

import { Delete as DeleteIcon } from '@mui/icons-material'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { useGlobal } from '../../../AppContext'

import { profile } from '../../../service/auth'

import { update, deleteData } from '../../../service/AppManagement/menu'

import ListParentMenu from './ListParentMenu'

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

  const [initialValues, setIntialValues] = useState({
    key_name: '',
    name: '',
    order_number: 1,
  })

  const [statusDelete, setStatusDelete] = useState(false)
  const [id, setId] = useState(null)

  const [loading, setLoading] = useState(false)
  const [addParent, setAddParent] = useState(false)
  const [dataParent, setDataParent] = useState(null)

  const [url, setUrl] = useState('')

  const clickRowTable = (data) => {
    setLoading(true)

    setDataParent(data)
    setAddParent(false)

    setLoading(false)
  }

  const handleClickMenuParent = () => {
    if (dataParent === null) {
      setAddParent(true)
    } else {
      setDataParent(null)
    }
  }

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
      key_name: Yup.string()
        .required('Key Name is required')
        .test(
          'is-lowercase',
          'Key Name must be lowercase and no space',
          (value) => /^[a-z]+$/.test(value)
        ),
      name: Yup.string().required('Name is required'),
      order_number: Yup.number()
        .integer('Order Number must be numeric and not decimal')
        .required('Order Number is required')
        .min(1, 'Order Number cannot be smaller than 1'),
    }),
    onSubmit: ({ name, key_name, order_number }) => {
      setLoading(true)

      let parent_menu_id = null

      if (dataParent !== null) {
        const { id } = dataParent
        parent_menu_id = id
      }

      const formData = {
        key_name,
        name,
        url,
        order_number,
        parent_menu_id,
      }

      update(id, formData)
        .then(({ data }) => {
          formik.resetForm()
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
    },
  })

  useEffect(() => {
    setLoading(true)

    const { id, name, url, parent_menu, child_menus, key_name, order_number } =
      props.selectData

    if (child_menus.length === 0) setStatusDelete(true)
    if (parent_menu !== null) setDataParent(parent_menu)

    setPermission(props.permission)
    setId(id)
    setIntialValues({
      key_name,
      name,
      order_number,
    })
    setUrl(url)

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
                name="key_name"
                error={
                  formik.touched.key_name && formik.errors.key_name
                    ? true
                    : false
                }
                onChange={formik.handleChange}
                value={formik.values.key_name}
                className="w-fit"
                label="Key Name (Unique)"
                variant="outlined"
                size="small"
                helperText={
                  formik.touched.key_name && formik.errors.key_name
                    ? formik.errors.key_name
                    : ' '
                }
                {...formik.getFieldProps('key_name')}
              />

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

              <TextField
                name="url"
                onChange={(e) => setUrl(e.target.value)}
                value={url}
                className="w-fit mt-16"
                label="URL"
                variant="outlined"
                size="small"
              />

              <TextField
                type="number"
                name="order_number"
                error={
                  formik.touched.order_number && formik.errors.order_number
                    ? true
                    : false
                }
                onChange={formik.handleChange}
                value={formik.values.order_number}
                className="w-fit mt-16"
                label="Order Number"
                variant="outlined"
                size="small"
                helperText={
                  formik.touched.order_number && formik.errors.order_number
                    ? formik.errors.order_number
                    : ' '
                }
                {...formik.getFieldProps('order_number')}
              />

              {dataParent === null ? (
                <LoadingButton
                  variant="contained"
                  loading={loading}
                  type="button"
                  className="w-fit mt-16"
                  onClick={handleClickMenuParent}
                  size="small"
                >
                  Tambah Menu Parent
                </LoadingButton>
              ) : (
                <LoadingButton
                  variant="outlined"
                  loading={loading}
                  type="button"
                  className="w-fit mt-16"
                  onClick={handleClickMenuParent}
                  size="small"
                  startIcon={<DeleteIcon />}
                >
                  Hapus Menu Parent
                </LoadingButton>
              )}

              {dataParent !== null && (
                <TableContainer component={Paper} className="mt-16">
                  <Table aria-label="simple table" size={'small'}>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-bold">ID</TableCell>
                        <TableCell align="right">{dataParent.id}</TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="font-bold">Name</TableCell>
                        <TableCell align="right">{dataParent.name}</TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="font-bold">URL</TableCell>
                        <TableCell align="right">
                          {dataParent.url !== null || dataParent.url !== ''
                            ? dataParent.url
                            : '-'}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Grid>
          </Grid>

          {addParent === true && (
            <ListParentMenu clickRowTable={clickRowTable}></ListParentMenu>
          )}

          {statusDelete && permission.delete === true && (
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
