import { useEffect, useState } from "react";
import ReviewTable from "../../../reviews/components/review-table";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FaqType } from "../ListFaqs";
import FaqCategoryActions from "../FaqCategoryActions";

export type FaqCategoryType = {
  handle: string;
  title: string;
  description: string;
  metadata: Record<string, any> | null;
  id: string;
  created_at: string;
  updated_at: string;
  faqs: FaqType[];
};

const ListFaqCategories = () => {
  const [faqCategories, setFaqCategories] = useState([]);

  useEffect(() => {
    const fetchFaqCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.MEDUSA_BACKEND_URL}/admin/faq/faq-category`,
          {
            credentials: "include",
          }
        );
        const res = await response.json();
        setFaqCategories(res?.faqs[0] || []);
      } catch (error) {
        console.error("Error fetching FAQ Categories:", error);
      }
    };

    fetchFaqCategories();

    return () => {};
  }, []);

  const catColumnHelper = createColumnHelper<FaqCategoryType>();

  const faqCategoryColumns = [
    catColumnHelper.accessor("created_at", {
      header: "Date",
      cell: (info) => (
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {info.getValue() || "-"}
        </span>
      ),
    }),
    catColumnHelper.accessor("title", {
      header: "Category Title",
      cell: (info) => (
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {info.getValue() || "-"}
        </span>
      ),
    }),
    catColumnHelper.accessor("faqs", {
      header: "Total FAQs",
      cell: (info) => (
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {info.row.original?.faqs?.length}
        </span>
      ),
    }),
    catColumnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const faqCategoryId = info.row.original.id;
        console.log({ faqCategoryId });

        return <FaqCategoryActions faqId={faqCategoryId} />;
      },
    }),
  ];

  const faqCategoryTable = useReactTable({
    data: faqCategories,
    columns: faqCategoryColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const PAGE_SIZE = 10;

  return (
    <ReviewTable
      PAGE_SIZE={PAGE_SIZE}
      data={faqCategories}
      columns={faqCategoryColumns}
      table={faqCategoryTable}
    />
  );
};

export default ListFaqCategories;
