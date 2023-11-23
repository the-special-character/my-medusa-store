import { RouteConfig } from "@medusajs/admin";
import { Star } from "@medusajs/icons";
import { Table } from '@medusajs/ui'
import BodyCard from "../../components/body-card";
import TableViewHeader from "../../components/custom-table-header";
import { ProductReviewRepository } from "../../../repositories/product-review";
// import { ProductReviewRepository } from "src/repositories/product-review";

type Props = {}

const page = (props: Props) => {
  // console.log({ProductReviewRepository})
  
  return (
    <>
  
    <BodyCard
          customHeader={<TableViewHeader views={["reviews"]} />}
          className="h-fit"
        >
            <Table>
      <Table.Header>Head</Table.Header>
      <Table.HeaderCell>Cell</Table.HeaderCell>
      <Table.HeaderCell>Cell</Table.HeaderCell>
      <Table.HeaderCell>Cell</Table.HeaderCell>
      <Table.Row>Review 1</Table.Row>
      <Table.Row>Review 1</Table.Row>

      <Table.Row>Row</Table.Row>
      <Table.Row>Row</Table.Row>
      <Table.Row>Row</Table.Row>
      <Table.Row>Row</Table.Row>
      <Table.Row>Row</Table.Row>
      <Table.Row>Row</Table.Row>
    </Table>
          {/* <DiscountTable /> */}
        </BodyCard>
    </>
  )
}

export const config: RouteConfig = {
    link: {
      label: "Reviews",
      icon: Star,
    },
  };

export default page