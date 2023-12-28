"use client";
import { RouteConfig } from "@medusajs/admin";
import { useEffect, useState, useCallback } from "react";
import { Star } from "@medusajs/icons";
import { Table, Container, Heading } from "@medusajs/ui";
import {
  Row,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowLeft, ArrrowRight } from "@medusajs/icons";
import {
  ProductReview,
  ReviewStatus as ReviewStatusEnum,
} from "src/models/product-review";
import ReviewTable from "./components/review-table";

// type ReviewStatuss = ReviewStatus;
type ReviewStatus = "pending" | "approved" | "declined";
type Props = {};

export async function deleteProduct(id: string, callback: () => void) {
  try {
    const value = confirm(
      "Review will be deleted, Are you sure you want to delete"
    );

    if (value) {
      const response = await fetch(
        `${process.env.MEDUSA_BACKEND_URL}/store/reviews/${id}`,
        {
          method: "DELETE",
          headers: {},
        }
      );
      const res = await response.json();
      if (callback) callback();
      return res;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function updateProductReview(
  id: string,
  status: ReviewStatus,
  callback?: () => void
) {
  try {
    const response = await fetch(
      `${process.env.MEDUSA_BACKEND_URL}/store/reviews/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({ status }),
        headers: {},
      }
    );
    const res = await response.json();
    if (callback) callback();
    return res;
  } catch (error) {
    console.log(error);
  }
}

const page = (props: Props) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);

  const getAllProducts = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.MEDUSA_BACKEND_URL}/store/reviews`
      );
      const res = await response.json();
      return setReviews(res?.productReview);
    } catch (error) {
      console.log(error);
    }
  }, []);
  const successCallback = (status: ReviewStatus, id: string) => {
    const affectedReviewIndex = reviews.findIndex((item) => item.id === id);
    const affectedReview = reviews.find((item) => item.id === id);
    setReviews((prev) => {
      return [
        ...prev.slice(0, affectedReviewIndex),
        { ...affectedReview, status },
        ...prev.slice(affectedReviewIndex + 1),
      ];
    });
  };
  const handleStatus = async (id: string, status: ReviewStatus) => {
    try {
      const response = await updateProductReview(id, status, () =>
        successCallback(status, id)
      );

      alert("Review Updated");
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    getAllProducts();
    return () => {};
  }, []);

  const columnHelper = createColumnHelper<ProductReview>();

  const columns = [
    columnHelper.accessor("customer.first_name", {
      header: "Name",
      cell: (info) => (
        <a
          href={`/a/customers/${info.row.original.customer.id}`}
          className="text-blue-50 font-bold"
        >
          {info.row.original.customer.first_name}
          {info.row.original.customer.last_name}
        </a>
      ),
    }),
    columnHelper.accessor("id", {
      header: "Review Id",
      cell: (info) => (
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("title", {
      header: "Title",
      cell: (info) => (
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("content", {
      header: "Description",
      cell: (info) => (
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("rating", {
      header: "Rating",
      cell: (info) => (
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.display({
      header: "Status",
      id: "status",
      cell: (info) => {
        const reviewId = info.row.original.id;
        const status = info.row.original.status;
        return (
          <div className="flex w-[200px] gap-5">
            {status === "pending" ? (
              <>
                <button
                  className="bg-green-500 text-white p-2 rounded-lg"
                  onClick={() => {
                    handleStatus(reviewId, "approved");
                  }}
                >
                  Approve
                </button>
                <button
                  className="bg-orange-500 text-white p-2 rounded-lg"
                  onClick={() => {
                    handleStatus(reviewId, "declined");
                  }}
                >
                  Decline
                </button>
              </>
            ) : (
              status.toUpperCase()
            )}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      cell: (info) => {
        return (
          <div className="flex  flex-row">
            <button
              className="bg-red-500 text-white p-2 rounded-lg"
              onClick={() => {
                handleDelete(info?.row?.original?.id);
              }}
            >
              Delete
            </button>
          </div>
        );
      },
    }),
  ];
  const PAGE_SIZE = 10;
  const handleDelete = useCallback((id: string) => {
    deleteProduct(id, () => {
      setReviews((prev) => prev.filter((x) => x.id !== id));
    });
  }, []);

  const table = useReactTable<ProductReview>({
    data: reviews,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <ReviewTable
      PAGE_SIZE={PAGE_SIZE}
      data={reviews}
      columns={columns}
      table={table}
      heading={"Review List"}
    />
  );
};

export const config: RouteConfig = {
  link: {
    label: "Reviews",
    icon: Star,
  },
};

export default page;
