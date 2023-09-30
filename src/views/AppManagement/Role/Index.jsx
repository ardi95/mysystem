import React, { useState, useEffect, useRef } from 'react'

import {
  Grid,
  FormControl,
  OutlinedInput,
  TableRow,
  TableCell,
  TableBody,
  InputAdornment,
  IconButton,
  Dialog,
} from '@mui/material'

import { LoadingButton } from '@mui/lab'

import {
  Add,
  Close,
  Search as SearchIcon,
  Edit as EditIcon,
} from '@mui/icons-material'

import { permissionByMenu } from '../../../service/auth'
import { list } from '../../../service/AppManagement/role'

import SimpleDatatable from '../../../utils/SimpleDatatable'
import DialogAdd from './DialogAdd'
import DialogEdit from './DialogEdit'

export default function Index(props) {
  const header = useRef([
    {
      text: 'Name',
      align: 'left',
      sortable: true,
      value: 'name',
    },
    {
      text: 'Actions',
      align: 'center',
      sortable: false,
      value: 'actions',
    },
  ])

  const itemsPerPageOptions = useRef([5, 10, 25])

  const [permission, setPermission] = useState({
    access: false,
    create: false,
    update: false,
    delete: false,
  })

  const [loading, setLoading] = useState(false)
  const [dialogAdd, setDialogAdd] = useState(false)
  const [dialogEdit, setDialogEdit] = useState(false)

  const [search, setSearch] = useState('')
  const [tempSearch, setTempSearch] = useState('')

  const [items, setItems] = useState([])

  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [total, setTotal] = useState(0)
  const [sortField, setSortField] = useState({
    column: '',
    dir: '',
  })
  const [page, setPage] = useState(1)

  const [selectData, setSelectData] = useState(null)

  const handleChangeRowsPerPage = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10))
    setPage(1)
  }

  const getSearch = () => {
    setSearch(tempSearch)
  }

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      getSearch()
    }
  }

  const handleClickClear = () => {
    setTempSearch('')
    setSearch('')
  }

  const handleMouseDown = (event) => {
    event.preventDefault()
  }

  const changeSort = (data) => {
    setSortField(data)
  }

  const fetchData = () => {
    setLoading(true)

    setItems([])

    let params = {
      per_page: itemsPerPage,
      page: page,
      order_field: sortField.column,
      order_dir: sortField.dir,
      search,
    }

    list(params)
      .then(({ data }) => {
        setItems(data.data)

        setTotal(data.last_page)
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false)
      })
  }

  const refreshPage = () => {
    setPage(1)
    fetchData()
  }

  const openDialogEdit = (data) => {
    setSelectData(data)
    setDialogEdit(true)
  }

  const closeDialogEdit = () => {
    setSelectData(null)
    setDialogEdit(false)
  }

  const checkPermission = () => {
    const params = {
      key: 'role',
    }

    permissionByMenu(params)
      .then(({ data }) => {
        setPermission(data)
      })
      .catch(() => {})
  }

  useEffect(() => {
    checkPermission()
  }, [])

  useEffect(() => {
    refreshPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsPerPage, search, sortField])

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

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
            <div className="flex-container flex-container--start">
              <div className="table-handler-flex w-fit mr-8">
                <FormControl fullWidth variant="outlined">
                  <OutlinedInput
                    size="small"
                    id="input-search"
                    value={tempSearch}
                    onChange={(e) => setTempSearch(e.target.value)}
                    onKeyDown={handleSearch}
                    startAdornment={
                      <InputAdornment position="start">
                        <IconButton onClick={() => getSearch()} edge="start">
                          <SearchIcon></SearchIcon>
                        </IconButton>
                      </InputAdornment>
                    }
                    endAdornment={
                      tempSearch !== '' && (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickClear}
                            onMouseDown={handleMouseDown}
                            edge="end"
                          >
                            <Close></Close>
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  />
                </FormControl>
              </div>

              {permission.create === true && (
                <div className="table-handler-flex">
                  <LoadingButton
                    variant="contained"
                    startIcon={<Add />}
                    style={{ height: '40px' }}
                    onClick={() => setDialogAdd(true)}
                    loading={loading}
                  >
                    Add
                  </LoadingButton>
                </div>
              )}
            </div>
          </Grid>
        </Grid>

        <Grid container direction="row" className="mt-24">
          <Grid item xs={12}>
            <SimpleDatatable
              header={header.current}
              itemsPerPageOptions={itemsPerPageOptions.current}
              loading={loading}
              total={total}
              page={page}
              itemsPerPage={itemsPerPage}
              // function
              handleChangePage={(dtpage) => setPage(dtpage)}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              changeSort={changeSort}
            >
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell align="center" colSpan={header.current.length}>
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {items.length ? (
                      items.map((dt, index) => (
                        <TableRow hover key={index}>
                          <TableCell align="left">{dt.name}</TableCell>
                          <TableCell align="center">
                            {permission.update === true && (
                              <IconButton
                                onClick={() => openDialogEdit(dt)}
                                size="small"
                                style={{ height: '16px' }}
                              >
                                <EditIcon className="font-16"></EditIcon>
                              </IconButton>
                            )}
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

      <Dialog
        open={dialogAdd}
        fullWidth={true}
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '100%',
              maxWidth: '700px', // Set your width here
            },
          },
        }}
      >
        {dialogAdd && (
          <DialogAdd
            meta={props.meta}
            closeDialog={() => setDialogAdd(false)}
            refreshPage={refreshPage}
          ></DialogAdd>
        )}
      </Dialog>

      {/* <Dialog
        open={dialogEdit && selectData !== null}
        fullWidth={true}
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '100%',
              maxWidth: '700px', // Set your width here
            },
          },
        }}
      >
        {dialogEdit && selectData !== null && (
          <DialogEdit
            meta={props.meta}
            selectData={selectData}
            closeDialog={closeDialogEdit}
            refreshPage={refreshPage}
          ></DialogEdit>
        )}
      </Dialog> */}

      <Dialog
        open={dialogEdit && selectData !== null}
        fullWidth={true}
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '100%',
              maxWidth: '700px', // Set your width here
            },
          },
        }}
      >
        {dialogEdit && selectData !== null && (
          <DialogEdit
            permission={permission}
            meta={props.meta}
            selectData={selectData}
            closeDialog={closeDialogEdit}
            refreshPage={refreshPage}
          ></DialogEdit>
        )}
      </Dialog>
    </>
  )
}
