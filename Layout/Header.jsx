"use client"
import React from 'react'
import {AppBar, Box, Button, IconButton, InputAdornment, TextField, Toolbar, Typography} from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useRouter } from 'next/navigation';
const Header = () => {
  const router = useRouter()
  return (
    <>
    <Box sx={{
        backgroundColor:"#5022c3"
    }}>
        <Box>
           <Typography variant='body1' align="center" sx={{
            color:"#fff",
            fontWeight:700,
           fontSize:13,
           p:1.5
           }}>
           Ready to get with the times? | <span style={{
            fontWeight:500,
            
           }}>Get the skills with Udemy Business.</span>
           </Typography>
        </Box>
    </Box>
   <AppBar sx={{
    position:"static",
    backgroundColor:"#fff",
    // color:"#000",
    boxShadow:1.5
    }}>
     <Toolbar sx={{
        alignContent:"center",
     }}>
      <Box
      
      onClick={()=>router.push("/")}
      >
        <img src="https://frontends.udemycdn.com/frontends-homepage/staticx/udemy/images/v7/logo-udemy.svg" alt="loading..." style={{
            height:30,
            width:120,
            cursor:"pointer"
        
        }}/>
        </Box>

        <Button sx={{
            color:"#000",
            fontSize:"10px",
            "&:hover":{
                backgroundColor:"#daaff9",
                color:"#fff"
               
            }
        }}>
            Explore
        </Button>
        <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '500px', 
        height: '40px', 
        borderRadius: '30px', 
        backgroundColor: '#f5f5f5',
        p:1,
         mx:4,
         border: "1px solid #000",
        boxSizing: 'border-box',
        '&:hover': {
            border:"none",
          backgroundColor: '#ddd',
        },
        '&:focus-within': {
            border:"none",
          outline: '1px solid #7F00FF', 
        },
      }}
    >
      <InputAdornment position="start">
        <SearchIcon />
      </InputAdornment>
      <input
        type="text"
        placeholder="Search..."
        
        style={{
          flex: 1,
          height: '100%',
          border: 'none',
          outline: 'none',
          fontSize: '14px',
          backgroundColor: 'transparent',
        }}
      />
    </Box>
    <Box>
        <Button sx={{
            color:"#000",
            fontSize:"10px",
            "&:hover":{
                backgroundColor:"#daaff9",
                color:"#fff"
               
            }
        }}>
     Plan & Pricing
        </Button>
        <Button sx={{
            color:"#000",
            fontSize:"10px",
            "&:hover":{
                backgroundColor:"#daaff9",
                color:"#fff"
               
            }
        }}>
    Udemy Business
        </Button>
        <Button
        onClick={()=>router.push("teacher")}
        sx={{
            color:"#000",
            fontSize:"10px",
            "&:hover":{
                backgroundColor:"#daaff9",
                color:"#fff"
               
            }
            
        }}
        >
       Teach on Udemy
        </Button>
    </Box>

    <IconButton
     sx={{
        color:"#000",
        fontSize:"20px",
        "&:hover":{
            backgroundColor:"#daaff9",
            color:"#fff"
           
        }
    }}
    >
        <ShoppingCartIcon 
       
        />
    </IconButton>

     </Toolbar>
   </AppBar>
   </>
  )
}

export default Header
