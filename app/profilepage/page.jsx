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
} from "@mui/material";
import { useRouter } from "next/navigation";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import supabase from "../config/configsupa";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

function Profile() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [originalName, setOriginalName] = useState(""); // Store original name
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData, error } = await supabase.auth.getUser();
      if (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch user data.",
        });
      } else {
        setUser(userData.user);
        setEmail(userData.user?.email || "");
        setName(userData.user?.user_metadata?.name || "");
        setOriginalName(userData.user?.user_metadata?.name || ""); // Save original name
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleUpdate = async () => {
    if (name.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "Invalid Name",
        text: "Name cannot be empty.",
      });
      return;
    }

    if (name === originalName) {
      Swal.fire({
        icon: "info",
        title: "No Changes Detected",
        text: "You entered same name.",
      });
      return;
    }

    Swal.fire({
      title: "Updating Profile...",
      text: "Please wait while we update your information.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const { error } = await supabase.auth.updateUser({
      data: { name },
    });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Could not update profile. Please try again later.",
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile information has been successfully updated!",
        timer: 2000,
        showConfirmButton: false,
      });

      setOriginalName(name);
      Cookies.set("userName", name, { expires: 7 });
    }
  };

  const handleLogout = async () => {
    Swal.fire({
      title: "Logging Out...",
      text: "Please wait while we sign you out.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    await supabase.auth.signOut();
    Cookies.remove("userName");
    Cookies.remove("token");

    setTimeout(() => {
      Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been signed out.",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        router.push("/signin");
      });
    }, 1000);
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
            src="/static/images/avatar/1.jpg"
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

        <Box sx={{ p: 4 }}>
          <Grid container spacing={3}>
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
              <TextField label="Email" variant="outlined" fullWidth value={email} disabled />
            </Grid>
          </Grid>

          <Grid container spacing={3} justifyContent="space-between" sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleUpdate}
                fullWidth
                sx={{
                  backgroundColor: "#3d18a3",
                  "&:hover": { backgroundColor: "#2c137d" },
                }}
              >
                Update Profile
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                fullWidth
                color="secondary"
              >
                Logout
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default Profile;
