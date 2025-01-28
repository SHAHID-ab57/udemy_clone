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

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [userId, setUserId] = useState("");

  // Fetch user data from cookies on component mount
  useEffect(() => {
    const storedUserId = Cookies.get("userName"); // Storing the userId instead of userName
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error("No user found in cookies. Please log in.");
    }
  }, []);

  // Fetch the cart data whenever the userId is updated
  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  // Fetch cart items for the current user
  const fetchCart = async () => {
    try {
      const { data, error } = await supabase
        .from("cart")
        .select("*")
        

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

  // Calculate the total price of items in the cart
  const calculateTotal = (cartItems) => {
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.coursePrice * item.quantity,
      0
    );
    setTotal(totalPrice.toFixed(2));
  };

  // Update the quantity of a cart item
  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) {
      alert("Quantity cannot be less than 1");
      return;
    }

    try {
      const { error } = await supabase
        .from("cart")
        .update({ quantity })
        .eq("id", id)
        // .eq("userId", userId); // Ensuring we update the right user's cart

      if (error) {
        console.error("Error updating quantity:", error.message);
        return;
      }

      fetchCart();
    } catch (err) {
      console.error("Unexpected error updating quantity:", err);
    }
  };

  // Remove an item from the cart
  const removeFromCart = async (id) => {
    try {
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("id", id)
        // .eq("userId", userId); // Ensuring we remove the right user's item

      if (error) {
        console.error("Error removing item from cart:", error.message);
        return;
      }

      fetchCart();
    } catch (err) {
      console.error("Unexpected error removing item:", err);
    }
  };

  // Handle the checkout process
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Please add items to checkout.");
      return;
    }

    try {
      // Prepare order details
      const orderDetails = cart.map(({ courseId, courseTitle, coursePrice, quantity }) => ({
        courseId,
        courseTitle,
        coursePrice,
        quantity,
      }));

      // Insert the order into the "orders" table
      const { error } = await supabase.from("orders").insert([
        {
          courseId:orderDetails.courseId,
          userId,
          orderDetails,
          totalPrice: parseFloat(total),
        },
      ]);

      if (error) {
        console.error("Error placing order:", error.message);
        alert(`Error placing order: ${error.message}`);
        return;
      }

      // Clear the cart for the current user
      // const { error: clearError } = await supabase
      //   .from("cart")
      //   .delete()
      //   .eq("courseId",orderDetails?.courseId ); 

      // if (clearError) {
      //   console.error("Error clearing cart:", clearError.message);
      //   alert("Order placed, but there was an issue clearing the cart.");
      //   return;
      // }

      // Reset cart state
      setCart([]);
      setTotal(0);
      alert("Order placed successfully, and your cart has been cleared!");
    } catch (err) {
      console.error("Unexpected error during checkout:", err);
      alert("Unexpected error occurred during checkout. Please try again.");
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
