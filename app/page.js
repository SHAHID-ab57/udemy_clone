"use client"
import Image from "next/image";
import styles from "./page.module.css";
import {Box, Typography} from "@mui/material"
import Banner from "@/Layout/Banner";

import { useEffect, useState } from "react";
import supabase from "./config/configsupa";
import Gmail from "@/Layout/Gmail";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data:courseUpload, error } = await supabase.from("courseUpload").select();
        if (error) {
          setError(error.message);
        } else {
          setData(courseUpload);
        }
      } catch (err) {
        setError("Unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log("Data", data);
  console.log("error",error);
  
  
  
  
  return (
   <>
   <Banner/>
   <Gmail/>
   <Box>
    <Typography variant="h2" align="center">
      This is the page
    </Typography>
   </Box>
   </>
  );
}
