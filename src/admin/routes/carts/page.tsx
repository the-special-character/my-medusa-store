"use client";
import { RouteConfig } from "@medusajs/admin";
import { useEffect, useState, useCallback } from "react";
import { XMark, ShoppingBag } from "@medusajs/icons";
import {
	createColumnHelper,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";

import ReviewTable from "./components/cart-table";
import { Cart } from "@medusajs/medusa";
import style from "./style.module.css";

// type ReviewStatuss = ReviewStatus;
type ReviewStatus = "pending" | "approved" | "declined";
type Props = {};

// export async function deleteProduct(id: string, callback: () => void) {
// 	try {
// 		const value = confirm(
// 			"Review will be deleted, Are you sure you want to delete"
// 		);

// 		if (value) {
// 			const response = await fetch(
// 				`${process.env.MEDUSA_BACKEND_URL}/store/reviews/${id}`,
// 				{
// 					method: "DELETE",
// 					headers: {},
// 				}
// 			);
// 			const res = await response.json();
// 			if (callback) callback();
// 			return res;
// 		}
// 	} catch (error) {
// 		console.log(error);
// 	}
// }

// export async function updateCart(
// 	id: string,
// 	status: ReviewStatus,
// 	callback?: () => void
// ) {
// 	try {
// 		const response = await fetch(
// 			`${process.env.MEDUSA_BACKEND_URL}/store/reviews/${id}`,
// 			{
// 				method: "PUT",
// 				body: JSON.stringify({ status }),
// 				headers: {},
// 			}
// 		);
// 		const res = await response.json();
// 		if (callback) callback();
// 		return res;
// 	} catch (error) {
// 		console.log(error);
// 	}
// }

const page = (props: Props) => {
	const [carts, setCarts] = useState<Cart[]>([]);

	const [modalOpen, setModalOpen] = useState({ open: false, params: {} });

	const getAllProducts = useCallback(async () => {
		try {
			const response = await fetch(
				`${process.env.MEDUSA_BACKEND_URL}/admin/pending-cart?limit=10`,
				{
					credentials: "include",
				}
			);

			const res = await response.json();
			return setCarts(res?.data);
		} catch (error) {
			console.log(error);
		}
	}, []);

	// const successCallback = (status: ReviewStatus, id: string) => {
	// 	const affectedReviewIndex = reviews.findIndex((item) => item.id === id);
	// 	const affectedReview = reviews.find((item) => item.id === id);
	// 	setCarts((prev) => {
	// 		return [
	// 			...prev.slice(0, affectedReviewIndex),
	// 			{ ...affectedReview, status },
	// 			...prev.slice(affectedReviewIndex + 1),
	// 		];
	// 	});
	// };
	// const [modalOpen, setModalOpen] = useState({ open: false, params: {} });
	// const handleStatus = async (id: string, status: ReviewStatus) => {
	// 	try {
	// 		const response = await updateCart(id, status, () =>
	// 			successCallback(status, id)
	// 		);
	// 	} catch (error) {
	// 		throw new Error(error);
	// 	}
	// };

	useEffect(() => {
		getAllProducts();
		return () => {};
	}, []);

	console.log(
		"carts +++++++++++++",
		carts.filter((cart) => cart.id)
	);

	const columnHelper = createColumnHelper<Cart>();

	if (!carts && !carts.length) return;

	const columns = [
		// columnHelper.accessor("created_at", {
		// 	header: "Date",
		// 	cell: (info) => (
		// 		<span className="overflow-hidden text-ellipsis whitespace-nowrap">
		// 			{info.row.original.created_at || "NA"}
		// 		</span>
		// 	),
		// }),
		columnHelper.accessor("email", {
			header: "Customer Email",
			cell: (info) => (
				<span className="overflow-hidden text-ellipsis whitespace-nowrap">
					{info.getValue()}
				</span>
			),
		}),
		columnHelper.accessor("customer", {
			header: "Name",
			cell: (info) => (
				<>
					{info.row.original.customer && (
						<a
							href={`/a/customers/${info.row.original.customer.id}`}
							className="text-blue-50 font-bold flex gap-2"
						>
							<span>
								{info.row.original.customer.first_name ||
									info.row.original.shipping_address.first_name}
							</span>
							<span>
								{info.row.original.customer.last_name ||
									info.row.original.shipping_address.last_name}
							</span>
						</a>
					)}
				</>
			),
		}),
		columnHelper.accessor("shipping_address", {
			header: "Phone Number",
			cell: (info) => (
				<a
					href={`tel:${info.row.original.shipping_address.phone}`}
					className="text-blue-50 font-bold flex gap-2"
				>
					{info.row.original.shipping_address.phone}
				</a>
			),
		}),
		columnHelper.accessor("items", {
			header: "Total Cart Items",
			cell: (info) => (
				<span className="overflow-hidden text-ellipsis whitespace-nowrap">
					{info.row.original.items?.length || 0}
				</span>
			),
		}),
		// columnHelper.display({
		// 	header: "Status",
		// 	id: "status",
		// 	cell: (info) => {
		// 		const reviewId = info.row.original.id;
		// 		const status = info.row.original.status;
		// 		return (
		// 			<div className="flex w-[200px] gap-5">
		// 				{status === "pending" ? (
		// 					<>
		// 						<button
		// 							className="bg-green-500 text-white p-2 rounded-lg"
		// 							onClick={() => {
		// 								// handleStatus(reviewId, "approved");
		// 							}}
		// 						>
		// 							Approve
		// 						</button>
		// 						<button
		// 							className="bg-orange-500 text-white p-2 rounded-lg"
		// 							onClick={() => {
		// 								// handleStatus(reviewId, "declined");
		// 							}}
		// 						>
		// 							Decline
		// 						</button>
		// 					</>
		// 				) : (
		// 					status.toUpperCase()
		// 				)}
		// 			</div>
		// 		);
		// 	},
		// }),
		columnHelper.display({
			id: "actions",
			header: "Actions",
			cell: (info) => {
				return (
					<div className="flex gap-4 flex-row">
						<button
							className="bg-blue-500 text-white p-2 rounded-lg whitespace-nowrap"
							onClick={() => {
								setModalOpen({ open: true, params: info.row.original });
							}}
						>
							See Details
						</button>
						{/* <button
							className="bg-red-500 text-white p-2 rounded-lg whitespace-nowrap"
							onClick={() => {
								// handleDelete(info?.row?.original?.id);
							}}
						>
							Action 2
						</button> */}
					</div>
				);
			},
		}),
	];
	const PAGE_SIZE = 10;
	// const handleDelete = useCallback((id: string) => {
	// 	deleteProduct(id, () => {
	// 		setCarts((prev) => prev.filter((x) => x.id !== id));
	// 	});
	// }, []);

	const sortCarts = carts;
	// const sortCarts = carts?.sort(
	// (a, b) =>
	// new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
	// );
	const table = useReactTable<Cart>({
		data: sortCarts,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	const { open, params } = modalOpen;

	return (
		<div className="relative">
			<ReviewTable
				PAGE_SIZE={PAGE_SIZE}
				data={sortCarts}
				columns={columns}
				table={table}
				heading={"Cart List"}
			/>
			<dialog open={open} className={style.dialog}>
				<div className="divide-y-2 px-4">
					<div className={`${style.section} flex justify-between items-center`}>
						<h1>Cart details</h1>
						<button
							className="bg-white shadow-sm p-2 rounded-lg"
							onClick={() => {
								setModalOpen({ open: false, params: {} });
							}}
						>
							<XMark color="red" />
						</button>
					</div>
					<div className={style.section}>
						<h2 className="font-sans font-medium h2-core">Cart Info:</h2>
						<p className={style.row}>
							<span>id:</span>
							<span>{params?.id}</span>
						</p>
						<p className={style.row}>
							<span>Total Cart Item:</span>
							<span>{params?.items?.length || 0}</span>
						</p>
					</div>
					<div className={style.section}>
						<h2>Customer Info</h2>
						<p className={style.row}>
							<span>id:</span>
							<a
								href={`/a/customers/${params?.customer?.id}`}
								className="text-blue-50 font-bold flex gap-2"
							>
								{params?.customer?.id}
							</a>
						</p>
						<p className={style.row}>
							<span>Name:</span>
							<span>
								<a
									href={`/a/customers/${params?.customer?.id}`}
									className="text-blue-50 font-bold flex gap-2"
								>
									<span>
										{params?.customer?.first_name ||
											params?.shipping_address?.first_name}
									</span>
									<span>
										{params?.customer?.last_name ||
											params?.shipping_address?.last_name}
									</span>
								</a>
							</span>
						</p>
						<p className={style.row}>
							<span>Email:</span>
							<span>{params?.email}</span>
						</p>
						<p className={style.row}>
							<span>Phone Number:</span>
							<span>{params?.shipping_address?.phone}</span>
						</p>
					</div>
					<div className={style.section}>
						<h2>Cart Items</h2>
						<div className="space-y-4">
							{params?.items?.length &&
								params.items?.map((item) => {
									return (
										<div key={item.id} className={style.row}>
											<div className="w-[50px]">
												{/* image */}
												<img
													className="w-full aspect-square object-cover"
													src={item?.thumbnail}
													alt=""
												/>
											</div>
											<div className="flex-1">
												{/* name */}
												<span>{item?.title}</span>
											</div>
											<div className={style.row}>
												{/* price */}
												<span>Rs: {(item?.unit_price / 100).toFixed(2)}</span>
												<span>x{item?.quantity}</span>
												<span>
													Rs:{" "}
													{(item?.unit_price / 100).toFixed(2) * item?.quantity}
												</span>
											</div>
										</div>
									);
								})}
						</div>
					</div>
				</div>
			</dialog>
		</div>
	);
};

export const config: RouteConfig = {
	link: {
		label: "Carts",
		icon: ShoppingBag,
	},
};

export default page;
