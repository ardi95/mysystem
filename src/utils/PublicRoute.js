import React from 'react'
import { Route, withRouter, useHistory } from 'react-router-dom'

import { profile } from '../service/auth'

const PublicRoute = ({
  noGlobal,
  component: Component,
  restricted,
  ...rest
}) => {
  let history = useHistory()
  const getCookie = (name) => {
    var dc = document.cookie
    var prefix = name + '='
    var begin = dc.indexOf('; ' + prefix)
    if (begin === -1) {
      begin = dc.indexOf(prefix)
      if (begin !== 0) return null
    } else {
      begin += 2
      var end = document.cookie.indexOf(';', begin)
      if (end === -1) {
        end = dc.length
      }
    }
    // because unescape has been deprecated, replaced with decodeURI
    //return unescape(dc.substring(begin + prefix.length, end));
    return decodeURI(dc.substring(begin + prefix.length, end))
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        if (getCookie('login_access_token')) {
          profile()
            .then(() => {
              history.push('/home')
            })
            .catch(() => {})
        } else {
          return <Component {...props} />
        }
      }}
    />
  )
}

export default withRouter(PublicRoute)
