import { createColumnHelper, Table as TableType } from "@tanstack/react-table";
import { Container, Heading } from "@medusajs/ui";
import CustomTable from "../../../components/CustomTable";
import { Cart } from "@medusajs/medusa";

const columnHelper = createColumnHelper<Cart>();
const column = columnHelper.accessor("customer.first_name", {});
const column1 = columnHelper.display({
	id: "actions",
	cell: (info) => {},
});
export type Column = typeof column & typeof column1;

interface Props {
	data: Cart[];
	PAGE_SIZE: number;
	columns: Column[];
	heading: string;
	table: TableType<Cart>;
}

const CartTable = ({ data, PAGE_SIZE, columns, heading, table }: Props) => {
	return (
		<Container className="overflow-hidden p-0">
			<div className="flex items-center justify-between py-4 px-6">
				<Heading>{heading}</Heading>
			</div>
			<CustomTable
				PAGE_SIZE={PAGE_SIZE}
				data={data}
				table={table}
				columns={columns}
				heading={heading}
			/>
		</Container>
	);
};

export default CartTable;
