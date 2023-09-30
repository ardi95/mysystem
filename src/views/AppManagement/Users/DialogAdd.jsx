import React, { useState, useRef } from 'react'

import dayjs from 'dayjs'

import {
  DialogContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  // OutlinedInput,
  MenuItem,
  // Checkbox,
  // ListItemText,
  // Box,
  // Chip,
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

import { add } from '../../../service/AppManagement/users'

const MySwal = withReactContent(Swal)

// const ITEM_HEIGHT = 48
// const ITEM_PADDING_TOP = 8
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// }

export default function DialogAdd(props) {
  const currentDate = dayjs()

  const hiddenFileInput = useRef(null)

  // const listGender = useRef(['Pria', 'Wanita'])

  const listDivision = useRef(['Divisi 1', 'Divisi 2', 'Divisi 3'])

  const [loading, setLoading] = useState(false)
  // const [role, setRole] = useState([])
  const [gender, setGender] = useState('Male')
  const [birthdate, setBirthdate] = useState(dayjs())

  const [photo, setPhoto] = useState(null)
  const [photoUrl, setPhotoUrl] = useState('/static/img/userdefault2.png')

  // const handleChange = (event) => {
  //   const {
  //     target: { value },
  //   } = event
  //   setRole(
  //     // On autofill we get a stringified value.
  //     typeof value === 'string' ? value.split(',') : value
  //   )
  // }

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
        setPhotoUrl(reader.result)
        setPhoto(fileUploaded)
      })
    }
  }

  const handleDeleteImage = () => {
    setPhoto(null)
    setPhotoUrl('/static/img/userdefault2.png')
    hiddenFileInput.current.value = null
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      name: '',
      division: '',
      role_id: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required('Email is required')
        .email('Must e-mail format'),
      name: Yup.string().required('Name is required'),
      division: Yup.string().required('Division is required'),
      role_id: Yup.string().required('Role is required'),
    }),
    onSubmit: ({ email, name, division, role_id }) => {
      setLoading(true)

      // const formData = {
      //   email,
      //   name,
      //   password: 'samudera123',
      //   role: roleArray,
      //   gender,
      //   division,
      //   birthdate: dayjs(birthdate).format('YYYY-MM-DD'),
      // }

      let formData = new FormData()
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', 'samudera123')
      formData.append('role_id', role_id)
      formData.append('gender', gender)
      formData.append('division', division)
      formData.append('birthdate', dayjs(birthdate).format('YYYY-MM-DD'))

      // if (role.length > 0) {
      //   role.forEach((dt, indexKey) => {
      //     formData.append(`role[${indexKey}]`, dt)
      //   })
      // }

      if (photo !== null) {
        formData.append('photo', photo)
      }

      add(formData)
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

  // useEffect(() => {
  //   const temp = dayjs(birthdate).format('YYYY-MM-DD')
  //   console.log('birthdate', temp);
  // }, [birthdate]);

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
                disabled={
                  (!formik.isValid || !formik.dirty ? true : false) ||
                  birthdate.isAfter(currentDate)
                }
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

              <TextField
                name="email"
                error={
                  formik.touched.email && formik.errors.email ? true : false
                }
                onChange={formik.handleChange}
                value={formik.values.email}
                className="w-fit mt-16"
                label="Email"
                variant="outlined"
                size="small"
                helperText={
                  formik.touched.email && formik.errors.email
                    ? formik.errors.email
                    : ' '
                }
                {...formik.getFieldProps('email')}
              />

              {/* <FormControl
                className="mt-16"
                fullWidth
                size="small"
                error={
                  formik.touched.gender && formik.errors.gender ? true : false
                }
              >
                <InputLabel id="demo-simple-select-error-label">
                  Jenis Kelamin
                </InputLabel>
                <Select
                  labelId="demo-simple-select-error-label"
                  id="demo-simple-select-error"
                  value={formik.values.gender}
                  label="Jenis Kelamin"
                  onChange={formik.handleChange}
                  {...formik.getFieldProps('gender')}
                >
                  <MenuItem value="">Select Gender</MenuItem>
                  {listGender.current !== null &&
                    listGender.current.map((dtLG, indexLG) => (
                      <MenuItem value={dtLG} key={indexLG}>
                        {dtLG}
                      </MenuItem>
                    ))}
                </Select>
                <FormHelperText>
                  {formik.touched.gender && formik.errors.gender
                    ? formik.errors.gender
                    : ' '}
                </FormHelperText>
              </FormControl> */}

              <FormControl>
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
                  <FormControlLabel
                    value="Male"
                    control={<Radio />}
                    label="Male"
                  />
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
                  formik.touched.division && formik.errors.division
                    ? true
                    : false
                }
              >
                <InputLabel id="demo-simple-select-error-label">
                  Division
                </InputLabel>
                <Select
                  labelId="demo-simple-select-error-label"
                  id="demo-simple-select-error"
                  value={formik.values.division}
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
                      label: 'Birthdate',
                      size: 'small',
                      className: 'mt-16 w-fit',
                    },
                  }}
                  maxDate={dayjs()}
                />
              </LocalizationProvider>

              <FormControl
                className="mt-16"
                fullWidth
                size="small"
                error={
                  formik.touched.role_id && formik.errors.role_id ? true : false
                }
              >
                <InputLabel id="demo-simple-select-error-label">
                  Role
                </InputLabel>
                <Select
                  labelId="demo-simple-select-error-label"
                  id="demo-simple-select-error"
                  value={formik.values.role_id}
                  label="Role"
                  onChange={formik.handleChange}
                  {...formik.getFieldProps('role_id')}
                >
                  <MenuItem value="">Select Role</MenuItem>
                  {props.itemsRole !== null &&
                    props.itemsRole.map((dtIR, indexIR) => (
                      <MenuItem value={dtIR.id} key={indexIR}>
                        {dtIR.name}
                      </MenuItem>
                    ))}
                </Select>
                <FormHelperText>
                  {formik.touched.role_id && formik.errors.role_id
                    ? formik.errors.role_id
                    : ' '}
                </FormHelperText>
              </FormControl>

              {/* <FormControl className="w-fit mt-16" size="small">
                <InputLabel id="demo-multiple-checkbox-label">Role</InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={role}
                  onChange={handleChange}
                  input={<OutlinedInput label="Role" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.length &&
                        selected.map((id) => {
                          let newRole = props.itemsRole.filter(
                            (dtrl) => dtrl.id === id
                          )

                          return <Chip key={id} label={newRole[0].name} />
                        })}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {props.itemsRole !== null &&
                    props.itemsRole.map((dt, index) => (
                      <MenuItem key={index} value={dt.id}>
                        <Checkbox checked={role.indexOf(dt.id) > -1} />
                        <ListItemText primary={dt.name} />
                      </MenuItem>
                    ))}
                </Select>
              </FormControl> */}

              <div className="d-flex align-start mt-16">
                <input
                  ref={hiddenFileInput}
                  type="file"
                  accept="image/png"
                  onChange={handleChangeFile}
                  style={{ display: 'none' }}
                />

                <div className="d-inline-block uploadCustom mr-4">
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

                <div className="d-inline-block">
                  <p className="font-18 font-bold">Image</p>
                  <p>Image extension .png</p>
                  <p>Max 5MB</p>
                  <p>Recommend size: 128px x 128px</p>

                  {photoUrl !== '/static/img/userdefault2.png' && (
                    <LoadingButton
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
        </form>
      </div>
    </DialogContent>
  )
}
