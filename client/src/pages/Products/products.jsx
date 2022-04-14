import React, { useEffect, useState } from 'react'
import axios from 'axios';
const Products = () => {
  const [products,setProducts]=useState();
  useEffect(() => {
    const getData =async()=>{
      const {data}=await axios.get('/products');
      setProducts(data);
    }
    getData();
    return () => {
      
    }
  }, [])
  console.log(products);
  
  return (
    <>products</>
  )
}

export default Products