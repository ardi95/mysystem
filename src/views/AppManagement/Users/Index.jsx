import React, { useState, useEffect, useRef } from 'react'

import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import { list, listRole } from '../../../service/AppManagement/users'

import SimpleDatatable from '../../../utils/SimpleDatatable'
import DialogAdd from './DialogAdd'
import DialogEdit from './DialogEdit'

export default function Index(props) {
  const header = useRef([
    {
      text: 'Email',
      align: 'left',
      sortable: true,
      value: 'email',
    },
    {
      text: 'Name',
      align: 'left',
      sortable: true,
      value: 'name',
    },
    {
      text: 'Division',
      align: 'left',
      sortable: true,
      value: 'division',
    },
    {
      text: 'Gender',
      align: 'left',
      sortable: true,
      value: 'gender',
    },
    {
      text: 'Role',
      align: 'left',
      sortable: false,
      value: 'roles',
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

  const [itemsRole, setItemsRole] = useState([])

  const [role, setRole] = useState('all')

  const [items, setItems] = useState([])

  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [total, setTotal] = useState(0)
  const [sortField, setSortField] = useState({
    column: '',
    dir: '',
  })
  const [page, setPage] = useState(1)

  const [selectData, setSelectData] = useState(null)
  const [keyPhoto, setKeyPhoto] = useState(25)

  const handleChangeRowsPerPage = async (event) => {
    await setItemsPerPage(parseInt(event.target.value, 10))
    await setPage(1)
  }

  const getSearch = async () => {
    await setSearch(tempSearch)
    await setPage(1);
  }

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      getSearch()
    }
  }

  const handleClickClear = async () => {
    await setTempSearch('')
    await setSearch('')
    await setPage(1);
  }

  const handleMouseDown = (event) => {
    event.preventDefault()
  }

  const handleChangeRole = async (e) => {
    await setRole(e.target.value)
    await setPage(1)
  }

  const changeSort = async (data) => {
    await setSortField(data)
    await setPage(1)
  }

  const fetchData = () => {
    setLoading(true)

    setItems([])

    let role_id = role

    if (role === 'all') role_id = null

    let params = {
      per_page: itemsPerPage,
      role_id,
      page: page,
      order_field: sortField.column,
      order_dir: sortField.dir,
      search,
    }

    list(params)
      .then(({ data }) => {
        setLoading(true)

        setItems([])
        
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
      key: 'users',
    }

    permissionByMenu(params)
      .then(({ data }) => {
        setPermission(data)
      })
      .catch(() => {})
  }

  useEffect(() => {
    checkPermission()

    setItemsRole(null)

    const min = 1 // Minimum value
    const max = 100 // Maximum value
    const randomInt = Math.floor(Math.random() * (max - min + 1)) + min
    setKeyPhoto(randomInt)

    const params = {
      per_page: 1000,
      page: 1,
    }

    listRole(params)
      .then(({ data }) => {
        let tempRole = []

        data.data.forEach((role, index) => {
          tempRole[index] = {
            name: role.name,
            id: role.id,
          }
        })

        setItemsRole([...tempRole])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // useEffect(() => {
  //   console.log('masuk sini 2')
  //   fetchData()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [page])

  useEffect(() => {
    (async () => {
      // await refreshPage()
      await fetchData()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, role, itemsPerPage, search, sortField])

  return (
    <>
      <div className="customP p-24">
        <Grid container>
          <Grid item xs={12}>
            <p className="font-24 font-bold">{props.meta.title}</p>
          </Grid>
        </Grid>

        <Grid container className="mt-24">
          <Grid item xs={12}>
            <div className="flex-container flex-container--start">
              {!loading && (
                <div className="table-handler-flex mr-8">
                  <FormControl>
                    <InputLabel id="select-role">Role</InputLabel>
                    <Select
                      size="small"
                      labelId="select-role"
                      id="select-role"
                      value={role}
                      label="Role"
                      onChange={(e) => handleChangeRole(e)}
                    >
                      <MenuItem value={'all'}>All</MenuItem>
                      {itemsRole !== null &&
                        itemsRole.length &&
                        itemsRole.map((dtrole, index) => (
                          <MenuItem key={index} value={dtrole.id}>
                            {dtrole.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </div>
              )}

              <div className="table-handler-flex w-fit mr-8">
                <FormControl fullWidth variant="outlined">
                  {/* <TextField
                  id="outlined-size-small"
                  value={tempSearch}
                  onChange={(e) => setTempSearch(e.target.value)}
                  onKeyDown={handleSearch}
                  size="small"
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
                ></TextField> */}
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

        <Grid container className="mt-24">
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
                    {!loading && items.length ? (
                      items.map((dt, indexTB) => (
                        <TableRow hover key={indexTB}>
                          <TableCell align="left">{dt.email}</TableCell>
                          <TableCell align="left">{dt.name}</TableCell>
                          <TableCell align="left">{dt.division}</TableCell>
                          <TableCell align="left">{dt.gender}</TableCell>
                          <TableCell align="left">
                            {dt.roles.length
                              ? dt.roles.map((dtRL, indexRL) => (
                                  <React.Fragment key={indexRL}>
                                    {dtRL.name}
                                    {indexRL !== dt.roles.length - 1 && ', '}
                                  </React.Fragment>
                                ))
                              : '-'}
                          </TableCell>
                          <TableCell align="center">
                            {/* <EditIcon></EditIcon> */}
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
            itemsRole={itemsRole}
            closeDialog={() => setDialogAdd(false)}
            refreshPage={refreshPage}
          ></DialogAdd>
        )}
      </Dialog>

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
            key={keyPhoto}
            meta={props.meta}
            itemsRole={itemsRole}
            selectData={selectData}
            permission={permission}
            closeDialog={closeDialogEdit}
            refreshPage={refreshPage}
          ></DialogEdit>
        )}
      </Dialog>
    </>
  )
}
