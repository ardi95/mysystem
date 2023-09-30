import React, { useState, useEffect } from 'react'
import { useLocation, Link as RouterLink, useHistory } from 'react-router-dom'
import Cookies from 'universal-cookie'

import { styled } from '@mui/material/styles'
// import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
// import CssBaseline from '@mui/material/CssBaseline'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import { Avatar, Button, Collapse, SwipeableDrawer, Dialog } from '@mui/material'
import {
  Home,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { useGlobal } from '../AppContext'

import { profile, logout } from '../service/auth'
import { getFile } from '../service/AppManagement/users'

import { dataWarningSA } from '../utils/tools'

import Profile from '../views/Profile/Index'

const MySwal = withReactContent(Swal)

const drawerWidth = 240

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}))

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `0px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 239,
    }),
  }),
);

const RecursiveNestedList = ({ items }) => {
  const location = useLocation()

  const [openSubitems, setOpenSubitems] = useState([])

  const handleSubitemToggle = (index) => {
    if (openSubitems.includes(index)) {
      setOpenSubitems(openSubitems.filter((i) => i !== index))
    } else {
      setOpenSubitems([...openSubitems, index])
    }
  }

  return (
    <List>
      {items.map((item, index) => (
        <div key={index}>
          {item.submenus.length !== 0 ? (
            <>
              <ListItem button onClick={() => handleSubitemToggle(index)}>
                <ListItemText primary={item.name} />
                {openSubitems.includes(index) ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              {item.submenus && (
                <Collapse
                  in={openSubitems.includes(index)}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    <RecursiveNestedList items={item.submenus} />
                  </List>
                </Collapse>
              )}
            </>
          ) : (
            <ListItem
              button
              component={RouterLink}
              to={item.url !== null ? item.url : ''}
              disablePadding
            >
              <ListItemButton selected={location.pathname === item.url}>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          )}
        </div>
      ))}
    </List>
  )
}

const Header = (props) => {
  const { profileGlobal, addProfileGlobal } = useGlobal()

  const cookies = new Cookies()
  const location = useLocation()
  let history = useHistory()

  const [dialogProfile, setDialogProfile] = useState(false)

  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(true)
  const [open2, setOpen2] = useState(false)
  const [photo, setPhoto] = useState(null)

  const stringAvatar = (name) => {
    return {
      sx: {
        bgcolor: '#fe0000',
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    }
  }

  const fetchData = () => {
    profile()
      .then(({ data }) => {
        setLoading(true)

        addProfileGlobal(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const submitLogout = () => {
    const data = {
      title: 'Logout',
      html: `Are you sure you want to log out?`,
      confirmButtonText: 'Yes, Logout',
    }

    MySwal.fire(dataWarningSA(data)).then((result) => {
      if (result.isConfirmed) {
        setLoading(true)

        logout()
          .then(() => {
            cookies.remove('login_access_token')
            history.push('/')
          })
          .catch((err) => {})
          .finally(() => setLoading(false))
      }
    })
  }

  const refreshPage = () => {
    fetchData()
  }

  const CustomDrawer = () => {
    return (
      <>
        <DrawerHeader className="justify-content-flex-start">
          {!loading &&
            profileGlobal !== null &&
            profileGlobal.user.photo === null &&
            profileGlobal.user.name !== null && (
              <Avatar
                {...stringAvatar(profileGlobal.user.name)}
                className="mr-16"
              />
            )}

          {!loading &&
            profileGlobal !== null &&
            profileGlobal.user.photo !== null &&
            profileGlobal.user.name !== null &&
            photo !== null && (
              <Avatar
                alt={profileGlobal.user.name}
                src={photo}
                className="mr-16"
              />
            )}
          <span className="font-16 font-bold string-no-space">
            {loading
              ? 'Loading...'
              : profileGlobal === null
              ? 'No Data'
              : profileGlobal.user.name}
            {!loading && (
              <div>
                <Button className="px-null text-transform-none" variant="text" onClick={() => setDialogProfile(true)}>
                  Edit Profile
                </Button>
              </div>
            )}
          </span>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem button component={RouterLink} to="/home" disablePadding>
            <ListItemButton selected={location.pathname === '/home'}>
              <ListItemIcon>
                <Home></Home>
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider />
        {!loading && profileGlobal !== null && (
          <RecursiveNestedList items={profileGlobal.menu} />
        )}
      </>
    )
  }

  useEffect(() => {
    setLoading(true)

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setPhoto(null)
    if (profileGlobal !== null && profileGlobal.user.photo !== null) {
      const tempPhotoUrl = getFile(profileGlobal.user.id)

      setPhoto(tempPhotoUrl)
    }
  }, [profileGlobal])

  return (
    <>
      {/* Desktop */}
      <AppBar
        sx={{
          display: {
            xs: 'none',
            sm: 'none',
            md: 'flex',
          },
        }}
        position="fixed"
        open={open}
      >
        <Toolbar className="color-base-bg">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(!open)}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Samudera Indonesia
          </Typography>

          <Button
            color="inherit"
            onClick={submitLogout}
            disabled={loading}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      {/* Mobile */}
      <AppBar
        sx={{
          display: {
            xs: 'flex',
            sm: 'flex',
            md: 'none',
          },
        }}
        position="fixed"
      >
        <Toolbar className="color-base-bg">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen2(!open2)}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Samudera Indonesia
          </Typography>

          <Button
            color="inherit"
            onClick={submitLogout}
            disabled={loading}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Desktop */}
      <Drawer
        sx={{
          display: {
            xs: 'none',
            sm: 'none',
            md: 'flex',
          },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <CustomDrawer></CustomDrawer>
      </Drawer>

      {/* Mobile */}
      <SwipeableDrawer
        className="swipeSamudera"
        sx={{
          display: {
            xs: 'flex',
            sm: 'flex',
            md: 'none',
          },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        open={open2}
        onClose={() => setOpen2(!open2)}
        onOpen={() => setOpen2(!open2)}
      >
        <CustomDrawer></CustomDrawer>
      </SwipeableDrawer>

      <Main
        sx={{
          display: {
            xs: 'none',
            sm: 'none',
            md: 'block',
          },
        }}
        // className="css-main"
        open={open}
        style={{
          marginTop: '64px',
        }}
      >
        {props.children}
      </Main>

      <Main
        sx={{
          display: {
            xs: 'block',
            sm: 'block',
            md: 'none',
          },
        }}
        className="css-main"
        open={true}
        style={{
          marginTop: '64px',
        }}
      >
        {props.children}
      </Main>

      <Dialog
        open={dialogProfile}
        fullWidth={true}
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '100%',
              maxWidth: '700px', // Set your width here
              '& .MuiDialogContent-root': {
                padding: '0px'
              },
            },
          },
        }}
      >
        {dialogProfile && (
          <Profile
            closeDialog={() => setDialogProfile(false)}
            refreshPage={refreshPage}
          ></Profile>
        )}
      </Dialog>
    </>
  )
}

export default Header
