export const faqSchema = async () => {
  const res = await fetch(
    `${process.env.MEDUSA_ADMIN_BACKEND_URL}/admin/faq/faq-category`,
    {
      credentials: "include",
    }
  );
  const categoriesSchema = await res.json();

  const optionsForCategory =
    categoriesSchema &&
    categoriesSchema?.faqs &&
    categoriesSchema?.faqs[0].length > 0
      ? categoriesSchema?.faqs[0]?.map((x: any) => ({
          value: x.title,
          label: x.title,
          id: x.id,
        }))
      : [];

  const schema = {
    faqTitle: {
      label: "Faq Title",
      fieldType: "input",
      validation: {
        required: {
          value: true,
          message: "Title is required",
        },
        pattern: {
          value: /^(?!^\d+$)^.+$/,
          message: "Title should not contain only numbers",
        },
      },
    },
    faqContent: {
      label: "Faq Content",
      fieldType: "markdown-editor",
      validation: {
        required: {
          value: true,
          message: "Content is required",
        },
      },
    },
    faqCategory: {
      label: "Faq Categories",
      // fieldType: "nested-select",
      fieldType: "combobox",
      props: {
        options: optionsForCategory,
        // options: categoriesSchema.faqs[0],
        placeholder: "Select an Category...",
      },
      validation: {
        // required: {
        //   value: true,
        //   message: "Category is required",
        // },
      },
    },
  };
  console.log({ schema });

  return schema;
};
