import { authenticate, type MiddlewaresConfig } from "@medusajs/medusa";
import cors from "cors";
import { raw } from "body-parser"

const adminCorsOptions = {
  origin: "*",
  credentials: true,
};

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: "/mailer/templates",
      middlewares: [cors(adminCorsOptions), authenticate()],
    },
    {
      method: ["POST", "PUT"],
      matcher: "/phonepe/*",
      bodyParser: false,
      middlewares: [raw({ type: "application/json" })],
      // middlewares: [cors(adminCorsOptions), authenticate()],
    },
    {
      matcher: "/mailer/templates/*",
      middlewares: [cors(adminCorsOptions), authenticate()],
    },
  ],
};
