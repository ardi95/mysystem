import React from 'react';
import {
  Route,
  withRouter
} from "react-router-dom";

const GlobalRoute = ({ noGlobal, component: Component, restricted, ...rest }) => {
  return (
    <Route {...rest} render={props => {
      return (
        <>
          <Component {...props} />
        </>
      )
    }} />
  )
}

export default withRouter(GlobalRoute);