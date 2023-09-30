import React, { useState, useEffect } from 'react'

import { Grid } from '@mui/material'

import { home } from '../service/home'

export default function HomePage() {
  const [loading, setLoading] = useState(false)
  const [dataFetch, setDataFetch] = useState(null)

  useEffect(() => {
    setLoading(true)
    setDataFetch(null)

    home()
      .then(({ data }) => {
        setDataFetch(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="customP">
      <Grid container spacing={2}>
        {!loading && dataFetch !== null && dataFetch.status_user === true && (
          <Grid item xs={12} sm={6} lg={4}>
            <div className="radius-10 p-16 color-base-bg">
              <p className="font-bold color-white font-24">
                {dataFetch.count_user}
              </p>

              <p className="color-white mt-16">Users</p>
            </div>
          </Grid>
        )}

        {!loading && dataFetch !== null && dataFetch.status_menu === true && (
          <Grid item xs={12} sm={6} lg={4}>
            <div className="radius-10 p-16 color-base-bg">
              <p className="font-bold color-white font-24">
                {dataFetch.count_menu}
              </p>

              <p className="color-white mt-16">Menu</p>
            </div>
          </Grid>
        )}

        {!loading && dataFetch !== null && dataFetch.status_role === true && (
          <Grid item xs={12} sm={6} lg={4}>
            <div className="radius-10 p-16 color-base-bg">
              <p className="font-bold color-white font-24">
                {dataFetch.count_role}
              </p>

              <p className="color-white mt-16">Role</p>
            </div>
          </Grid>
        )}
      </Grid>
    </div>
  )
}
