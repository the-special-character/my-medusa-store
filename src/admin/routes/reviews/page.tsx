"use client"
import { RouteConfig } from "@medusajs/admin";
import {useEffect,useState,useCallback} from 'react'
import { Star } from "@medusajs/icons";
import { Table } from '@medusajs/ui'
import { ProductReviewRepository } from "../../../repositories/product-review";
// import { ProductReviewRepository } from "src/repositories/product-review";

type Props = {}
export async function getAllProducts(set:(r:any)=>void){
  try {
    const response = await fetch(`http://localhost:9000/store/reviews`)
    const res = await response.json()
    set(res.productReview)
    
    return res
  } catch (error) {
    console.log({error})
  }
}
export async function deleteProduct(id:string){
  try {
    const response = await fetch(`http://localhost:9000/store/reviews/${id}`,{
      method:"DELETE",
      headers:{
      }
    })
    const res = await response.json()
    console.log({res},"delete success");
    alert("delete success")
    return res
  } catch (error) {
    console.log({error})
  }
}

const page = (props: Props) => {
  const [reviews, setReviews] = useState([])
  useEffect(() => {
   getAllProducts(setReviews)
  
    return () => {
      
    }
  }, [])
  
  // const reviews = await getAllProducts()
  const handleDelete =useCallback(
    (id:string) => {
      deleteProduct(id)
      getAllProducts(setReviews)
    },
    [],
  )
  
  return (
    <>
  
  
  <Table>
      <Table.Header>
        <Table.Row>
          {/* {columns.map(col =><Table.HeaderCell>{col}</Table.HeaderCell> )} */}
          <Table.HeaderCell>Title</Table.HeaderCell>
          <Table.HeaderCell>Description</Table.HeaderCell>
          <Table.HeaderCell>Actions</Table.HeaderCell>

        </Table.Row>
      </Table.Header>
      <Table.Body>
        {reviews?.map((review) => {
          return (
            <Table.Row
              key={review?.id}
              className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap"
            >
              <Table.Cell>{review?.title}</Table.Cell>
              <Table.Cell>{review?.content}</Table.Cell>
              <Table.Cell>
                <button onClick={() => {
                  handleDelete(review?.id)
                }}>delete</button>
              </Table.Cell>
            </Table.Row>
          )
        })}
         
      </Table.Body>
    </Table>
          {/* <DiscountTable /> */}
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