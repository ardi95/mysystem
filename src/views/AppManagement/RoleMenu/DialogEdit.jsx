import React, { useState, useRef, useEffect } from 'react'

import {
  DialogContent,
  Grid,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
} from '@mui/material'

import { LoadingButton } from '@mui/lab'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { useGlobal } from '../../../AppContext'

import { profile } from '../../../service/auth'

import { list, update } from '../../../service/AppManagement/rolemenu'

import SimpleDatatable from '../../../utils/SimpleDatatable'

import { dataWarningSA } from '../../../utils/tools'

const MySwal = withReactContent(Swal)

export default function DialogEdit(props) {
  const { addProfileGlobal } = useGlobal()

  const header = useRef([
    {
      text: 'Name',
      align: 'left',
      sortable: false,
      value: 'name',
    },
    {
      text: 'Access',
      align: 'center',
      sortable: false,
      value: 'name',
    },
    {
      text: 'Create',
      align: 'center',
      sortable: false,
      value: 'create',
    },
    {
      text: 'Update',
      align: 'center',
      sortable: false,
      value: 'update',
    },
    {
      text: 'Delete',
      align: 'center',
      sortable: false,
      value: 'delete',
    },
  ])

  const [loading, setLoading] = useState(false)

  const [id, setId] = useState(null)

  const [listDataMenu, setListDataMenu] = useState([])

  const handleChangeCheckbox = (index, permission) => {
    // setLoading(true)
    let tempArray = listDataMenu

    tempArray[index][permission] = !tempArray[index][permission]

    // console.log('tempArray', tempArray);

    setListDataMenu([...tempArray])
  }

  const fetchData = (idRole) => {
    setLoading(true)
    setListDataMenu([])
    let newArray = []

    list(idRole)
      .then(({ data }) => {
        props.dataMenu.data.forEach((dt) => {
          let access = false
          let create = false
          let update = false
          let deleteData = false

          if (
            data.findIndex(
              (dtNow) =>
                dtNow.id === dt.id && dtNow.pivot.permission === 'access'
            ) !== -1
          ) {
            access = true
          }

          if (
            data.findIndex(
              (dtNow) =>
                dtNow.id === dt.id && dtNow.pivot.permission === 'create'
            ) !== -1
          ) {
            create = true
          }

          if (
            data.findIndex(
              (dtNow) =>
                dtNow.id === dt.id && dtNow.pivot.permission === 'update'
            ) !== -1
          ) {
            update = true
          }

          if (
            data.findIndex(
              (dtNow) =>
                dtNow.id === dt.id && dtNow.pivot.permission === 'delete'
            ) !== -1
          ) {
            deleteData = true
          }

          const { id, name } = dt

          let tempArray = {
            id,
            name,
            access,
            create,
            update,
            delete: deleteData,
          }

          newArray = [...newArray, tempArray]
        })

        setListDataMenu(newArray)
      })
      .catch(() => {
        props.dataMenu.data.forEach((dt) => {
          let access = false
          let create = false
          let update = false
          let deleteData = false

          const { id, name } = dt

          let tempArray = {
            id,
            name,
            access,
            create,
            update,
            delete: deleteData,
          }

          newArray = [...newArray, tempArray]
        })

        setListDataMenu(newArray)
      })
      .finally(() => setLoading(false))
  }

  const submitForm = () => {
    const data = {
      title: 'Update Data',
      html: `Are you sure you want to change this data?`,
      confirmButtonText: 'Yes',
    }

    MySwal.fire(dataWarningSA(data)).then((result) => {
      if (result.isConfirmed) {
        setLoading(true)
    
        let tempDatamenu = []
        
        listDataMenu.forEach((dt) => {
          let tempData = null
          if (dt.access) {
            tempData = {
              menu_id: dt.id,
              permission: 'access',
            }
    
            tempDatamenu = [...tempDatamenu, tempData]
          }
    
          if (dt.create) {
            tempData = {
              menu_id: dt.id,
              permission: 'create',
            }
    
            tempDatamenu = [...tempDatamenu, tempData]
          }
    
          if (dt.update) {
            tempData = {
              menu_id: dt.id,
              permission: 'update',
            }
    
            tempDatamenu = [...tempDatamenu, tempData]
          }
    
          if (dt.delete) {
            tempData = {
              menu_id: dt.id,
              permission: 'delete',
            }
    
            tempDatamenu = [...tempDatamenu, tempData]
          }
        })

        let data = null
        
        if (tempDatamenu.length > 0) {
          data = {
            datamenu: tempDatamenu
          }
        }

        update(id, data)
          .then(({data}) => {
            MySwal.fire('Success', data.message, 'success')

            profile()
            .then(({ data }) => {
              addProfileGlobal(data)
            })
            .catch(() => {})
            
            fetchData(id)
          })
          .catch(() => setLoading(false))
      }
    })
  }

  useEffect(() => {
    setLoading(true)

    // setListDataMenu(props.dataMenu.data)

    const { id } = props.selectData
    setId(id)

    fetchData(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])

  return (
    <DialogContent>
      <div className="customP p-24">
        <Grid container direction="row" alignItems="center">
          <Grid item xs={6}>
            <p className="font-24 font-bold">Update {props.meta.title}</p>
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

            <LoadingButton className="mr-8 mb-8" onClick={submitForm} variant="contained" loading={loading}>
              Save
            </LoadingButton>
          </Grid>
        </Grid>

        <Grid container direction="row" className="mt-24">
          <Grid item xs={12}>
            <SimpleDatatable header={header.current} loading={loading}>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell align="center" colSpan={header.current.length}>
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {!loading && listDataMenu.length ? (
                      listDataMenu.map((dt, index) => (
                        <TableRow hover key={index}>
                          <TableCell align="left">{dt.name}</TableCell>
                          <TableCell align="center">
                            <Checkbox
                              data-index={`access-${index}`}
                              onChange={() =>
                                handleChangeCheckbox(index, 'access')
                              }
                              size="small"
                              className="mr-4 p-null"
                              checked={dt.access === true ? true : false}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Checkbox
                              data-index={`create-${index}`}
                              onChange={() =>
                                handleChangeCheckbox(index, 'create')
                              }
                              size="small"
                              className="mr-4 p-null"
                              checked={dt.create === true ? true : false}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Checkbox
                              data-index={`update-${index}`}
                              onChange={() =>
                                handleChangeCheckbox(index, 'update')
                              }
                              size="small"
                              className="mr-4 p-null"
                              checked={dt.update === true ? true : false}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Checkbox
                              data-index={`delete-${index}`}
                              onChange={() =>
                                handleChangeCheckbox(index, 'delete')
                              }
                              size="small"
                              className="mr-4 p-null"
                              checked={dt.delete === true ? true : false}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          align="center"
                          colSpan={header.current.length}
                        >
                          No Data
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </TableBody>
            </SimpleDatatable>
          </Grid>
        </Grid>
      </div>
    </DialogContent>
  )
}
