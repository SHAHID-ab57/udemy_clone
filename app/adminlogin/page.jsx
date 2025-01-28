"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Swal from 'sweetalert2'; // Import SweetAlert2

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (email === "admin@gmail.com" && password === "1234") {
      setError("");

      // Show SweetAlert success message
      Swal.fire({
        icon: 'success',
        title: 'Welcome Admin',
        text: 'You have successfully logged in!',
        confirmButtonColor: '#3d18a3', // Optional, to match your button color
      }).then(() => {
        // Redirect to admin dashboard after SweetAlert closes
        router.push("/admin");
      });
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 400,
          width: "100%",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ color: "#3d18a3", fontWeight: "bold" }}
        >
          Admin Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          margin="normal"
          required
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          margin="normal"
          required
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          sx={{
            mt: 2,
            backgroundColor: "#3d18a3",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#2a0d7a",
            },
          }}
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
};

export default AdminLogin;
