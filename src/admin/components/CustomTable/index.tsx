import { flexRender, Table as TableType } from "@tanstack/react-table";
import { Table } from "@medusajs/ui";

type Props = {
	data: any[];
	PAGE_SIZE: number;
	table: TableType<any>;
};

const CustomTable = ({ PAGE_SIZE, table, data }: Props) => {
	const TABLE_HEIGHT = (PAGE_SIZE + 1) * 48;
	return (
		<>
			<div
				style={{
					// height: TABLE_HEIGHT,
					height: "calc(100vh - 225px)",
					overflow: "scroll",
					position: "relative",
				}}
			>
				<Table>
					<Table.Header className="sticky top-0 bg-white">
						{table?.getHeaderGroups()?.map((headerGroup) => {
							return (
								<Table.Row
									key={headerGroup.id}
									className="[&_th]:w-1/5 [&_th:last-of-type]:w-[1%]"
								>
									{headerGroup.headers.map((header) => {
										return (
											<Table.HeaderCell key={header.id}>
												{flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
											</Table.HeaderCell>
										);
									})}
								</Table.Row>
							);
						})}
					</Table.Header>
					<Table.Body className="border-b-0">
						{table.getRowModel().rows.map((row) => (
							<Table.Row
								key={row.id}
								className={"cursor-pointer [&_td:last-of-type]:w-[1%]"}
							>
								{row.getVisibleCells().map((cell) => (
									<Table.Cell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</Table.Cell>
								))}
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			</div>
			<Table.Pagination
				count={data.length}
				canNextPage={table.getCanNextPage()}
				canPreviousPage={table.getCanPreviousPage()}
				nextPage={table.nextPage}
				previousPage={table.previousPage}
				pageIndex={table.getState().pagination.pageIndex}
				pageCount={table.getPageCount()}
				pageSize={PAGE_SIZE}
			/>
		</>
	);
};

export default CustomTable;
