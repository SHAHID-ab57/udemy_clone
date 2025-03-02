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
  TextField,
} from "@mui/material";
import { Delete, Add, Remove } from "@mui/icons-material";
import Cookies from "js-cookie";
import Swal from 'sweetalert2'; // Import SweetAlert2
import { useRouter } from "next/navigation";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [userId, setUserId] = useState("");
const router = useRouter()
  useEffect(() => {
    const storedUserId = Cookies.get("userName");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error("No user found in cookies. Please log in.");
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  const fetchCart = async () => {
    try {
      const { data, error } = await supabase.from("cart").select("*");

      if (error) {
        console.error("Error fetching cart:", error.message);
        return;
      }

      if (data) {
        setCart(data);
        calculateTotal(data);
      }
    } catch (err) {
      console.error("Unexpected error fetching cart:", err);
    }
  };

  const calculateTotal = (cartItems) => {
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.coursePrice * item.quantity,
      0
    );
    setTotal(totalPrice.toFixed(2));
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) {
      alert("Quantity cannot be less than 1");
      return;
    }

    try {
      const { error } = await supabase
        .from("cart")
        .update({ quantity })
        .eq("id", id);

      if (error) {
        console.error("Error updating quantity:", error.message);
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Quantity Updated',
        text: 'The quantity has been updated successfully!',
      });

      fetchCart();
    } catch (err) {
      console.error("Unexpected error updating quantity:", err);
    }
  };

  const removeFromCart = async (id) => {
    try {
      // Confirm deletion using SweetAlert
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this action!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        const { error } = await supabase
          .from("cart")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("Error removing item from cart:", error.message);
          return;
        }

        Swal.fire({
          icon: 'success',
          title: 'Item Removed',
          text: 'The item has been removed from your cart.',
        });

        fetchCart();
      }
    } catch (err) {
      console.error("Unexpected error removing item:", err);
    }
  };
 
  const handleCheckout = async () => {
    if (cart.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Cart is Empty",
        text: "Please add items to your cart before checking out.",
      });
      return;
    }
  
    try {
      const orderDetails = cart.map(({ id, courseId, courseTitle, coursePrice, quantity }) => ({
        id, // Include cart item ID for deletion
        courseId,
        courseTitle,
        coursePrice,
        quantity,
      }));
  
      const { error } = await supabase.from("orders").insert([
        {
          userId,
          orderDetails,
          totalPrice: parseFloat(total),
        },
      ]);
  
      if (error) {
        console.error("Error placing order:", error.message);
        Swal.fire({
          icon: "error",
          title: "Order Failed",
          text: `Error placing order: ${error.message}`,
        });
        return;
      }
  
      // Delete purchased items from the cart
      const cartItemIds = cart.map(item => item.id);
      const { error: deleteError } = await supabase
        .from("cart")
        .delete()
        .in("id", cartItemIds); // Delete items by their IDs
  
      if (deleteError) {
        console.error("Error clearing cart:", deleteError.message);
        Swal.fire({
          icon: "error",
          title: "Cart Clear Failed",
          text: `Error clearing cart: ${deleteError.message}`,
        });
        return;
      }
  
      // Reset state
      setCart([]);
      setTotal(0);
  
      Swal.fire({
        icon: "success",
        title: "Order Placed!",
        text: "Your order has been successfully placed.",
      });
  
      router.push("/");
    } catch (err) {
      console.error("Unexpected error during checkout:", err);
      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: "An error occurred during checkout. Please try again.",
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, height: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Your Cart
      </Typography>

      {cart.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Your cart is empty.
        </Typography>
      ) : (
        <>
          <Grid container spacing={4}>
            {cart.map((item) => (
              <Grid item xs={12} key={item.id}>
                <Card sx={{ p: 3, display: "flex", alignItems: "center", gap: 3 }}>
                  <Box flexGrow={1}>
                    <Typography variant="h6" fontWeight="bold">
                      {item.courseTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: ₹{item.coursePrice}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <IconButton onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Remove />
                    </IconButton>
                    <TextField
                      value={item.quantity}
                      inputProps={{ readOnly: true }}
                      size="small"
                      sx={{ width: 50, textAlign: "center" }}
                    />
                    <IconButton onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Add />
                    </IconButton>
                  </Box>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Delete />
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box mt={4}>
            <Typography variant="h5" fontWeight="bold">
              Total: ₹{total}
            </Typography>
            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                bgcolor: "#5022c3",
                "&:hover": { bgcolor: "#3e1a9e" },
              }}
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default CartPage;
