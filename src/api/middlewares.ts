import { authenticate, type MiddlewaresConfig } from "@medusajs/medusa";
import cors from "cors";
import bodyParser from "body-parser";

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
			matcher: "/cart-info",
			middlewares: [cors(adminCorsOptions), authenticate()],
		},
		{
			method: ["POST", "OPTIONS"],
			matcher: "/phonepe/*",
			bodyParser: false,
			middlewares: [
				cors({
					origin: /.*.phonepe.com\/apis/gm,
					methods: "POST,OPTIONS",
				}),
				bodyParser.json({ type: "application/json" }),
			],
		},
		{
			matcher: "/mailer/templates/*",
			middlewares: [cors(adminCorsOptions), authenticate()],
		},
	],
};
