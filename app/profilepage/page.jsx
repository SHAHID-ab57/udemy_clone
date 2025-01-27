"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Paper,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import supabase from "../config/configsupa";

function Profile() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch user data on load
  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData, error } = await supabase.auth.getUser();
      if (error) {
        setError("Error fetching user data");
      } else {
        setUser(userData.user);
        setEmail(userData.user?.email || "");
        setName(userData.user?.user_metadata?.name || "");
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  // Handle profile update
  const handleUpdate = async () => {
    setError(null);
    const { error } = await supabase.auth.updateUser({
      data: { name },
    });
    if (error) {
      setError("Failed to update profile.");
    } else {
      setSuccess(true);
      // Update the localStorage as well
      if (typeof window !== "undefined") {
        localStorage.setItem("userName", name);
      }
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (typeof window !== "undefined") {
      localStorage.removeItem("userName");
      localStorage.removeItem("token");
    }
    router.push("/signin");
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Typography variant="h6" align="center">
          Loading...
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            backgroundColor: "#3d18a3",
            color: "#fff",
            p: 4,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Avatar
            alt={name || "User"}
            src="/static/images/avatar/1.jpg" // Replace with a dynamic image URL if available
            sx={{
              width: 100,
              height: 100,
              mb: 2,
              backgroundColor: "#fff",
              color: "#3d18a3",
              fontSize: 40,
            }}
          >
            {name ? name.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            {name || "User"}
          </Typography>
          <Typography variant="subtitle1">{email}</Typography>
        </Box>

        {/* Profile Details Section */}
        <Box
          sx={{
            p: 4,
          }}
        >
          <Grid container spacing={3}>
            {/* Editable Fields */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                disabled
              />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Grid
            container
            spacing={3}
            justifyContent="space-between"
            sx={{ mt: 4 }}
          >
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={handleUpdate}
                fullWidth
                sx={{
                  backgroundColor: "#3d18a3",
                  "&:hover": {
                    backgroundColor: "#2c137d",
                  },
                }}
              >
                Update Profile
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                fullWidth
              >
                Logout
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Profile;
