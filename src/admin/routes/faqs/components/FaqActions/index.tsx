import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons";
import { Button, DropdownMenu } from "@medusajs/ui";
import { Link, useNavigate } from "react-router-dom";

const FaqActions = ({
  faqId,
  onEdit,
}: {
  faqId: string;
  onEdit: () => void;
}) => {
  const navigate = useNavigate();
  const handleDelete = async () => {
    try {
      // const deleteFaqResponse = await fetch(
      //   `${backendUrl}/admin/faqs/${faqId}`,
      //   {
      //     method: "DELETE",
      //     credentials: "include",
      //   }
      // )
      const deleteFaqResponse = await fetch(
        `${process.env.MEDUSA_ADMIN_BACKEND_URL}/admin/faq/${faqId}`,
        {
          credentials: "include",
          method: "DELETE",
        }
      );
      if (deleteFaqResponse) {
        navigate(0);
      }
    } catch (error: any) {
      console.log(`failed to delete Faq : ${error.message}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger
        asChild
        onChange={(e) => {
          console.log(e);
        }}
      >
        <Button variant="secondary" size="base" className="h-6 w-6 p-0">
          <EllipsisHorizontal />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={() => onEdit()} className="gap-x-2">
          <PencilSquare className="text-ui-fg-subtle" />
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={handleDelete} className="gap-x-2">
          <Trash className="text-ui-fg-subtle" />
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

export default FaqActions;
