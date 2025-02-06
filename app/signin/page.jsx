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
import supabase from "../config/configsupa";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const Login = () => {
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

  const handleLogin = async () => {
    if (!validateFields()) {
      return;
    }

    Swal.fire({
      title: "Logging in...",
      text: "Please wait while we authenticate you.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
        confirmButtonColor: "#3d18a3",
      });
    } else {
      Cookies.set("token", data.session.access_token, { expires: 7 });
      Cookies.set("userName", data.user.user_metadata.name, { expires: 7 });

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        confirmButtonColor: "#3d18a3",
      }).then(() => {
        router.push("/");
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
          Login
        </Typography>
        <Typography variant="body1" sx={{ color: "#666", mb: 3 }}>
          Welcome back! Please enter your credentials.
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Email"
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
            onClick={handleLogin}
          >
            Login
          </Button>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Don't have an account?{" "}
            <Button
              onClick={() => router.push("/auth")}
              sx={{ color: "#3d18a3", fontWeight: "bold" }}
            >
              Sign Up
            </Button>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Login;
