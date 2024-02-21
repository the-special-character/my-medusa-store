import type { WidgetConfig } from "@medusajs/admin";

// "Subtotal",
// 	"Shipping Total",
// 	"Discount Total",
// 	"Gift Card Total",
// 	"Refunded Total",
// 	"Tax Total",
// 	"Total",
// 	"Currency Code",

const csvHeader = [
	"id",
	"display_id",
	"status",
	"created_at",
	"shipping_total",
	"discount_total",
	"tax_total",
	"total",
	"subtotal",
	"paid_total",
	"refundable_amount",
	"currency_code",
	"fulfillment_status",
	"payment_status",
	"customer_id",
	"customer_first_name",
	"customer_last_name",
	"email",
	"phone",
	"address_1",
	"address_2",
	"city",
	"country_code",
	"postal_code",
	"items",
];

function extractFields(data) {
	const itemNames = data?.items?.map(({ name, quantity, unit_price }) =>
		JSON.stringify({
			name,
			quantity,
			unit_price: unit_price / 100,
		})
	);
	const newdata = [
		data?.id || "N/A",
		data?.display_id || "N/A",
		data?.status || "N/A",
		data?.created_at || "N/A",
		data?.shipping_total / 100 || 0,
		data?.discount_total / 100 || 0,
		data?.tax_total / 100 || 0,
		data?.total / 100 || 0,
		data?.subtotal / 100 || 0,
		data?.paid_total / 100 || 0,
		data?.refundable_amount / 100 || 0,
		data?.currency_code || "N/A",
		data?.fulfillment_status || "N/A",
		data?.payment_status || "N/A",
		data?.customer_id || "N/A",
		data?.customer?.first_name || data?.shipping_address?.first_name || "N/A",
		data?.customer?.last_name || data?.shipping_address?.last_name || "N/A",
		data?.email || data?.customer?.email || "N/A",
		data?.shipping_address?.phone || "N/A",
		data?.shipping_address?.address_1 || "N/A",
		data?.shipping_address?.address_2 || "N/A",
		data?.shipping_address?.city || "N/A",
		data?.shipping_address?.country_code || "N/A",
		data?.shipping_address?.postal_code || "N/A",
		itemNames.join("|") || "N/A",
	];
	for (let i = 0; i < newdata.length; i++) {
		const data = newdata[i];
		if (data && typeof data === "string") {
			newdata[i] = data.replaceAll(",", " ");
		}
	}

	return newdata;
}

function convertToCSV(header, dataArray) {
	const headerRow = header.join(",") + "\n";
	const dataRows = dataArray.map((data) => data.join(",")).join("\n");
	return headerRow + dataRows;
}

const getAllCarts = async () => {
	try {
		const response = await fetch(
			`${process.env.MEDUSA_BACKEND_URL}/admin/orders?fields=id,display_id,status,created_at,shipping_total,discount_total,tax_total,refunded_total,total,subtotal,paid_total,refundable_amount,currency_code,customer_id,email,fulfillment_status,payment_status`,
			{
				credentials: "include",
			}
		);
		if (!response.ok) return;
		const jsonData = await response.json();

		return jsonData;
	} catch (error) {
		console.log(error);
	}
};

const OrderExport = () => {
	const handleDownload = async () => {
		const { orders } = await getAllCarts();
		const flattenedDataArray = orders.map((data) => extractFields(data));

		const csvData = convertToCSV(csvHeader, flattenedDataArray);

		const blob = new Blob([csvData], { type: "text/csv" });
		const link = document.createElement("a");
		link.href = window.URL.createObjectURL(blob);
		link.download = "data.csv";
		link.click();
	};

	return (
		<div className="h-10">
			<button
				type="button"
				className="bg-white py-2 px-4 rounded-lg border mb-4 font-bold"
				onClick={handleDownload}
			>
				Export Orders
			</button>
		</div>
	);
};

export const config: WidgetConfig = {
	zone: "order.list.before",
};

export default OrderExport;
