"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Swal from "sweetalert2"; // Import SweetAlert2

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const router = useRouter();

  const validateFields = () => {
    let valid = true;
    let newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = () => {
    if (!validateFields()) {
      return;
    }

    if (email === "admin@gmail.com" && password === "1234") {
      setErrors({ email: "", password: "" });

      // Show SweetAlert success message
      Swal.fire({
        icon: "success",
        title: "Welcome Admin",
        text: "You have successfully logged in!",
        confirmButtonColor: "#3d18a3",
      }).then(() => {
        // Redirect to admin dashboard after SweetAlert closes
        router.push("/admin");
      });
    } else {
      setErrors({ ...errors, password: "Invalid email or password." });
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

        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          margin="normal"
          required
          error={!!errors.email}
          helperText={errors.email}
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
          error={!!errors.password}
          helperText={errors.password}
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
