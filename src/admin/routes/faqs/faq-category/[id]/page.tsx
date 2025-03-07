import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Page = () => {
  const params = useParams();

  const id = params.id;
  const [selectedfaq, setSelectedFaq] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchselectedfaq = async () => {
      try {
        const res = await fetch(
          `${process.env.MEDUSA_BACKEND_URL}/admin/faq/faq-category/${id}`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch selectedfaq");
        }

        const { faq } = await res.json();
        setSelectedFaq(faq);
      } catch (error) {
        console.error("Error fetching selectedfaq:", error);
      }
    };

    fetchselectedfaq();
  }, [id]);

  console.log({ selectedfaq });

  return (
    <div>
      <h1>FAQ category page</h1>
    </div>
  );
};

export default Page;
