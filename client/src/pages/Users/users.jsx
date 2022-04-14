import React, { useEffect, useState } from 'react'
import axios from 'axios';
const Users = () => {
  const [users,setUsers]=useState();
  useEffect(() => {
    const getData =async()=>{
      const {data}=await axios.get('/users');
      setUsers(data);
    }
    getData();
    return () => {
      
    }
  }, [])
  console.log(users);
  
  return (
    <>users</>
  )
}

export default Users