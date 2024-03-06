import type { WidgetConfig } from "@medusajs/admin";
import { useState } from "react";

function formatDate(dateString) {
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	const date = new Date(dateString);
	const day = date.getDate();
	const month = months[date.getMonth()];
	const year = date.getFullYear();

	return `${day} ${month} ${year}`;
}

const csvHeader = [
	"id",
	"created_at",
	"updated_at",
	"email",
	"first_name",
	"last_name",
	"phone",
	"has_account",
	"order_count",
];

function extractFields(data) {
	const createdDate = formatDate(data.created_at);
	const updatedDate = formatDate(data.updated_at);

	const newdata = [
		data?.id || "N/A",
		createdDate || "N/A",
		updatedDate || "N/A",
		data?.email || "N/A",
		data?.first_name || data?.shipping_addresses[0]?.first_name || "N/A",
		data?.last_name || data?.shipping_addresses[0]?.last_name || "N/A",
		data?.phone || "N/A",
		data?.has_account || false,
		data?.orders?.length || 0,
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

const getAllCustomer = async ({ startDate, endDate }) => {
	let query = "";
	if (startDate) {
		query = `${query}&created_at[gte]=${startDate}`;
	}
	if (endDate) {
		query = `${query}&created_at[lte]=${endDate}`;
	}
	try {
		const response = await fetch(
			`${process.env.MEDUSA_BACKEND_URL}/admin/customers?limit=&expand=orders,billing_address,shipping_addresses${query}`,
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

const CustomerExport = () => {
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);

	const handleDownload = async () => {
		const { customers } = await getAllCustomer({ startDate, endDate });
		console.log(customers[1]);
		console.log(customers[2]);
		console.log(customers[3]);

		const flattenedDataArray = customers.map((data) => extractFields(data));

		const csvData = convertToCSV(csvHeader, flattenedDataArray);

		const blob = new Blob([csvData], { type: "text/csv" });
		const link = document.createElement("a");
		link.href = window.URL.createObjectURL(blob);
		link.download = "customer_data.csv";
		link.click();
	};

	const handleStartDateChange = (e) => {
		setStartDate(e.target.value);
	};

	const handleEndDateChange = (e) => {
		setEndDate(e.target.value);
	};

	return (
		<div className="flex gap-4 items-center">
			<div className="flex gap-2 items-center">
				<input
					type="date"
					name="startDate"
					className="bg-white py-2 px-4 rounded-lg border font-bold"
					placeholder="Start Date"
					onChange={handleStartDateChange}
				/>
				<span>-</span>
				<input
					type="date"
					name="endDate"
					className="bg-white py-2 px-4 rounded-lg border font-bold"
					placeholder="End Date"
					onChange={handleEndDateChange}
				/>
			</div>
			<button
				type="button"
				className="bg-white py-2 px-4 rounded-lg border font-bold"
				onClick={handleDownload}
			>
				Export Customers
			</button>
		</div>
	);
};

export const config: WidgetConfig = {
	zone: "customer.list.before",
};

export default CustomerExport;
