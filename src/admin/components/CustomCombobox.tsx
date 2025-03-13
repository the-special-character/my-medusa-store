import {
  Combobox as PrimitiveCombobox,
  ComboboxDisclosure as PrimitiveComboboxDisclosure,
  ComboboxItem as PrimitiveComboboxItem,
  ComboboxPopover as PrimitiveComboboxPopover,
  ComboboxProvider as PrimitiveComboboxProvider,
} from "@ariakit/react";
import { Button, clx } from "@medusajs/ui";
import { matchSorter } from "match-sorter";
import React, { ForwardedRef, useEffect, useMemo, useState } from "react";

type ComboboxOption = {
  value: string;
  label: string;
  id: string;
  disabled?: boolean;
};

type ComboboxProps = {
  value?: string;
  onChange?: (value: string | undefined) => void;
  options: ComboboxOption[];
  setOptions: (newOptions: ComboboxOption[]) => void; // Function to update options
  placeholder?: string;
  className?: any;
};
const CustomCombobox = React.forwardRef(
  (
    {
      value,
      onChange,
      options,
      setOptions,
      placeholder = "Search...",
      className,
    }: ComboboxProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [searchValue, setSearchValue] = useState(value || "");
    const [open, setOpen] = useState(false);
    const [localOptions, setLocalOptions] = useState<ComboboxOption[]>(options);

    const selectedLabel = useMemo(() => {
      return localOptions.find((opt) => opt.id === value)?.label || "";
    }, [value, localOptions]);

    useEffect(() => {
      setLocalOptions(options);
      setSearchValue(selectedLabel || "");
    }, [options]);

    const trimmedSearchValue = searchValue.trim();

    const filteredOptions = useMemo(() => {
      return matchSorter(localOptions, trimmedSearchValue, { keys: ["label"] });
    }, [localOptions, trimmedSearchValue]);

    const handleValueChange = (selectedValue: string) => {
      const selectedOption = localOptions.find(
        (opt) => opt.value === selectedValue
      );
      if (!selectedOption) return;

      // Log to check selectedValue
      console.log("Selected value: ", selectedValue, selectedOption.id);

      onChange?.(selectedOption?.id); // Trigger parent onChange handler
      setSearchValue(selectedValue); // Set input field value
      setOpen(false); // Close the combobox popover
    };

    // const handleCreateOption = () => {
    //   const newOption = {
    //     value: trimmedSearchValue,
    //     label: trimmedSearchValue,
    //   };
    //   const updatedOptions = [...localOptions, newOption];

    //   // Update the local state with the new option
    //   setLocalOptions(updatedOptions);

    //   // Trigger selection of the newly created option
    //   handleValueChange(trimmedSearchValue);
    //   // Update the parent component with the new options as well
    //   setOptions(updatedOptions);
    // };

    return (
      <PrimitiveComboboxProvider
        open={open}
        setOpen={setOpen}
        value={searchValue}
        setValue={setSearchValue}
      >
        <div
          className={clx(
            "relative flex cursor-pointer items-center gap-x-2 overflow-hidden",
            "h-8 w-full rounded-md",
            "bg-ui-bg-field transition-fg shadow-borders-base",
            "has-[input:focus]:shadow-borders-interactive-with-active",
            "has-[:invalid]:shadow-borders-error has-[[aria-invalid=true]]:shadow-borders-error",
            "has-[:disabled]:bg-ui-bg-disabled has-[:disabled]:text-ui-fg-disabled has-[:disabled]:cursor-not-allowed",
            className
          )}
        >
          <PrimitiveCombobox
            ref={ref}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="txt-compact-small text-ui-fg-base !placeholder:text-ui-fg-muted transition-fg size-full cursor-pointer bg-transparent pl-2 pr-8 outline-none focus:cursor-text w-full"
          />
          <PrimitiveComboboxDisclosure className="absolute right-2" />
        </div>
        <PrimitiveComboboxPopover
          gutter={4}
          sameWidth
          role="listbox"
          className="shadow-elevation-flyout bg-ui-bg-base data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-10 max-h-52 overflow-y-auto"
        >
          {filteredOptions.length === 0 ? (
            <>
              {/* {trimmedSearchValue && (
                <div className="flex items-center gap-2 p-2">
                  {trimmedSearchValue}
                  <Button onClick={handleCreateOption} type="button">
                    Create
                  </Button>
                </div>
              )} */}
              <div className="flex items-center gap-2 p-2">
                No matching results
              </div>
            </>
          ) : (
            filteredOptions.map(({ value: optValue, label, disabled }) => (
              <PrimitiveComboboxItem
                focusOnHover
                key={optValue}
                value={optValue}
                disabled={disabled}
                onClick={() => handleValueChange(optValue)}
                className="transition-fg bg-ui-bg-base data-[active-item=true]:bg-ui-bg-base-hover group flex cursor-pointer items-center gap-x-2 rounded-[4px] px-2 py-1 text-sm"
              >
                {label}
              </PrimitiveComboboxItem>
            ))
          )}
        </PrimitiveComboboxPopover>
      </PrimitiveComboboxProvider>
    );
  }
);

CustomCombobox.displayName = "CustomCombobox";

export default CustomCombobox;

// import {
//   Combobox as PrimitiveCombobox,
//   ComboboxDisclosure as PrimitiveComboboxDisclosure,
//   ComboboxItem as PrimitiveComboboxItem,
//   ComboboxPopover as PrimitiveComboboxPopover,
//   ComboboxProvider as PrimitiveComboboxProvider,
// } from "@ariakit/react";
// import { Button, clx } from "@medusajs/ui";
// import { matchSorter } from "match-sorter";
// import React, { ForwardedRef, useEffect, useMemo, useState } from "react";

// type ComboboxOption = {
//   value: string;
//   label: string;
//   disabled?: boolean;
// };

// type RawOption = {
//   id: string;
//   title: string;
//   description: string;
// };

// type ComboboxProps = {
//   value?: string;
//   onChange?: (value: string | undefined) => void;
//   options: RawOption[];
//   setOptions: (newOptions: RawOption[]) => void; // Function to update options
//   placeholder?: string;
//   className?: any;
// };
// const CustomCombobox = React.forwardRef(
//   (
//     {
//       value,
//       onChange,
//       options,
//       setOptions,
//       placeholder = "Search...",
//       className,
//     }: ComboboxProps,
//     ref: ForwardedRef<HTMLInputElement>
//   ) => {
//     const [searchValue, setSearchValue] = useState(value || "");
//     const [open, setOpen] = useState(false);
//     const [localOptions, setLocalOptions] = useState<ComboboxOption[]>([]);

//     // Transform Raw Data to Match ComboboxOption Format
//     const transformedOptions = useMemo(
//       () =>
//         options.map((opt) => ({
//           value: opt.id, // Use id as value
//           label: opt.title, // Use title as label
//         })),
//       [options]
//     );

//     useEffect(() => {
//       setLocalOptions(
//         options.map((opt) => ({
//           value: opt.id, // Transform id to value
//           label: opt.title, // Transform title to label
//         }))
//       );
//       setSearchValue(value || "");
//     }, [options]);

//     const trimmedSearchValue = searchValue?.trim();
//     const filteredOptions = useMemo(() => {
//       return matchSorter(localOptions, trimmedSearchValue, { keys: ["label"] });
//     }, [localOptions, trimmedSearchValue]);

//     const handleValueChange = (selectedValue: string) => {
//       // Log to check selectedValue
//       console.log("Selected value: ", selectedValue);

//       onChange?.(selectedValue); // Trigger parent onChange handler
//       setSearchValue(selectedValue); // Set input field value
//       setOpen(false); // Close the combobox popover
//     };

//     // const handleCreateOption = () => {
//     //   const newOption = {
//     //     value: trimmedSearchValue,
//     //     label: trimmedSearchValue,
//     //   };
//     //   const updatedOptions = [...localOptions, newOption];

//     //   // Update the local state with the new option
//     //   setLocalOptions(updatedOptions);

//     //   // Trigger selection of the newly created option
//     //   handleValueChange(trimmedSearchValue);
//     //   // Update the parent component with the new options as well
//     //   setOptions(updatedOptions);
//     // };

//     return (
//       <PrimitiveComboboxProvider
//         open={open}
//         setOpen={setOpen}
//         value={searchValue}
//         setValue={setSearchValue}
//       >
//         <div
//           className={clx(
//             "relative flex cursor-pointer items-center gap-x-2 overflow-hidden",
//             "h-8 w-full rounded-md",
//             "bg-ui-bg-field transition-fg shadow-borders-base",
//             "has-[input:focus]:shadow-borders-interactive-with-active",
//             "has-[:invalid]:shadow-borders-error has-[[aria-invalid=true]]:shadow-borders-error",
//             "has-[:disabled]:bg-ui-bg-disabled has-[:disabled]:text-ui-fg-disabled has-[:disabled]:cursor-not-allowed",
//             className
//           )}
//         >
//           <PrimitiveCombobox
//             ref={ref}
//             onFocus={() => setOpen(true)}
//             placeholder={placeholder}
//             className="txt-compact-small text-ui-fg-base !placeholder:text-ui-fg-muted transition-fg size-full cursor-pointer bg-transparent pl-2 pr-8 outline-none focus:cursor-text"
//           />
//           {/* <PrimitiveCombobox
//             ref={ref}
//             value={
//               localOptions.find((opt) => opt.value === searchValue)?.label || ""
//             }
//             onChange={(e) => setSearchValue(e.target.value)}
//             onFocus={() => setOpen(true)}
//             placeholder={placeholder}
//             className="txt-compact-small text-ui-fg-base !placeholder:text-ui-fg-muted transition-fg size-full cursor-pointer bg-transparent pl-2 pr-8 outline-none focus:cursor-text"
//           /> */}
//           <PrimitiveComboboxDisclosure className="absolute right-2" />
//         </div>
//         <PrimitiveComboboxPopover
//           gutter={4}
//           sameWidth
//           role="listbox"
//           className="shadow-elevation-flyout bg-ui-bg-base data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-10 max-h-52 overflow-y-auto"
//         >
//           {filteredOptions.length === 0 ? (
//             // <>
//             //   {trimmedSearchValue && (
//             //     <div className="flex items-center gap-2 p-2">
//             //       {trimmedSearchValue}
//             //       <Button onClick={handleCreateOption} type="button">
//             //         Create
//             //       </Button>
//             //     </div>
//             //   )}
//             // </>
//             <div className="flex items-center gap-2 p-2">
//               No matching results
//             </div>
//           ) : (
//             filteredOptions.map(({ value: optValue, label }) => {
//               return (
//                 <PrimitiveComboboxItem
//                   focusOnHover
//                   key={optValue}
//                   value={optValue}
//                   // disabled={disabled}
//                   onClick={() => handleValueChange(optValue)}
//                   className="transition-fg bg-ui-bg-base data-[active-item=true]:bg-ui-bg-base-hover group w-full flex cursor-pointer items-center gap-x-2 rounded-[4px] px-2 py-1 text-sm"
//                 >
//                   {label}
//                 </PrimitiveComboboxItem>
//               );
//             })
//           )}
//         </PrimitiveComboboxPopover>
//       </PrimitiveComboboxProvider>
//     );
//   }
// );

// CustomCombobox.displayName = "CustomCombobox";

// export default CustomCombobox;
