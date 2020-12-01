import axios from 'axios'
// import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 6000 
})

// Trước request
service.interceptors.request.use(
      config => {
        config.headers['Authorization'] = 'Bearer ' + getToken()

        // if (store.state.User.token) {
        //     config.headers['Authorization'] = 'Bearer ' + getToken()
        // }

        config.mode = 'no-cors'
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// Sau request response 
service.interceptors.response.use(
    response => {
        const res = response.data
        return res
    },
    error => {
        // if (error.response) {
        //     for (let field in error.response.data.errors) {
        //         error.response.data.errors[field].forEach(error => {
        //             console.log(error)
        //             // Message({
        //             //     message: error,
        //             //     type: 'error',
        //             //     duration: 2 * 1000
        //             // })
        //         })
        //     }
        // }
        // else if (error.response.data.message == "Unauthenticated.") {
        //     // to re-login
        //     // MessageBox.confirm('Bạn đã đăng xuất', 'Xác nhận đăng xuất', {
        //     //     confirmButtonText: 'Đăng nhập lại',
        //     //     cancelButtonText: 'Hủy bỏ',
        //     //     type: 'warning'
        //     // }).then(() => {
        //     //     store.dispatch('user/resetToken').then(() => {
        //     //         location.reload()
        //     //     })
        //     // })
        // }
        // else
        //     // Message({
        //     //     message: error.response.data.message,
        //     //     type: 'error',
        //     //     duration: 5 * 1000
        //     // })
        return Promise.reject(error)
    }
)

export default service
