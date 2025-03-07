export const faqSchema = async () => {
  const res = await fetch(
    `${process.env.MEDUSA_BACKEND_URL}/admin/faq/faq-category`,
    {
      credentials: "include",
    }
  );
  const categoriesSchema = await res.json();

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
      fieldType: "textarea",
      validation: {
        required: {
          value: true,
          message: "Content is required",
        },
      },
    },
    faqCategories: {
      label: "Faq Categories",
      fieldType: "nested-select",
      props: {
        options: categoriesSchema.faqs[0],
        placeholder: "Select an Category...",
      },
      validation: {},
    },
  };

  return schema;
};
