// import axios, { AxiosError } from 'axios';
// import { config } from '../config';
// const { API_URL } = config;

// const instance = axios.create({ baseURL: API_URL });

// instance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');

//   if (token) config.headers.authorization = token;

//   return config;
// });

// instance.interceptors.response.use(
//   (res) => res,
//   ({ request, response, code }) => {
//     let message = 'Request Failed, try again soon';

//     if (response) {
//       console.log(response.data.errors);
//       message = response.data.errors[0].message || message;
//     }

//     return Promise.reject(message);
//   }
// );

const instance = '';

export default instance;
