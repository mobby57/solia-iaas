import router from "../routes/index.js";

export default function RouteConfig(app) {
  app.use('/api', router);
}
