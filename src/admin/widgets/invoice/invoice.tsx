import type { WidgetConfig } from "@medusajs/admin";
import { Order } from "@medusajs/medusa";
import { Link } from "react-router-dom";

const InvoiceWidget = ({ order }: { order: Order }) => {
	console.log(order);

	// function openWindow() {
	// 	var newtab = window.open("", "anotherWindow", "width=300,height=150");
	// 	const invoiceData = `<p>OrderId: ${props.order.id}</p>`;
	// 	newtab.document.write(invoiceData);
	// }

	const store_url = process.env.STOREFRONT_URL || "https://learningdino.com";

	return (
		<div className="h-10">
			<a
				target="_blank"
				href={`${store_url}/invoice/${order.id}`}
				className="bg-white py-2 px-4 rounded-lg border font-bold"
			>
				Download Invoice
			</a>
			{/* <button
				type="button"
				className="bg-white py-2 px-4 rounded-lg border mb-4 font-bold"
				onClick={openWindow}
			>
				Download Invoice
			</button> */}
		</div>
	);
};

export const config: WidgetConfig = {
	zone: "order.details.before",
};

export default InvoiceWidget;
