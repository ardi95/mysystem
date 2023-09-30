import React, { useState, useEffect, useRef } from 'react'

import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  // TablePagination,
  Pagination,
  Grid,
} from '@mui/material'

import { ArrowDownward, ArrowUpward } from '@mui/icons-material'

export default function SimpleDatatable(props) {
  const [loading, setLoading] = useState(false)

  const header = useRef(props.header)

  const [total, setTotal] = useState(0)
  const itemsPerPageOptions = useRef(props.itemsPerPageOptions)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [page, setPage] = useState(1)
  const [minWidth, setMinWidth] = useState('auto')

  const [sortField, setSortField] = useState({
    column: '',
    dir: '',
  })

  const handleChangePage = (event, newPage) => {
    props.handleChangePage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    props.handleChangeRowsPerPage(event)
    // setItemsPerPage(parseInt(event.target.value, 10))
    // setPage(0)
  }

  const clickSort = (e) => {
    let field = e.currentTarget.getAttribute('data-field')

    let column = ''
    let dir = ''

    if (sortField.column === field) {
      if (sortField.dir === 'asc') {
        column = field
        dir = 'desc'
      } else if (sortField.dir === 'desc') {
        column = ''
        dir = ''
      } else {
        column = field
        dir = 'asc'
      }
    } else {
      column = field
      dir = 'asc'
    }

    setSortField({
      column,
      dir,
    })

    props.changeSort({
      column,
      dir,
    })
  }

  const ThSDT = ({ text, value, sortable, align }) => {
    if (sortable === true) {
      return (
        <TableCell
          align={align}
          className={`${sortable && 'cursor-pointer'} align-items-center`}
          data-field={value}
          onClick={clickSort}
        >
          <div className="d-inline-flex align-items-center">
            {sortField.column === value ? (
              sortField.dir === 'asc' ? (
                <ArrowUpward className="font-14"></ArrowUpward>
              ) : (
                <ArrowDownward className="font-14"></ArrowDownward>
              )
            ) : (
              ''
            )}
            <div className="font-bold">{text}</div>
          </div>
        </TableCell>
      )
    } else {
      return (
        <TableCell
          align={align}
          className={`${
            sortable && 'cursor-pointer'
          } align-items-center font-bold`}
          data-field={value}
        >
          {text}
        </TableCell>
      )
    }
  }

  useEffect(() => {
    setLoading(props.loading)
    if (props.total !== undefined) setTotal(props.total)
    if (props.page !== undefined) setPage(props.page)
    if (props.itemsPerPage !== undefined) setItemsPerPage(props.itemsPerPage)
    if (props.minWidth !== undefined) setMinWidth(props.minWidth)
  }, [props])

  return (
    <Paper sx={{ width: '100%' }}>
      <TableContainer>
        <Table sx={{ minWidth }} size={'small'}>
          <TableHead>
            <TableRow>
              {header.current &&
                header.current.map((dth, indexH) => (
                  <ThSDT
                    key={indexH}
                    text={dth.text}
                    value={dth.value}
                    sortable={dth.sortable}
                    align={dth.align}
                  ></ThSDT>
                ))}
            </TableRow>
          </TableHead>

          {props.children}
        </Table>
      </TableContainer>

      {/* {!loading && total !== 0 && (
        <TablePagination
          rowsPerPageOptions={itemsPerPageOptions.current}
          component="div"
          count={total}
          rowsPerPage={itemsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )} */}

      {!loading && total !== 0 && (props.hiddenPagination === undefined || props.hiddenPagination !== true) && (
        <Grid container direction="row" alignItems="center" className="p-8">
          <Grid item md={3}>
            <label>
              Show
              <select
                data-testid="change-perpage"
                value={itemsPerPage}
                onChange={handleChangeRowsPerPage}
                className="mx-4"
              >
                {itemsPerPageOptions.current.map((dt, index) => (
                  <option key={index} value={dt}>
                    {dt}
                  </option>
                ))}
              </select>
              Entries
            </label>
          </Grid>
          
          <Grid item md={9}>
            <Pagination
              count={total}
              page={page}
              onChange={handleChangePage}
              className="cusPagination"
            />
          </Grid>
        </Grid>
      )}
    </Paper>
  )
}
