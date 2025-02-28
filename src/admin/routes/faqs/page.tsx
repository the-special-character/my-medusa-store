"use client";
import { RouteConfig } from "@medusajs/admin";
import { useEffect, useState, useCallback } from "react";
import { Star, XMark } from "@medusajs/icons";
import { Container, Heading, Text } from "@medusajs/ui";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

const page = () => {
  return (
    <Container>
      <Heading>Hello world</Heading>
      <Text>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi
        adipisci animi necessitatibus blanditiis incidunt voluptatibus
        consequuntur dolorem sunt veritatis laudantium quaerat debitis officiis,
        ut nihil laborum aut ipsum quasi eos, accusantium dolor accusamus
        repellendus reiciendis vero consequatur? Iste est asperiores voluptates
        suscipit unde consectetur minus praesentium incidunt, iure quia non
        inventore eos animi temporibus alias fugiat commodi totam. Quos sapiente
        itaque repudiandae reiciendis sint at et error voluptates a officia
        libero ducimus rerum quia, tenetur quasi quae fugit in ut? Ipsum
        officiis temporibus alias accusantium sit eius beatae incidunt
        consequatur ab? Dolor animi eaque facere. Cum optio dolor aliquam
        dolore.
      </Text>
    </Container>
  );
};

export const config: RouteConfig = {
  link: {
    label: "Faqs",
    icon: XMark,
  },
};

export default page;
