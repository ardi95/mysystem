import React from 'react'
import { Route, withRouter, Redirect } from 'react-router-dom'

import Header from '../layout/Header'

const getCookie = (name) => {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin === -1) {
    begin = dc.indexOf(prefix);
    if (begin !== 0) return null;
  }
  else {
    begin += 2;
    var end = document.cookie.indexOf(";", begin);
    if (end === -1) {
      end = dc.length;
    }
  }
  // because unescape has been deprecated, replaced with decodeURI
  //return unescape(dc.substring(begin + prefix.length, end));
  return decodeURI(dc.substring(begin + prefix.length, end));
}

const PrivateRoute = ({
  noGlobal,
  component: Component,
  restricted,
  meta,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props =>
        getCookie('login_access_token') ? (
          <>
            <Header>
              {<Component {...props} meta={meta} />}
            </Header>
          </>
        ) : (
          <Redirect
            to="/"
          />
        )
      }
    />
  )
}

export default withRouter(PrivateRoute)
