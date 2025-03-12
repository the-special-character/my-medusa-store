import React, { useEffect, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import ReviewTable from "../../../reviews/components/review-table";
import FaqActions from "../FaqActions";
import { FaqCategoryType } from "../ListFaqCategories";
import { FocusModal } from "@medusajs/ui";
import EditForm from "../EditForm";

export type FaqType = {
  id: string;
  title: string;
  description: string;
  faqCategories: FaqCategoryType[];
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
};

const ListFaqs = () => {
  const [faqsData, setFaqsData] = useState([]);
  const [openModal, setOpenModal] = useState({
    value: false,
    data: null,
  });

  const closeModal = () => {
    setOpenModal({
      value: false,
      data: null,
    });
  };

  const openCreateModal = () => {
    setOpenModal({
      value: true,
      data: null,
    });
  };
  const openUpdateModal = (data: Partial<FaqType>) => {
    setOpenModal({
      value: true,
      data: data,
    });
  };

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.MEDUSA_BACKEND_URL}/admin/faq`,
          {
            credentials: "include",
          }
        );

        const res = await response.json();

        return setFaqsData(res?.faqs[0]);
      } catch (error) {
        console.log(error);
      }
    };
    getAllProducts();
    return () => {};
  }, []);

  if (!faqsData && !faqsData.length) return;

  const columnHelper = createColumnHelper<FaqType>();

  const faqColumns = [
    columnHelper.display({
      header: "Sr. No.",
      id: "sr_no",
      cell: (info) => info.row.index + 1,
    }),
    columnHelper.accessor("created_at", {
      header: "Date",
      cell: (info) => (
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {info.row.original?.created_at || "-"}
        </span>
      ),
    }),
    columnHelper.accessor("title", {
      header: "Faq Title",
      cell: (info) => (
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {info.row.original?.title || "-"}
        </span>
      ),
    }),
    columnHelper.accessor("updated_at", {
      header: "Last Updated",
      cell: (info) => (
        <span className="overflow-hidden text-ellipsis whitespace-nowrap line-clamp-1 text-wrap">
          {info.row.original?.updated_at || "-"}
        </span>
      ),
    }),
    // columnHelper.accessor("faqCategories", {
    //   header: "Faq Category",
    //   cell: (info) => (
    //     <span className="overflow-hidden text-ellipsis whitespace-nowrap line-clamp-1 text-wrap">
    //       {/* {info.row.original?.faqCategory?.title || "-"} */}-
    //     </span>
    //   ),
    // }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const faqId = info.row.original.id;
        return (
          <FaqActions
            faqId={faqId}
            onEdit={() => openUpdateModal(info.row.original)}
          />
        );
      },
    }),
  ];

  const faqTable = useReactTable({
    data: faqsData,
    columns: faqColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const PAGE_SIZE = 10;

  return (
    <>
      <ReviewTable
        heading="faq"
        onCreate={() => {
          setOpenModal({
            value: true,
            data: null,
          });
        }}
        PAGE_SIZE={PAGE_SIZE}
        data={faqsData}
        columns={faqColumns}
        table={faqTable}
      />
      <FocusModal
        modal
        open={openModal.value}
        onOpenChange={(value) =>
          value ? setOpenModal({ value: true, data: null }) : closeModal()
        }
      >
        <FocusModal.Content>
          <FocusModal.Header></FocusModal.Header>
          <FocusModal.Body>
            <EditForm
              mode={openModal.data ? "edit" : "create"}
              data={openModal.data}
              closeModal={closeModal}
            />
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </>
  );
};

export default ListFaqs;
