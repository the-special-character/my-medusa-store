import { Controller, FieldValues, UseFormReturn } from "react-hook-form";
import React from "react";
import { Input, Label, clx } from "@medusajs/ui";
import ErrorMessage from "./ErrorMessage";
import getInputElement from "../getInputElement";

const GenerateFormFields = ({
  schema,
  form,
}: {
  form: UseFormReturn<FieldValues, any, undefined>;
  schema: Record<string, any>;
}) => {
  return (
    <>
      {Object.entries(schema).map(([key, fields]) => {
        return (
          <Controller
            key={key}
            control={form.control}
            name={key}
            rules={fields.validation}
            render={({ field }) => {
              return (
                <div>
                  <Label htmlFor={key}>
                    <span
                      className={clx("mb-2 block font-sans font-medium", {
                        ["sr-only"]: !fields.label,
                      })}
                    >
                      {fields.label || field.name}
                    </span>
                    {React.createElement(
                      getInputElement(fields.fieldType) as typeof Input,
                      {
                        ...fields.props,
                        ...field,
                        value: field.value || null,
                        onChange: field.onChange,
                      }
                    )}
                    <ErrorMessage
                      control={form.control}
                      name={key}
                      rules={fields.validation}
                    />
                  </Label>
                </div>
              );
            }}
          />
        );
      })}
    </>
  );
};

export default GenerateFormFields;
