"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Stack,
  Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";
import supabase from "../config/configsupa";

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
    } else {
      // Ensure we're on the client-side before using localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem("token", data.session.access_token);
        window.localStorage.setItem("userName", data.user.user_metadata.name);
      }

      router.push("/");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 4,
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#3d18a3" }}
        >
          Login
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{ mb: 4, color: "text.secondary" }}
        >
          Welcome back! Please enter your credentials to continue.
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
            }}
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
            }}
          />

          {error && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleLogin}
            sx={{
              backgroundColor: "#3d18a3",
              "&:hover": {
                backgroundColor: "#2c137d",
              },
              mt: 2,
            }}
          >
            Login
          </Button>

          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 2, color: "text.secondary" }}
          >
            Don't have an account?{" "}
            <Button
              onClick={() => router.push("/auth")}
              sx={{
                textTransform: "none",
                color: "#3d18a3",
                fontWeight: "bold",
              }}
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
