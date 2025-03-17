import { FieldValues, useForm } from "react-hook-form";
import DynamicForm, { SchemaField } from "../../../../components/DynamicForm";
import { FaqType } from "../ListFaqs";
import { useEffect, useState } from "react";
import { faqSchema } from "../../faqSchema";
import { Button, Toaster } from "@medusajs/ui";
import { useNavigate } from "react-router-dom";

const EditForm = ({
  mode,
  faqData,
  closeModal,
}: {
  mode: "edit" | "create";
  faqData: Partial<FaqType> | null;
  closeModal: () => void;
}) => {
  const [schema, setSchema] = useState<Record<string, SchemaField>>({});

  const navigate = useNavigate();

  useEffect(() => {
    const loadSchema = async () => {
      try {
        const schemaData = await faqSchema();

        setSchema(schemaData);
      } catch (error) {
        console.error("Error loading schema:", error);
      }
    };
    loadSchema();
  }, []);

  const onSubmit = async (data: FieldValues) => {
    console.log("faq data on submit", data);

    const raw = {
      title: data.faqTitle,
      description: data.faqContent,
      category_id: data.faqCategory,
    };
    console.log({ raw });

    try {
      const url =
        mode === "edit" && faqData?.id
          ? `${process.env.MEDUSA_ADMIN_BACKEND_URL}/admin/faq/${faqData.id}`
          : `${process.env.MEDUSA_ADMIN_BACKEND_URL}/admin/faq`;

      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(raw),
      });

      if (!res.ok) {
        const errorResponse = await res.json();
        console.error(
          `Failed to ${mode === "edit" ? "edit" : "create"} FAQ:`,
          errorResponse
        );
        return;
      }

      const postedData = await res.json();
      closeModal();
      navigate(0);
    } catch (error) {
      console.error("Error while creating FAQ:", error);
    }
  };

  const form = useForm<FieldValues>({
    defaultValues:
      mode == "edit" && faqData
        ? {
            faqTitle: faqData?.title,
            faqContent: faqData?.description,
            faqCategory: faqData?.faqCategory?.id,
            // faqCategory:
            //   data?.faqCategories?.map((x: { id: string }) => x.id) || [],
          }
        : {
            faqTitle: "",
            faqContent: "",
            faqCategory: "",
          },
  });

  return (
    <div className="w-full p-5">
      {/* <pre>{JSON.stringify(data)}</pre> */}
      <DynamicForm
        isPending={form.formState.isSubmitting}
        form={form}
        onSubmit={onSubmit}
        schema={schema}
      />
    </div>
  );
};

export default EditForm;
