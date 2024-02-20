import type { WidgetConfig } from "@medusajs/admin";

const csvHeader = [
	"id",
	"status",
	"created_at",
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
	"fulfillment_status",
	"payment_status",
];

function extractFields(data) {
	const newdata = [
		data.id || "",
		data.status || "",
		data.created_at || "",
		data.customer_id || "",
		data?.customer?.first_name || data?.shipping_address?.first_name || "",
		data?.customer?.last_name || data?.shipping_address?.last_name || "",
		data.email || data.customer.email || "",
		data?.shipping_address?.phone || "",
		data?.shipping_address?.address_1 || "",
		data?.shipping_address?.address_2 || "",
		data?.shipping_address?.city || "",
		data?.shipping_address?.country_code || "",
		data?.shipping_address?.postal_code || "",
		data?.fulfillment_status || "",
		data?.payment_status || "",
	];
	for (let i = 0; i < newdata.length; i++) {
		const data = newdata[i];
		if (data) {
			newdata[i] = data.replaceAll(",", " ");
		}
	}
	console.log(newdata);

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
			`${process.env.MEDUSA_BACKEND_URL}/admin/orders?limit=`,
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
