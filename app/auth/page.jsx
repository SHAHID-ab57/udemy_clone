"use client";

import React, { useState } from "react";
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

// Register Component
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleRegister = async () => {
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      router.push("/signin");
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
            onClick={handleRegister}
          >
            Register
          </Button>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Already have an account? {" "}
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
