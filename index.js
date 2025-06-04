import ExpressConfig from "./solia/backend/src/config/express.config.js";
import MiddlewareConfig from "./solia/backend/src/config/middleware.config.js";
import RouteConfig from "./solia/backend/src/config/route.config.js";

const app = ExpressConfig();

MiddlewareConfig(app);
RouteConfig(app);

const PORT = 5000;

app.listen(PORT, async () => {
  console.log(`Multi Tenant Backend running on port ${PORT}`);
});
