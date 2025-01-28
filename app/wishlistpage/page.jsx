"use client";

import React, { useEffect, useState } from "react";
import supabase from "@/app/config/configsupa";
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import Link from "next/link";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);

  // Fetch Wishlist Items
  const fetchWishlist = async () => {
    const { data, error } = await supabase.from("wishlist").select("*");
    if (error) {
      console.error("Error fetching wishlist:", error);
    } else {
      setWishlist(data);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Delete item from wishlist
  const deleteFromWishlist = async (id) => {
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("id", id); // Delete by item id

    if (error) {
      console.error("Error deleting item:", error.message);
    } else {
      setWishlist(wishlist.filter((item) => item.id !== id)); // Update UI
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 ,height:"100vh"}}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Your Wishlist
      </Typography>

      {wishlist.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Your wishlist is empty.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {wishlist.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{ p: 3, boxShadow: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  {item.courseTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {item.courseShortDis}
                </Typography>
                <Link href={`/details/${item.courseId}`} passHref>
                  <Button variant="contained" sx={{ mt: 2 }}>
                    View Course
                  </Button>
                </Link>
                {/* Delete Button */}
                <Box mt={2}>
                  <IconButton
                    color="error"
                    onClick={() => deleteFromWishlist(item.id)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default WishlistPage;
