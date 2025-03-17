export const faqCategorySchema = async () => {
  const schema = {
    faqCategoryTitle: {
      label: "Faq Category Title",
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
    faqCategoryContent: {
      label: "Faq Category Content",
      fieldType: "textarea",
      validation: {},
    },
    faqCategoryHandle: {
      label: "Faq Category Handle",
      fieldType: "input",
      validation: {
        // required: {
        //   value: true,
        //   message: "Handle is required",
        // },
        pattern: {
          value: /^(?!^\d+$)^.+$/,
          message: "Title should not contain only numbers",
        },
      },
    },
  };

  return schema;
};
