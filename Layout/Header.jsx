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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import supabase from "@/app/config/configsupa";

const Header = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [isUser, setIsUser] = useState(false);
  const [userName, setUserName] = useState("");
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const token = Cookies.get("token");
    const storedUserName = Cookies.get("userName");

    if (token && storedUserName) {
      setIsUser(true);
      setUserName(storedUserName);
    }
  }, []);

  const fetchWishlist = async () => {
    const { data, error } = await supabase.from("wishlist").select("*");
    if (error) {
      console.error("Error fetching wishlist:", error);
    } else {
      setWishlist(data);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1);

        if (error) {
          console.error("Error fetching notifications:", error.message);
        } else {
          setNotifications(data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error.message);
      } finally {
        setIsLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMenuClick = (event, setAnchor) => setAnchor(event.currentTarget);
  const handleMenuClose = (setAnchor) => () => setAnchor(null);

  const handleUserLogin = () => {
    router.push("/signin");
    setAnchorEl(null);
  };

  const handleAdminLogin = () => {
    router.push("/adminlogin");
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userName");
    setIsUser(false);
    setUserName("");
    router.push("/");
    setAnchorEl(null);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleNavigation = (path) => {
    const token = Cookies.get("token");
    if (token) {
      router.push(path);
    } else {
      router.push("/signin");
    }
  };

  return (
    <>
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
          <Box onClick={() => router.push("/")} sx={{ cursor: "pointer" }}>
            <img
              src="https://frontends.udemycdn.com/frontends-homepage/staticx/udemy/images/v7/logo-udemy.svg"
              alt="Udemy Logo"
              style={{ height: 30, width: 120 }}
            />
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
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

            <IconButton
              onClick={() => handleNavigation("/wishlistpage")}
              sx={{
                color: "#000",
                "&:hover": {
                  backgroundColor: "#daaff9",
                  color: "#fff",
                },
              }}
            >
              <Badge badgeContent={wishlist.length} color="error">
                <FavoriteBorderIcon />
              </Badge>
            </IconButton>

            <IconButton
              onClick={() => handleNavigation("/cart")}
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
          </Box>

          {/* Mobile View Buttons */}
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}>
            <IconButton
              sx={{ mr: 1 }}
              onClick={() => {
                const query = prompt("Enter your search query:");
                if (query && query.trim()) {
                  router.push(`/search?query=${encodeURIComponent(query.trim())}`);
                }
              }}
            >
              <SearchIcon />
            </IconButton>
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <List>
          {
            userName && (
              <Typography variant="body1" align="center">
            Welcome! {userName}
          </Typography>
            )
          }
          <ListItem disablePadding>
            <ListItemButton onClick={() => router.push("/")}>Home</ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => router.push("/categories")}>Explore</ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => router.push("/teacher")}>Teach on Udemy</ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation("/wishlistpage")}>
              Wishlist
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation("/cart")}>
              Cart
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation("/certificate")}>
              Certificate
            </ListItemButton>
          </ListItem>
          {
            !userName && (
              <ListItem disablePadding>
            <ListItemButton onClick={handleUserLogin}>
              Login
            </ListItemButton>
          </ListItem>
            )
          }

          {
            userName && (
              <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                Logout
              </ListItemButton>
            </ListItem>
            )
          }
        </List>
      </Drawer>

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
              <MenuItem key="certificate" onClick={()=>router.push("/certificate")}>
                Certificate
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
            <Typography variant="body2">
              {notifications[notifications.length - 1].title}
            </Typography>
          </MenuItem>
        ) : (
          <MenuItem>No new notifications</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default Header;
