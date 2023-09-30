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
  Close,
  Search as SearchIcon,
  Edit as EditIcon,
} from '@mui/icons-material'

import { permissionByMenu } from '../../../service/auth'
import { list } from '../../../service/AppManagement/role'
import { list as listMenu } from '../../../service/AppManagement/menu'
import { allstructure } from '../../../service/AppManagement/rolemenu'

import SimpleDatatable from '../../../utils/SimpleDatatable'
import DialogStructure from './DialogStructure'
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
  const [dialogEdit, setDialogEdit] = useState(false)
  const [dialogStructure, setDialogStructure] = useState(false)

  const [search, setSearch] = useState('')
  const [tempSearch, setTempSearch] = useState('')

  const [structureMenu, setStructureMenu] = useState([])
  const [dataMenu, setDataMenu] = useState([])
  const [items, setItems] = useState([])

  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [total, setTotal] = useState(0)
  const [sortField, setSortField] = useState({
    column: '',
    dir: '',
  })
  const [page, setPage] = useState(1)

  const [selectData, setSelectData] = useState(null)

  const handleChangeRowsPerPage = async (event) => {
    await setItemsPerPage(parseInt(event.target.value, 10))
    await setPage(1)
  }

  const getSearch = async () => {
    await setSearch(tempSearch)
    await setPage(1)
  }

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      getSearch()
    }
  }

  const handleClickClear = async () => {
    await setTempSearch('')
    await setSearch('')
    await setPage(1)
  }

  const handleMouseDown = (event) => {
    event.preventDefault()
  }

  const changeSort = async (data) => {
    await setSortField(data)
    await setPage(1)
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
      key: 'rolemenu',
    }

    permissionByMenu(params)
      .then(({ data }) => {
        setPermission(data)
      })
      .catch(() => {})
  }

  const fetchStructureMenu = () => {
    allstructure()
      .then(({ data }) => {
        setStructureMenu(data)
      })
      .catch(() => {})
  }

  const fetchDataMenu = () => {
    let params = {
      per_page: 1000,
      page: 1,
      order_field: 'id',
      order_dir: 'asc',
    }

    listMenu(params)
      .then(({ data }) => {
        setDataMenu(data)
      })
      .catch(() => {})
  }

  useEffect(() => {
    checkPermission()
    fetchStructureMenu()
    fetchDataMenu()
  }, [])

  // useEffect(() => {
  //   console.log('masuk sini 2')
  //   fetchData()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [page])

  useEffect(() => {
    ;(async () => {
      // await refreshPage()
      await fetchData()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, itemsPerPage, search, sortField])

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

              <div className="table-handler-flex">
                {structureMenu.length > 0 && (
                  <LoadingButton
                    onClick={() => setDialogStructure(true)}
                    variant="contained"
                    style={{ height: '40px', width: '180px' }}
                    loading={loading}
                  >
                    Structure Menu
                  </LoadingButton>
                )}
              </div>
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
                      items.map((dt, index) => (
                        <TableRow hover key={index}>
                          <TableCell align="left">{dt.name}</TableCell>
                          <TableCell align="center">
                            {permission.update === true &&
                              dataMenu.data.length > 0 && (
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
        open={dialogStructure}
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
        {dialogStructure && (
          <DialogStructure
            structureMenu={structureMenu}
            closeDialog={() => setDialogStructure(false)}
          ></DialogStructure>
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
              '& .MuiDialogContent-root': {
                padding: '0px'
              },
            },
          },
        }}
      >
        {dialogEdit && selectData !== null && (
          <DialogEdit
            meta={props.meta}
            selectData={selectData}
            dataMenu={dataMenu}
            closeDialog={closeDialogEdit}
            refreshPage={refreshPage}
          ></DialogEdit>
        )}
      </Dialog>
    </>
  )
}
