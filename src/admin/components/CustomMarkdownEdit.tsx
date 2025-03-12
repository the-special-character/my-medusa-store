import { ControllerRenderProps, FieldValues } from "react-hook-form";
import ReactMarkdownEditor from "@uiw/react-markdown-editor";
import { forwardRef } from "react";
import { useTheme } from "../../providers/theme-provider";
type CustomMarkdownEditProps = ControllerRenderProps<FieldValues, string>;

const CustomMarkdownEdit = forwardRef<Element, CustomMarkdownEditProps>(
  (props, ref) => {
    // const { theme } = useTheme();
    return (
      <div data-color-mode={"light"}>
        <ReactMarkdownEditor
          value={props.value ?? ""}
          height="200px"
          onChange={(value, viewUpdate) => {
            if (value !== "") {
              props?.onChange(value);
            } else {
              props.onChange(value);
            }
          }}
        />
      </div>
    );
  }
);
CustomMarkdownEdit.displayName = "CustomMarkdownEdit";

export default CustomMarkdownEdit;
