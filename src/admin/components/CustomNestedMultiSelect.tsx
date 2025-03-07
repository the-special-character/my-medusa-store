import { Button, Checkbox, Input, IconButton, Popover } from "@medusajs/ui";
import { ChevronDown, ChevronRight } from "@medusajs/icons";
import { useState, forwardRef, useEffect } from "react";

type Option = {
  title: string;
  value: string;
  id: string;
  children?: Option[];
};

type NestedMultiSelectProps = {
  value: string[] | undefined;
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  name?: string;
  options: Option[];
  placeholder?: string;
};

const NestedMultiSelect = forwardRef<HTMLDivElement, NestedMultiSelectProps>(
  (
    {
      value,
      onChange,
      onBlur,
      name,
      options,
      placeholder = "Select options...",
    },
    ref
  ) => {
    console.log({ value });

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedValues, setSelectedValues] = useState<string[]>(value || []);

    // Sync internal state with external value
    useEffect(() => {
      setSelectedValues(value || []);
    }, [value]);

    const filterOptions = (options: Option[], searchTerm: string): Option[] => {
      return options
        .filter((option) => {
          const matchesSearch = option.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          const hasMatchingChildren = option.children
            ? filterOptions(option.children, searchTerm).length > 0
            : false;
          return matchesSearch || hasMatchingChildren;
        })
        .map((option) => ({
          ...option,
          children: option.children
            ? filterOptions(option.children, searchTerm)
            : undefined,
        }));
    };

    const getAllChildValues = (option: Option): string[] => {
      let values = [option.id];
      if (option.children) {
        option.children.forEach((child) => {
          values = values.concat(getAllChildValues(child));
        });
      }
      return values;
    };

    const handleSelect = (option: Option) => {
      const allValues = getAllChildValues(option);
      let newValues: string[];

      if (selectedValues.includes(option.id)) {
        newValues = selectedValues.filter((v) => !allValues.includes(v));
      } else {
        newValues = [...new Set([...selectedValues, ...allValues])];
      }

      setSelectedValues(newValues);
      onChange(newValues);
      onBlur?.();
    };

    const filteredOptions = filterOptions(options, search);

    return (
      <div ref={ref} className="">
        <Popover
          modal
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
              setSearch("");
            }
          }}
        >
          <Popover.Trigger asChild>
            <Button
              variant="secondary"
              className="w-full justify-between"
              type="button"
              name={name}
            >
              {selectedValues.length > 0
                ? `${selectedValues.length} selected`
                : placeholder}
              <ChevronDown className="ml-2" />
            </Button>
          </Popover.Trigger>

          <Popover.Content className="container h-[30dvh] w-screen overflow-auto">
            <Input
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
              type="text"
            />
            <div>
              {filteredOptions.map((option) => (
                <OptionItem
                  key={option.value}
                  option={option}
                  value={selectedValues}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </Popover.Content>
        </Popover>
      </div>
    );
  }
);

NestedMultiSelect.displayName = "NestedMultiSelect";

const OptionItem = ({
  option,
  value,
  onSelect,
  depth = 0,
}: {
  option: Option;
  value: string[];
  onSelect: (option: Option) => void;
  depth?: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = option.children && option.children.length > 0;

  return (
    <div className="h-full">
      <div
        className="hover:bg-ui-bg-base-hover flex cursor-pointer items-center px-3 py-2"
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        <div
          className="flex flex-1 items-center"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(option);
          }}
        >
          <Checkbox
            className="mr-2"
            checked={value.includes(option.id)}
            // value={option.value}
            onChange={() => onSelect(option)}
          />
          <span className={`ml-${depth * 4}`}>{option.title}</span>
        </div>
        {hasChildren && (
          <IconButton type="button">
            {isOpen ? <ChevronDown /> : <ChevronRight />}
          </IconButton>
        )}
      </div>
      {hasChildren && isOpen && (
        <div className="ml-4">
          {option.children?.map((child) => (
            <OptionItem
              key={child.value}
              option={child}
              value={value}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NestedMultiSelect;
