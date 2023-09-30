import React, { Suspense, lazy } from 'react'

import { Switch } from 'react-router-dom'

import './App.scss'

import { GlobalProvider } from './AppContext'

import GlobalRoute from './utils/GlobalRoute'
import PublicRoute from './utils/PublicRoute'
import PrivateRoute from './utils/PrivateRoute'

import Login from './views/Login'

import { metaRoute } from './utils/tools'

const Home = lazy(() => import('./views/Home'))
const Users = lazy(() => import('./views/AppManagement/Users/Index'))
const Menu = lazy(() => import('./views/AppManagement/Menu/Index'))
const Role = lazy(() => import('./views/AppManagement/Role/Index'))
const RoleMenu = lazy(() => import('./views/AppManagement/RoleMenu/Index'))

const HistoryRateCustomer = lazy(() =>
  import('./views/Setup/HistoryRateCustomer/Index')
)

const Debtur = lazy(() => import('./views/Setup/Debtur/Index'))

const NotFound = lazy(() => import('./views/NotFound'))

function App() {
  return (
    <GlobalProvider>
      <div className="App">
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <PublicRoute exact path="/" component={Login} />
            <PublicRoute exact path="/login" component={Login} />
            <PrivateRoute
              exact
              path="/home"
              component={Home}
              meta={metaRoute().home}
            />
            <PrivateRoute
              exact
              path="/app-management/users"
              component={Users}
              meta={metaRoute().users}
            />
            <PrivateRoute
              exact
              path="/app-management/menus"
              component={Menu}
              meta={metaRoute().menu}
            />

            <PrivateRoute
              exact
              path="/app-management/roles"
              component={Role}
              meta={metaRoute().role}
            />

            <PrivateRoute
              exact
              path="/app-management/role-menu"
              component={RoleMenu}
              meta={metaRoute().rolemenu}
            />

            <PrivateRoute
              exact
              path="/setup/history-rate-customer"
              component={HistoryRateCustomer}
              meta={metaRoute().historyratecustomer}
            />

            <PrivateRoute
              exact
              path="/setup/debtur"
              component={Debtur}
              meta={metaRoute().debtur}
            />

            <GlobalRoute path="/" component={NotFound} />
          </Switch>
        </Suspense>
      </div>
    </GlobalProvider>
  )
}

export default App
