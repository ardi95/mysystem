import React, { useState, useEffect, useRef } from 'react'

import dayjs from 'dayjs'

import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material'

import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'

import { LoadingButton } from '@mui/lab'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { profile, update } from '../../service/auth'
import { getFile } from '../../service/AppManagement/users'

const MySwal = withReactContent(Swal)

export default function UpdateProfile(props) {
  const currentDate = dayjs()

  const hiddenFileInput = useRef(null)
  const listDivision = useRef(['Divisi 1', 'Divisi 2', 'Divisi 3'])

  const [loading, setLoading] = useState(false)
  // const [role, setRole] = useState([])
  const [gender, setGender] = useState('Male')
  const [birthdate, setBirthdate] = useState(dayjs())

  const [photo, setPhoto] = useState(null)
  const [photoUrl, setPhotoUrl] = useState('/static/img/userdefault2.png')
  const [status_photo, setStatusPhoto] = useState(0)

  const [initialValues, setIntialValues] = useState({
    name: '',
    division: '',
  })

  const [lookImage, setLookImage] = useState(false)

  const handleClick = () => {
    hiddenFileInput.current.click()
  }

  const handleChangeFile = (event) => {
    if (event.target.files[0]) {
      //data gambar
      const fileUploaded = event.target.files[0]

      //data sementara
      const reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])

      reader.addEventListener('load', () => {
        setStatusPhoto(1)
        setPhotoUrl(reader.result)
        setPhoto(fileUploaded)
      })
    }
  }

  const handleDeleteImage = () => {
    setStatusPhoto(1)
    setPhoto(null)
    setPhotoUrl('/static/img/userdefault2.png')
    hiddenFileInput.current.value = null
  }

  const fetchData = () => {
    profile()
      .then(({ data }) => {
        const { id, name, gender, division, birthdate, photo } = data.user

        setIntialValues({
          name,
          division,
        })

        setGender(gender)
        setBirthdate(dayjs(birthdate))

        if (photo !== null) {
          const tempPhotoUrl = getFile(id)

          setPhotoUrl(tempPhotoUrl)
        }

        setTimeout(() => {
          setLookImage(true)
          setLoading(false)
        }, 500)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      division: Yup.string().required('Division is required'),
    }),
    onSubmit: ({ name, division }) => {
      setLoading(true)

      let formData = new FormData()
      formData.append('name', name)
      formData.append('gender', gender)
      formData.append('division', division)
      formData.append('birthdate', dayjs(birthdate).format('YYYY-MM-DD'))
      formData.append('status_photo', status_photo)
      formData.append('_method', 'PATCH')

      if (photo !== null) {
        formData.append('photo', photo)
      }

      update(formData)
        .then(({ data }) => {
          setLoading(true)

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

    fetchData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container direction="row" className="mt-24">
        <Grid item xs={12} md={8}>
          <TextField
            name="name"
            error={formik.touched.name && formik.errors.name ? true : false}
            onChange={formik.handleChange}
            value={formik.values.name}
            className="w-fit"
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

          <FormControl className="mt-16">
            <FormLabel id="demo-row-radio-buttons-group-label">
              Gender
            </FormLabel>
            <RadioGroup
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel value="Male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="Female"
                control={<Radio />}
                label="Female"
              />
            </RadioGroup>
          </FormControl>

          <FormControl
            className="mt-16"
            fullWidth
            size="small"
            error={
              formik.touched.division && formik.errors.division ? true : false
            }
          >
            <InputLabel id="select-division">Division</InputLabel>
            <Select
              labelId="select-division"
              id="select-division-s"
              value={formik.values.division ?? ' '}
              label="Division"
              onChange={formik.handleChange}
              {...formik.getFieldProps('division')}
            >
              <MenuItem value="">Select Division</MenuItem>
              {listDivision.current !== null &&
                listDivision.current.map((dtLD, indexLD) => (
                  <MenuItem value={dtLD} key={indexLD}>
                    {dtLD}
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText>
              {formik.touched.division && formik.errors.division
                ? formik.errors.division
                : ' '}
            </FormHelperText>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              format="DD/MM/YYYY"
              value={birthdate}
              onChange={(newValue) => setBirthdate(newValue)}
              slotProps={{
                textField: {
                  label: 'Tanggal Lahir',
                  size: 'small',
                  className: 'mt-16 w-fit',
                },
              }}
              maxDate={dayjs()}
            />
          </LocalizationProvider>

          <div className="d-flex align-start mt-16">
            <input
              ref={hiddenFileInput}
              type="file"
              accept="image/png"
              onChange={handleChangeFile}
              style={{ display: 'none' }}
            />

            {lookImage && (
              <div className="d-inline-block uploadCustom mr-16">
                <div
                  onClick={handleClick}
                  className="exImg cursor-pointer radius-8"
                  style={{
                    backgroundImage: `url(${photoUrl})`,
                    width: '128px',
                    height: '128px',
                  }}
                >
                  <div className="overlay radius-8">
                    <EditIcon className="exIcon color-white"></EditIcon>
                  </div>
                </div>
              </div>
            )}

            <div className="d-inline-block">
              <p className="font-18 font-bold">Image</p>
              <p>Image extension .png</p>
              <p>Max 5MB</p>
              <p>Recommend size: 128px x 128px</p>

              {photoUrl !== '/static/img/userdefault2.png' && (
                <LoadingButton
                  className="mt-8"
                  type="button"
                  variant="contained"
                  onClick={handleDeleteImage}
                  color="error"
                  loading={loading}
                  startIcon={<DeleteIcon />}
                >
                  Delete Image
                </LoadingButton>
              )}
            </div>
          </div>
        </Grid>
      </Grid>

      <Grid container direction="row" className="mt-24">
        <Grid item xs={12} className="text-right">
          <LoadingButton
            variant="outlined"
            onClick={() => props.changePassword()}
            className="mr-8 mb-8"
            loading={loading}
          >
            Change Password
          </LoadingButton>

          <LoadingButton
            className="mr-8 mb-8"
            variant="contained"
            loading={loading}
            type="submit"
            disabled={
              !formik.isValid ? true : false || birthdate.isAfter(currentDate)
            }
          >
            Save
          </LoadingButton>
        </Grid>
      </Grid>
    </form>
  )
}
