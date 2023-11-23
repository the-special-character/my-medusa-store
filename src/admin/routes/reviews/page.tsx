import { RouteConfig } from "@medusajs/admin";
import { Star } from "@medusajs/icons";

type Props = {}

const page = (props: Props) => {
  return (
    <div>hello world</div>
  )
}

export const config: RouteConfig = {
    link: {
      label: "Reviews",
      icon: Star,
    },
  };

export default page