import { Route, Routes } from "react-router-dom"
import { RouteConfig } from "@medusajs/admin";
import { RocketLaunch } from "@medusajs/icons";
import BlogOverview from "./blogOverview";
import NewBlog from "./newBlog";
import BlogDetails from "./blogDetails";

const MarketingPage = () => {
  return (
    <Routes>
      <Route index element={<BlogOverview />} />
      <Route path="new" element={<NewBlog />} />
      <Route path=":id" element={<BlogDetails />} />
    </Routes>
  );
};

export const config: RouteConfig = {
  link: {
    label: "Marketing",
    icon: RocketLaunch,
  },
};

export default MarketingPage;
