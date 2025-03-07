import { FieldValues, useForm } from "react-hook-form";
import DynamicForm, { SchemaField } from "../../../../components/DynamicForm";
import { FaqType } from "../ListFaqs";
import { useEffect, useState } from "react";
import { faqSchema } from "../../faqSchema";
import { Button, Toaster } from "@medusajs/ui";

const EditForm = ({
  mode,
  data,
  closeModal,
}: {
  mode: "edit" | "create";
  data: Partial<FaqType> | null;
  closeModal: () => void;
}) => {
  const [schema, setSchema] = useState<Record<string, SchemaField>>({});

  useEffect(() => {
    const loadSchema = async () => {
      try {
        const schemaData = await faqSchema();
        console.log({ faqSchema });

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
      category_id: data.faqCategories,
    };

    try {
      const res = await fetch(`${process.env.MEDUSA_BACKEND_URL}/admin/faq`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(raw),
      });

      if (!res.ok) {
        const errorResponse = await res.json();
        console.error("Failed to create FAQ:", errorResponse);
        return;
      }

      const postedData = await res.json();
      closeModal();
    } catch (error) {
      console.error("Error while creating FAQ:", error);
    }
  };

  const form = useForm<FieldValues>({
    defaultValues:
      mode == "edit" && data
        ? {
            faqTitle: data?.title,
            faqContent: data?.description,
            faqCategories:
              data?.faqCategories?.map((x: { id: string }) => x.id) || [],
            // faqCategory:
            //   data?.faqCategory?.map((x: { id: string }) => x.id) || [],
          }
        : {
            faqTitle: "",
            faqContent: "",
            faqCategories: [],
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
