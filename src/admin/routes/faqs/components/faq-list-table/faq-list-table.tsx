import { Button, Container, Heading, Table } from "@medusajs/ui";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FaqActions from "../FaqActions";
import { FaqType } from "../../page";

export const FaqListTable = () => {
  const [faqsData, setFaqsData] = useState([]);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.MEDUSA_BACKEND_URL}/admin/faq`,
          {
            credentials: "include",
          }
        );

        const res = await response.json();

        return setFaqsData(res?.faqs[0]);
      } catch (error) {
        console.log(error);
      }
    };

    getAllProducts();
    return () => {};
  }, []);
  if (!faqsData && !faqsData.length) return;

  const { t } = useTranslation();
  return (
    <Container className="divide-y overflow-hidden p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>Faqs</Heading>
        <Button size="base" variant="secondary" asChild>
          <Link to="create">{t("actions.create")}</Link>
        </Button>
      </div>

      {faqsData.length === 0 ? (
        <div className="flex w-full flex-col items-center justify-center gap-4 py-12 text-center">
          <h3 className="text-xl font-semibold tracking-tight">
            No FAQs found
          </h3>
          <p className="text-muted-foreground text-sm">
            Get started by creating your first FAQ to help your users.
          </p>
          <Button size="base" variant="secondary" asChild>
            <Link to="create">{t("actions.create")}</Link>
          </Button>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Sr. No</Table.HeaderCell>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Category</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {faqsData
              ?.sort(
                (a: FaqType, b: FaqType) =>
                  new Date(b.updated_at).getTime() -
                  new Date(a.updated_at).getTime()
              )
              .map((faq: FaqType, index) => {
                return (
                  <Table.Row
                    key={faq.id}
                    className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap"
                  >
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>{faq.title}</Table.Cell>
                    <Table.Cell>{faq.description}</Table.Cell>
                    <Table.Cell>{faq?.faqCategory?.title}</Table.Cell>
                    {/* <Table.Cell>
                    <DateCell date={faq.created_at} />
                  </Table.Cell> */}
                    <Table.Cell>
                      <FaqActions faqId={faq.id} />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
          </Table.Body>
        </Table>
      )}
      <Outlet />
    </Container>
  );
};
