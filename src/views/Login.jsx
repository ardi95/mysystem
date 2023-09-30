import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import Cookies from 'universal-cookie'

import {
  TextField,
  InputAdornment,
  //OutlinedInput,
  IconButton,
  Grid,
} from '@mui/material'

import { Visibility, VisibilityOff } from '@mui/icons-material'

import LoadingButton from '@mui/lab/LoadingButton'

import { login } from '../service/auth'

let cookies = new Cookies()

const Login = () => {
  const history = useHistory()

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required('Email is required')
        .email('Must e-mail format'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: ({ email, password }) => {
      setLoading(true)

      const formData = {
        email,
        password,
      }

      formik.resetForm()

      login(formData)
        .then(({ data }) => {
          cookies.set('login_access_token', `Bearer ${data.token}`, {
            path: '/',
            maxAge: 18000,
          })

          cookies.set('accesstoken', `${data.token}`, {
            path: '/',
            maxAge: 18000,
          })

          history.push('/home')
        })
        .catch((err) => {})
        .finally(() => setLoading(false))
    },
  })

  return (
    <div className="customP">
      <Grid container direction="row">
        <Grid item md={6}>
          <div
            className="pos-relative background-no-repeat background-position-center background-size-cover"
            style={{
              height: '100vh',
              backgroundImage: `url("/static/img/logo.png")`,
            }}
          ></div>
        </Grid>
        <Grid
          item
          md={6}
          xs={12}
          className="px-24 pb-12 pos-relative background-no-repeat background-position-center background-size-cover background-none-mobile"
          style={{
            paddingTop: '25vh',
            height: '100vh',
            backgroundImage: `url("/static/img/logo.png")`,
          }}
        >
          <div className="box-custom p-16 radius-10 color-white-bg">
            <img
              className="height-auto"
              src="/static/img/logo2.png"
              alt="logo samudera"
              style={{ width: '200px' }}
            />

            <p className="mt-24 font-24 font-bold">Sign In</p>

            {/* {JSON.stringify(formik)} */}

            <form className="mt-24" onSubmit={formik.handleSubmit}>
              <TextField
                name="email"
                error={
                  formik.touched.email && formik.errors.email ? true : false
                }
                onChange={formik.handleChange}
                value={formik.values.email}
                className="w-fit"
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

              <TextField
                error={
                  formik.touched.password && formik.errors.password
                    ? true
                    : false
                }
                onChange={formik.handleChange}
                value={formik.values.password}
                className="w-fit mt-16"
                label="Password"
                variant="outlined"
                size="small"
                type={showPassword ? 'text' : 'password'}
                helperText={
                  formik.touched.password && formik.errors.password
                    ? formik.errors.password
                    : ' '
                }
                {...formik.getFieldProps('password')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <LoadingButton
                loading={loading}
                variant="contained"
                type="submit"
                className="mt-16"
                disabled={!formik.isValid || !formik.dirty ? true : false}
              >
                {loading ? 'Loading...' : 'LOGIN NOW!'}
              </LoadingButton>

              {/* {JSON.stringify(formik)} */}
            </form>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default Login
