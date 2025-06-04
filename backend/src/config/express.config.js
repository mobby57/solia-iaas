import express from 'express';

import middlewareConfig from './middleware.config.js';

const ExpressConfig = () => {
  const app = express();
  app.use(express.json());
  app.set('trust proxy', true);

  middlewareConfig(app);

  return app;
};
export default ExpressConfig;
