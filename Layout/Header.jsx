"use client";

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Badge,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";  // Import js-cookie to handle cookies
import supabase from "@/app/config/configsupa"; // Your Supabase configuration

const Header = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [wishlistAnchor, setWishlistAnchor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [isUser, setIsUser] = useState(false); // Add a state for checking user login status
  const [userName, setUserName] = useState(""); // Store user name

  // Checking user authentication status from cookies
  useEffect(() => {
    const token = Cookies.get("token");  // Get the token from cookies
    const storedUserName = Cookies.get("userName");  // Get the username from cookies

    if (token && storedUserName) {
      setIsUser(true);
      setUserName(storedUserName);
    }
  }, []);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .order("created_at", { ascending: false }) // Order by latest
          .limit(1); // Limit to 1 for the most recent notification

        if (error) {
          console.error("Error fetching notifications:", error.message);
        } else {
          setNotifications(data); // Set the notifications to state
        }
      } catch (error) {
        console.error("Error fetching notifications:", error.message);
      } finally {
        setIsLoadingNotifications(false); // Set loading state to false after fetching
      }
    };

    fetchNotifications();
  }, []);

  // Handlers for opening and closing menus
  const handleMenuClick = (event, setAnchor) => setAnchor(event.currentTarget);
  const handleMenuClose = (setAnchor) => () => setAnchor(null);

  // Authentication logic
  const handleUserLogin = () => {
    router.push("/signin");
    setAnchorEl(null);
  };

  const handleAdminLogin = () => {
    router.push("/adminlogin");
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Cookies.remove("token");  // Remove the token cookie
    Cookies.remove("userName");  // Remove the username cookie
    setIsUser(false);
    setUserName("");
    router.push("/");
    setAnchorEl(null);
  };

  // Search handler
  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* Top Bar */}
      <Box sx={{ backgroundColor: "#5022c3" }}>
        <Typography
          variant="body1"
          align="center"
          sx={{
            color: "#fff",
            fontWeight: 700,
            fontSize: 13,
            p: 1.5,
          }}
        >
          Ready to get with the times? |{" "}
          <span style={{ fontWeight: 500 }}>
            Get the skills with Udemy Business.
          </span>
        </Typography>
      </Box>

      {/* App Bar */}
      <AppBar
        sx={{
          position: "static",
          backgroundColor: "#fff",
          boxShadow: 1.5,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <Box onClick={() => router.push("/")} sx={{ cursor: "pointer" }}>
            <img
              src="https://frontends.udemycdn.com/frontends-homepage/staticx/udemy/images/v7/logo-udemy.svg"
              alt="Udemy Logo"
              style={{ height: 30, width: 120 }}
            />
          </Box>

          {/* Explore Button */}
          <Button
            sx={{
              color: "#000",
              fontSize: "10px",
              "&:hover": {
                backgroundColor: "#daaff9",
                color: "#fff",
              },
            }}
            onClick={() => router.push("/categories")}
          >
            Explore
          </Button>

          {/* Search Bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "350px",
              height: "30px",
              borderRadius: "30px",
              backgroundColor: "#f5f5f5",
              p: 1,
              mx: 4,
              border: "1px solid #000",
              "&:hover": {
                backgroundColor: "#ddd",
              },
              "&:focus-within": {
                outline: "1px solid #7F00FF",
              },
            }}
          >
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              style={{
                flex: 1,
                height: "100%",
                border: "none",
                outline: "none",
                fontSize: "14px",
                backgroundColor: "transparent",
              }}
            />
          </Box>

          {/* Teach on Udemy Button */}
          <Button
            onClick={() => router.push("/teacher")}
            sx={{
              color: "#000",
              fontSize: "10px",
              "&:hover": {
                backgroundColor: "#daaff9",
                color: "#fff",
              },
            }}
          >
            Teach on Udemy
          </Button>

          {/* Wishlist Button */}
          <IconButton
            onClick={(e) => handleMenuClick(e, setWishlistAnchor)}
            sx={{
              color: "#000",
              "&:hover": {
                backgroundColor: "#daaff9",
                color: "#fff",
              },
            }}
          >
            <Badge badgeContent={0} color="error">
              <FavoriteBorderIcon />
            </Badge>
          </IconButton>

          {/* Shopping Cart Button */}
          <IconButton
            onClick={() => router.push("/cart")}
            sx={{
              color: "#000",
              "&:hover": {
                backgroundColor: "#daaff9",
                color: "#fff",
              },
            }}
          >
            <ShoppingCartIcon />
          </IconButton>

          {/* Notification Button */}
          <IconButton
            onClick={(e) => handleMenuClick(e, setNotificationAnchor)}
            sx={{
              color: "#000",
              "&:hover": {
                backgroundColor: "#daaff9",
                color: "#fff",
              },
            }}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Account Section */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isUser && userName && (
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#000",
                  fontWeight: "bold",
                  mr: 1,
                  textTransform: "capitalize",
                }}
              >
                {userName}
              </Typography>
            )}
            <IconButton
              onClick={(e) => handleMenuClick(e, setAnchorEl)}
              sx={{
                color: "#000",
                "&:hover": {
                  backgroundColor: "#daaff9",
                  color: "#fff",
                },
              }}
            >
              <AccountCircleIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Account Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose(setAnchorEl)}
      >
        {isUser
          ? [
              <MenuItem key="profile" onClick={() => router.push("/profilepage")}>
                Profile
              </MenuItem>,
              <MenuItem key="logout" onClick={handleLogout}>
                Logout
              </MenuItem>,
            ]
          : [
              <MenuItem key="user-login" onClick={handleUserLogin}>
                User Login
              </MenuItem>,
              <MenuItem key="admin-login" onClick={handleAdminLogin}>
                Admin Login
              </MenuItem>,
            ]}
      </Menu>

      {/* Wishlist Menu */}
      <Menu
        anchorEl={wishlistAnchor}
        open={Boolean(wishlistAnchor)}
        onClose={handleMenuClose(setWishlistAnchor)}
      >
        <MenuItem>Wishlist Item 1</MenuItem>
        <MenuItem>Wishlist Item 2</MenuItem>
      </Menu>

      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleMenuClose(setNotificationAnchor)}
      >
        {isLoadingNotifications ? (
          <MenuItem>Loading notifications...</MenuItem>
        ) : notifications.length > 0 ? (
          <MenuItem>
            <Typography variant="body2">
              <strong>{notifications[notifications.length - 1].name}</strong>
            </Typography>
            <Typography variant="body2">{notifications[notifications.length - 1].title}</Typography>
          </MenuItem>
        ) : (
          <MenuItem>No new notifications</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default Header;
