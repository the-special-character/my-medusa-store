import { RouteConfig } from "@medusajs/admin";
import { RocketLaunch } from "@medusajs/icons";
import { Tabs, Toaster } from "@medusajs/ui";
import ListFaqs from "./components/ListFaqs";
import ListFaqCategories from "./components/ListFaqCategories";
import { useNavigate, useSearchParams } from "react-router-dom";

const page = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentTab = searchParams.get("tab") || "faqs";
  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };
  return (
    <div className="relative bg-white p-2">
      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="space-y-4"
      >
        <Tabs.List>
          <Tabs.Trigger value="faqs">FAQs</Tabs.Trigger>
          <Tabs.Trigger value="faq_categories">FAQ Categories</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="faqs">
          <ListFaqs />
        </Tabs.Content>
        <Tabs.Content value="faq_categories">
          <ListFaqCategories />
        </Tabs.Content>
      </Tabs>
    </div>
  );
};

export const config: RouteConfig = {
  link: {
    label: "Faqs",
    icon: RocketLaunch,
  },
};

export default page;
