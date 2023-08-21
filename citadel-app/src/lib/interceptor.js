import axios from 'axios';

const initInterceptors = (csr) => {
  axios.interceptors.request.use((config) => {
    config.headers.set('Authorization', `Bearer ${csr}`);
    return config;
  });
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // const errorStatus = error.response?.status;
      // console.log('ERRORSTATS', errorStatus, window.location.pathname);

      return Promise.reject(error);
    }
  );
};

export default initInterceptors;
