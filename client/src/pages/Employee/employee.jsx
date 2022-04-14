import React, { useEffect, useState } from 'react'
import axios from 'axios';
const Employee = () => {
  const [employee,setEmployee]=useState();
  useEffect(() => {
    const getData =async()=>{
      const {data}=await axios.get('/employee');
      setEmployee(data);
    }
    getData();
    return () => {
      
    }
  }, [])
  console.log(employee);
  
  return (
    <>employee</>
  )
}

export default Employee