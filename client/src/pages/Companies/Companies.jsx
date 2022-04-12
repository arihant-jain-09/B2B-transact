import React, { useEffect, useState } from 'react'
import axios from 'axios';
const Companies = () => {
  const [companies,setCompanies]=useState();
  useEffect(() => {
    const getData =async()=>{
      const {data}=await axios.get('/companies');
      setCompanies(data);
    }
    getData();
    return () => {
      
    }
  }, [])
  console.log(companies);
  
  return (
    <>Companies</>
  )
}

export default Companies