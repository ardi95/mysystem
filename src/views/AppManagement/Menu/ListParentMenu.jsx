import React, { useState, useEffect, useRef } from 'react'

import {
  Grid,
  TableBody,
  TableRow,
  TableCell,
  FormControl,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@mui/material'

import { Close, Search as SearchIcon } from '@mui/icons-material'

import { list } from '../../../service/AppManagement/menu'

import SimpleDatatable from '../../../utils/SimpleDatatable'

export default function ListParentMenu(props) {
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState('')
  const [tempSearch, setTempSearch] = useState('')

  const header = useRef([
    {
      text: 'Name',
      align: 'left',
      sortable: true,
      value: 'name',
    },
    {
      text: 'URL',
      align: 'left',
      sortable: true,
      value: 'url',
    },
  ])

  const [items, setItems] = useState([])

  const itemsPerPageOptions = useRef([5, 10, 25])

  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [total, setTotal] = useState(0)
  const [sortField, setSortField] = useState({
    column: '',
    dir: '',
  })
  const [page, setPage] = useState(1)

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

  const clickRowTable = (data) => {
    props.clickRowTable(data)
  }

  useEffect(() => {
    refreshPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsPerPage, search, sortField])

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  return (
    <Grid container direction="row" className="mt-16">
      <Grid item md={12}>
        <FormControl fullWidth variant="outlined" className="mb-16">
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
                    <TableRow
                      hover
                      key={index}
                      onClick={() => clickRowTable(dt)}
                      className="cursor-pointer"
                    >
                      <TableCell align="left">{dt.name}</TableCell>
                      <TableCell align="left">
                        {dt.url !== null || dt.url !== '' ? dt.url : '-'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={header.current.length}>
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
  )
}
