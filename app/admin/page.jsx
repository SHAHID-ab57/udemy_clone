"use client"; // Ensure it runs only on the client

import * as React from "react";
import PropTypes from "prop-types";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LogoutIcon from "@mui/icons-material/Logout";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";

const Dashboard = dynamic(() => import("../component/AdminPanel"), { ssr: false });
const Orders = dynamic(() => import("../component/AdminOrder"), { ssr: false });
const Upload = dynamic(() => import("../component/AdminUpload"), { ssr: false });

const NAVIGATION = [
  { segment: "dashboard", title: "Dashboard", icon: <DashboardIcon /> },
  { segment: "orders", title: "Orders", icon: <ShoppingCartIcon /> },
  { segment: "upload", title: "Upload", icon: <CloudUploadIcon /> },
];

const demoTheme = createTheme({
  cssVariables: { colorSchemeSelector: "data-toolpad-color-scheme" },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 },
  },
});

function DemoPageContent({ pathname }) {
  const [mounted, setMounted] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Typography>Loading...</Typography>;
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Example: remove stored auth token
    router.push("/");
  };

  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        paddingLeft: { xs: 2, sm: 4, md: 6 },
        paddingRight: { xs: 2, sm: 4, md: 6 },
      }}
    >
      {/* Logout Button at the top */}
      <Button
        variant="contained"
        color="error"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        sx={{ alignSelf: "flex-end", mb: 2 }}
      >
        Logout
      </Button>

      {pathname === "/dashboard" && <Dashboard />}
      {pathname === "/orders" && <Orders />}
      {pathname === "/upload" && <Upload />}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutBranding() {
  const [mounted, setMounted] = React.useState(false);
  const router = useDemoRouter("/dashboard");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Typography>Loading application...</Typography>;
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        overflowX: "hidden",
        height: "auto",
      }}
    >
      <AppProvider
        navigation={NAVIGATION}
        branding={{
          logo: (
            <img
              src="https://frontends.udemycdn.com/frontends-homepage/staticx/udemy/images/v7/logo-udemy.svg"
              alt="MUI logo"
            />
          ),
          title: "Udemy",
          homeUrl: "/dashboard",
        }}
        router={router}
      >
        <ThemeProvider theme={demoTheme}>
          <CssBaseline />
          <DashboardLayout>
            <DemoPageContent pathname={router.pathname} />
          </DashboardLayout>
        </ThemeProvider>
      </AppProvider>
    </Box>
  );
}

export default DashboardLayoutBranding;
