const __DEV__ = process.env.NODE_ENV === 'development';

const devConfig = {
  API_URL: 'http://localhost:3000/api/v1',
};

const prodConfig = {
  API_URL: '',
};

export const config = __DEV__ ? devConfig : prodConfig;
