"use client";

import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Stack,
  Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import supabase from "../config/configsupa";

function Register() {
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
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async () => {
    if (!validateFields()) {
      return;
    }

    Swal.fire({
      title: "Registering...",
      text: "Please wait while we create your account.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "You have successfully registered. Redirecting to login...",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        router.push("/signin");
      });
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        mt: 8,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#3d18a3" }}
        >
          Create an Account
        </Typography>
        <Typography variant="body1" sx={{ color: "#666", mb: 3 }}>
          Start your journey with us today!
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              style: { borderRadius: 10 },
            }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              style: { borderRadius: 10 },
            }}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#3d18a3",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: 10,
              p: 1.5,
              "&:hover": { backgroundColor: "#2a0e6e" },
            }}
            onClick={handleRegister}
          >
            Register
          </Button>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Already have an account?{" "}
            <Button
              onClick={() => router.push("/signin")}
              sx={{ color: "#3d18a3", fontWeight: "bold" }}
            >
              Login
            </Button>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}

export default Register;
