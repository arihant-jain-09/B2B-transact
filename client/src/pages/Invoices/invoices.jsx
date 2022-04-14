import React, { useEffect, useState } from 'react'
import axios from 'axios';
const Invoices = () => {
  const [invoices,setInvoices]=useState();
  useEffect(() => {
    const getData =async()=>{
      const {data}=await axios.get('/invoices');
      setInvoices(data);
    }
    getData();
    return () => {
      
    }
  }, [])
  console.log(invoices);
  
  return (
    <>invoices</>
  )
}

export default Invoices