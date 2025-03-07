import { memo } from "react";
import { Button } from "@medusajs/ui";
import GenerateFormFields from "./GenerateFormFields";
import { FieldValues, UseFormReturn } from "react-hook-form";

export type SchemaField = {
  label?: string;
  fieldType: string;
  props?: any;
  validation: Record<string, any>;
};

type Props = {
  form: UseFormReturn<FieldValues, any, undefined>;
  onSubmit: (data: FieldValues) => void;
  onReset?: () => void;
  schema: Record<string, SchemaField>;
  isPending: boolean;
};

const DynamicForm = ({ form, onSubmit, onReset, schema, isPending }: Props) => {
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-y-3"
    >
      {/* {Object.entries(schema).map(([key, fields]) => {
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
              )
            }}
          />
        )
      })} */}
      <GenerateFormFields form={form} schema={schema} />
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit"}
        </Button>
        {onReset && (
          <Button
            type="button"
            variant="secondary"
            disabled={isPending}
            onClick={onReset}
          >
            Reset
          </Button>
        )}
      </div>
    </form>
  );
};

export default memo(DynamicForm);
