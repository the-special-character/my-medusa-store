import { Input, Textarea, Checkbox } from "@medusajs/ui";
import NestedMultiSelect from "./CustomNestedMultiSelect";
// import CustomMarkdownEdit from "./CustomMarkdownEdit"
// import CustomToggleButton from "./CustomToggleButton"
// import CustomSelect from "./CustomSelect"
// import CustomColorField from "./CustomColorField"

// import CustomCombobox from "./CustomCombobox"
// import CustomRichTextInput from "./CustomRichTextInput"
// import CustomMetaData from "./CustomMetaData"
// import JsonEditor from "./JsonEditor"

type InputElementType = React.ComponentType<any>;

const getInputElement = (type: string): InputElementType => {
  switch (type) {
    case "input":
      return Input;
    case "textarea":
      return Textarea;
    case "checkbox":
      return Checkbox;
    case "nested-select":
      return NestedMultiSelect;

    // case "markdown-editor":
    //   return CustomMarkdownEdit
    // case "richText-editor":
    //   return CustomRichTextInput
    // case "combobox":
    // return CustomCombobox
    // case "searchable-select":
    //   return CustomSearchableSelect
    // case "metadata":
    //   return CustomMetaData
    // case "toggle":
    //   return CustomToggleButton
    // case "file-upload":
    //   return FileUploadField
    // case "select":
    //   return CustomSelect
    // case "image-upload":
    //   return ImageUpload
    // case "color-picker":
    //   return CustomColorField
    // case "jsonEditor":
    //   return JsonEditor
    default:
      return Input;
  }
};

export default getInputElement;
