import { RouteConfig } from "@medusajs/admin";
import { RocketLaunch } from "@medusajs/icons";

const BlogPage = () => {
  return <div>This is my custom route</div>;
};

export const config: RouteConfig = {
    link: {
      label: "Blogs",
      icon: RocketLaunch,
    },
  }
  

export default BlogPage;
