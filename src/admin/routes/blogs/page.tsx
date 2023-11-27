"use client";
import { RouteConfig } from "@medusajs/admin";
import { RocketLaunch } from "@medusajs/icons";
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
import { ProductReview } from "src/models/product-review";
import BlogTable from "./components/blog-table";

type Props = {};

export async function deleteBlog(id: string) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/store/blogs/${id}`,
      {
        method: "DELETE",
        headers: {},
      }
    );
    const res = await response.json();
    alert("delete success");
    return res;
  } catch (error) {
    console.log(error);
  }
}

const BlogPage = (props: Props) => {
  const [blogs, setBlogs] = useState<ProductReview[]>([]);

  const getAllBlogs = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:9000/store/blogs`);
      const res = await response.json();
      return setBlogs(res?.productReview);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getAllBlogs();
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
      header: "Blog Id",
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
    columnHelper.display({
      id: "actions",
      cell: (info) => {
        return (
          <div className="flex gap-3">
            <button className="bg-green-500 text-white p-2 rounded-lg">
              View
            </button>
            <button className="bg-blue-500 text-white p-2 rounded-lg">
              Edit
            </button>
            <button className="bg-red-500 text-white p-2 rounded-lg">
              Delete
            </button>
          </div>
        );
      },
    }),
  ];

  const PAGE_SIZE = 10;
  const handleDelete = useCallback((id: string) => {
    deleteBlog(id);
    setBlogs((prev) => prev.filter((x) => x.id !== id));
  }, []);
  const table = useReactTable<ProductReview>({
    data: blogs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <BlogTable
      PAGE_SIZE={PAGE_SIZE}
      data={blogs}
      columns={columns}
      table={table}
      heading={"Blog List"}
    />
  );
};

export const config: RouteConfig = {
  link: {
    label: "Blogs",
    icon: RocketLaunch,
  },
};

export default BlogPage;
