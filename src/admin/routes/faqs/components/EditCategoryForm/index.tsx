import { FieldValues, useForm } from "react-hook-form";
import DynamicForm, { SchemaField } from "../../../../components/DynamicForm";
import { useEffect, useState } from "react";
import { Button, Toaster } from "@medusajs/ui";
import { useNavigate } from "react-router-dom";
import { faqCategorySchema } from "../../faqCategorySchema";
import { FaqCategoryType } from "../ListFaqCategories";

const EditCategoryForm = ({
  mode,
  categoryData,
  closeModal,
}: {
  mode: "edit" | "create";
  categoryData: Partial<FaqCategoryType> | null;
  closeModal: () => void;
}) => {
  const [schema, setSchema] = useState<Record<string, SchemaField>>({});

  const navigate = useNavigate();

  useEffect(() => {
    const loadSchema = async () => {
      try {
        const schemaData = await faqCategorySchema();

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
      title: data.faqCategoryTitle,
      description: data.faqCategoryContent,
      handle: data.faqCategoryHandle,
    };

    try {
      const url =
        mode === "edit" && categoryData?.id
          ? `${process.env.MEDUSA_ADMIN_BACKEND_URL}/admin/faq/faq-category/${categoryData.id}`
          : `${process.env.MEDUSA_ADMIN_BACKEND_URL}/admin/faq/faq-category`;

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
          `Failed to ${mode === "edit" ? "edit" : "create"} FAQ Category:`,
          errorResponse.message
        );
        if (errorResponse) {
          form.setError("faqCategoryHandle", {
            type: "server",
            message: errorResponse.message as string, // Ensure it's a string message
          });
        }
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
      mode == "edit" && categoryData
        ? {
            faqCategoryTitle: categoryData?.title,
            faqCategoryContent: categoryData?.description,
            faqCategoryHandle: categoryData?.handle,
          }
        : {
            faqCategoryTitle: "",
            faqCategoryContent: "",
            faqCategoryHandle: "",
          },
  });

  return (
    <div className="w-full p-5">
      {/* <pre>{JSON.stringify(categoryData)}</pre> */}
      <DynamicForm
        isPending={form.formState.isSubmitting}
        form={form}
        onSubmit={onSubmit}
        schema={schema}
      />
    </div>
  );
};

export default EditCategoryForm;
