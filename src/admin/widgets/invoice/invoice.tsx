import type { WidgetConfig } from "@medusajs/admin";
import { Order } from "@medusajs/medusa";

const InvoiceWidget = ({ order }: { order: Order }) => {
	if (!order.id) return null;

	// function openWindow() {
	// 	var newtab = window.open("", "anotherWindow", "width=300,height=150");
	// 	const invoiceData = `<p>OrderId: ${props.order.id}</p>`;
	// 	newtab.document.write(invoiceData);
	// }

	const handleClick = async () => {
		if (
			!order ||
			!order.fulfillments ||
			!order.fulfillments[order.fulfillments.length - 1].data.packages
		)
			return;

		const waybills = order.fulfillments[
			order.fulfillments.length - 1
		].data.packages?.map((item) => item.waybill);

		console.log("waybills", waybills);

		const res = await Promise.all(
			waybills.map(
				async (waybill) =>
					await fetch(
						`${process.env.BACKEND_URL}/admin/waybill-slip?waybillId=${waybill}`,
						{
							credentials: "include",
						}
					)
			)
		);

		const jsons = await Promise.all(
			res.map(async (response) => await response.json())
		);

		console.log(jsons);

		console.log("start");
	};

	const store_url = process.env.STOREFRONT_URL || "https://learningdino.com";

	return (
		<div className="h-10 flex items-center gap-4 pb-6">
			<a
				target="_blank"
				href={`${store_url}/invoice/${order.id}`}
				className="bg-white py-2 px-4 rounded-lg border font-bold"
			>
				Download Invoice
			</a>
			{order.fulfillment_status === "fulfilled" && (
				<button
					// target="_blank"
					// href={`${store_url}/invoice/${order.id}`}
					onClick={handleClick}
					className="bg-white py-2 px-4 rounded-lg border font-bold"
				>
					Print Waybill
				</button>
			)}
		</div>
	);
};

export const config: WidgetConfig = {
	zone: "order.details.before",
};

export default InvoiceWidget;
