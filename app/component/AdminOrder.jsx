"use client";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import supabase from "../config/configsupa";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase.from("orders").select("*");
      if (error) {
        console.error("Error fetching orders:", error);
      } else {
        setOrders(data);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom sx={{ color: "#5022c3", fontWeight: "bold" }}>
        Orders
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={200}>
          <CircularProgress sx={{ color: "#5022c3" }} />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#5022c3" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Order ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Created At</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>User ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Order Details</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Total Price ($)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                  <TableCell>{order.userId}</TableCell>
                  <TableCell>{JSON.stringify(order.orderDetails[0])}</TableCell>
                  <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default OrdersPage;
