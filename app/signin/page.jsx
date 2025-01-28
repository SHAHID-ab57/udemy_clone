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
import Cookies from "js-cookie"; // Import js-cookie
import Swal from "sweetalert2"; // Import SweetAlert2

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async () => {
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
        confirmButtonColor: "#3d18a3",
      });
    } else {
      // Store token and user details in cookies
      Cookies.set("token", data.session.access_token, { expires: 7 }); // Expires in 7 days
      Cookies.set("userName", data.user.user_metadata.name, { expires: 7 }); // Expires in 7 days

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
            InputProps={{
              style: { borderRadius: 10 },
            }}
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
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
