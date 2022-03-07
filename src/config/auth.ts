export default {
  jwt: {
    secret: process.env.APP_SECRET || 'secret_test',
    expiresIn: '1d',
  },
};
