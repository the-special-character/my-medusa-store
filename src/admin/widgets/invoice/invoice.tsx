import type { WidgetConfig } from "@medusajs/admin";

const InvoiceWidget = (props) => {
  console.log(props);

  return (
    <div>
      <button type="button" onClick={() => {}}>
        Download Invoice
      </button>
    </div>
  );
};

export const config: WidgetConfig = {
  zone: "order.details.before",
};

export default InvoiceWidget;
