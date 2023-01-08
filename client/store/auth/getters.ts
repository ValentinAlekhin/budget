export default {
  token: () => localStorage.getItem('token'),
  isLogin: () => !!localStorage.getItem('token')
}