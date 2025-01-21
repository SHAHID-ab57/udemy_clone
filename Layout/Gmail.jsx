import supabase from '@/app/config/configsupa';
import { Box, Button, TextField } from '@mui/material'
import React from 'react'

const Gmail = () => {
    const [email,setEmail] = React.useState("")

    console.log("email",email);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Send the email to the server
        console.log("Sending email to", email);
        // Clear the input field
        setEmail("")

        const {data , error} = await supabase.from("client")
        .insert([{
            gmail:email,
            
        }]).select()

console.log("data",data);
console.log("error",error);

    }

  return (
    <Box
    component="form"
    onSubmit={handleSubmit}
    >
 <TextField
 type='text'
 label='Email'
 variant='outlined'
 fullWidth
onChange={(e)=>setEmail(e.target.value)}
 />

 <Button type="submit">
     Submit Email
 </Button>
    </Box>
  )
}

export default Gmail
