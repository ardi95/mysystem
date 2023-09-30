import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Cookies from 'universal-cookie'

import history from '../utils/history'

const MySwal = withReactContent(Swal)
const cookies = new Cookies()

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
})

api.interceptors.request.use((config) => {
  config.headers['Authorization'] = cookies.get('login_access_token')
  //if (VueCookies.get('token')) {
  //  config.headers.common['Authorization'] = VueCookies.get('token')
  //}
  return config
})

api.interceptors.response.use(
  (res) => {
    //console.log('Response Interceptor', res)
    //console.log('history', history);
    return res
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      cookies.remove('login_access_token')
      history.push('/login')
      window.location.reload()
      return new Promise((resolve, reject) => {
        reject(error)
      })
    } else if (error.response && error.response.status === 400) {
      MySwal.fire({
        icon: 'warning',
        iconColor: 'orange',
        title: 'Warning!',
        text: error.response.data.errors[0],
        confirmButtonText: 'Oke',
        confirmButtonColor: '#DC4233',
      })
      return new Promise((resolve, reject) => {
        reject(error)
      })
    } else if (error.response && error.response.status === 403) {
      api
        .post(`${process.env.REACT_APP_BACKEND_URL}/api/logout`)
        .then(() => {
          cookies.remove('login_access_token')
          history.push('/')
          window.location.reload()
        })
        .catch((error) => console.console.log(error))

      return error
    } else {
      return new Promise((resolve, reject) => {
        reject(error)
      })
    }
  }
)

export { api }
