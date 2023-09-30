import React, { useState, useRef } from 'react'

import dayjs from 'dayjs'

import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'

import { Refresh as RefreshIcon } from '@mui/icons-material'

import { LoadingButton } from '@mui/lab'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import SimpleDatatable from '../../../utils/SimpleDatatable'

export default function Index(props) {
  const exList = useRef(['Example 1', 'Example 2', 'Example 3'])
  const header = useRef([
    {
      text: 'Size',
      align: 'left',
      sortable: false,
      value: 'name',
    },
    {
      text: 'POL',
      align: 'left',
      sortable: false,
      value: 'name',
    },
    {
      text: 'POD',
      align: 'left',
      sortable: false,
      value: 'name',
    },
    {
      text: 'TOS',
      align: 'left',
      sortable: false,
      value: 'name',
    },
    {
      text: 'Commodity',
      align: 'left',
      sortable: false,
      value: 'name',
    },
    {
      text: 'Price',
      align: 'left',
      sortable: false,
      value: 'name',
    },
    {
      text: 'Date',
      align: 'left',
      sortable: false,
      value: 'name',
    },
    {
      text: 'PPNP',
      align: 'left',
      sortable: false,
      value: 'name',
    },
    {
      text: 'Customer',
      align: 'left',
      sortable: false,
      value: 'name',
    },
    {
      text: 'Action',
      align: 'left',
      sortable: false,
      value: 'name',
    }
  ])

  const [size, setSize] = useState('')
  const [pol, setPol] = useState('')
  const [from, setFrom] = useState(dayjs())

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
                <TextField
                  name="shipper"
                  className="w-fit"
                  label="Shipper"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>
              <div className="table-handler-flex">
                <LoadingButton
                  variant="contained"
                  style={{
                    width: '150px',
                    height: '40px',
                  }}
                >
                  Pick Shipper
                </LoadingButton>
              </div>
            </div>
          </Grid>
        </Grid>

        <Grid container direction="row" className="mt-24">
          <Grid item xs={12}>
            <Grid container direction="row" spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl className="mt-16" fullWidth size="small">
                  <InputLabel id="demo-simple-select-error-label">
                    Size
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-error-label"
                    id="demo-simple-select-error"
                    label="Size"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                  >
                    <MenuItem value="">Select Size</MenuItem>
                    {exList.current !== null &&
                      exList.current.map((dtEL, indexEL) => (
                        <MenuItem value={dtEL} key={indexEL}>
                          {dtEL}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl className="mt-16" fullWidth size="small">
                  <InputLabel id="demo-simple-select-error-label">
                    POL
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-error-label"
                    id="demo-simple-select-error"
                    label="POL"
                    value={pol}
                    onChange={(e) => setPol(e.target.value)}
                  >
                    <MenuItem value="">Select POL</MenuItem>
                    {exList.current !== null &&
                      exList.current.map((dtEL, indexEL) => (
                        <MenuItem value={dtEL} key={indexEL}>
                          {dtEL}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl className="mt-16" fullWidth size="small">
                  <InputLabel id="demo-simple-select-error-label">
                    COC/SOC
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-error-label"
                    id="demo-simple-select-error"
                    label="COC/SOC"
                    value={pol}
                    onChange={(e) => setPol(e.target.value)}
                  >
                    <MenuItem value="">Select COC/SOC</MenuItem>
                    {exList.current !== null &&
                      exList.current.map((dtEL, indexEL) => (
                        <MenuItem value={dtEL} key={indexEL}>
                          {dtEL}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl className="mt-16" fullWidth size="small">
                  <InputLabel id="demo-simple-select-error-label">
                    POD
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-error-label"
                    id="demo-simple-select-error"
                    label="POD"
                    value={pol}
                    onChange={(e) => setPol(e.target.value)}
                  >
                    <MenuItem value="">Select POD</MenuItem>
                    {exList.current !== null &&
                      exList.current.map((dtEL, indexEL) => (
                        <MenuItem value={dtEL} key={indexEL}>
                          {dtEL}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    format="DD/MM/YYYY"
                    value={from}
                    onChange={(newValue) => setFrom(newValue)}
                    slotProps={{
                      textField: {
                        label: 'From',
                        size: 'small',
                        className: 'mt-16 w-fit',
                      },
                    }}
                    maxDate={dayjs()}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl className="mt-16" fullWidth size="small">
                  <InputLabel id="demo-simple-select-error-label">
                    TOS
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-error-label"
                    id="demo-simple-select-error"
                    label="TOS"
                    value={pol}
                    onChange={(e) => setPol(e.target.value)}
                  >
                    <MenuItem value="">Select TOS</MenuItem>
                    {exList.current !== null &&
                      exList.current.map((dtEL, indexEL) => (
                        <MenuItem value={dtEL} key={indexEL}>
                          {dtEL}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    format="DD/MM/YYYY"
                    value={from}
                    onChange={(newValue) => setFrom(newValue)}
                    slotProps={{
                      textField: {
                        label: 'To',
                        size: 'small',
                        className: 'mt-16 w-fit',
                      },
                    }}
                    maxDate={dayjs()}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  name="commodity"
                  className="w-fit mt-16"
                  label="Commodity"
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  name="ppnp"
                  className="w-fit mt-16"
                  label="PPNP"
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  name="price"
                  className="w-fit mt-16"
                  label="Price"
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  name="customer"
                  className="w-fit mt-16"
                  label="Customer"
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <p className="mt-16 font-18 font-bold">Exception Deal</p>

                <LoadingButton
                  color="success"
                  variant="contained"
                  style={{
                    height: '40px',
                  }}
                >
                  <RefreshIcon></RefreshIcon>
                </LoadingButton>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} className="mt-16">
            <LoadingButton className="w-fit" variant="contained" type="button">
              Save Rate
            </LoadingButton>
          </Grid>
        </Grid>

        <Grid container direction="row" className="mt-24">
          <Grid item xs={12}>
            <SimpleDatatable header={header.current}>

            </SimpleDatatable>
          </Grid>
        </Grid>
      </div>
    </>
  )
}
