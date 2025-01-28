"use client"
import { Box, Container, Grid, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: "#111", color: "white", py: 4 , mt:4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold">
              About
            </Typography>
            <Link href="#" color="inherit" display="block" underline="hover">
              About us
            </Link>
            <Link href="#" color="inherit" display="block" underline="hover">
              Careers
            </Link>
            <Link href="#" color="inherit" display="block" underline="hover">
              Contact us
            </Link>
            <Link href="#" color="inherit" display="block" underline="hover">
              Blog
            </Link>
            <Link href="#" color="inherit" display="block" underline="hover">
              Investors
            </Link>
          </Grid>

          {/* Discovery Udemy Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold">
              Discovery Udemy
            </Typography>
            <Link href="#" color="inherit" display="block" underline="hover">
              Get the app
            </Link>
            <Link href="#" color="inherit" display="block" underline="hover">
              Teach on Udemy
            </Link>
            <Link href="#" color="inherit" display="block" underline="hover">
              Plans and Pricing
            </Link>
            <Link href="#" color="inherit" display="block" underline="hover">
              Affiliate
            </Link>
            <Link href="#" color="inherit" display="block" underline="hover">
              Help and Support
            </Link>
          </Grid>

          {/* Udemy for Business Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold">
              Udemy for Business
            </Typography>
            <Link href="#" color="inherit" display="block" underline="hover">
              Udemy Business
            </Link>
          </Grid>

          {/* Legal & Accessibility Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold">
              Legal & Accessibility
            </Typography>
            <Link href="#" color="inherit" display="block" underline="hover">
              Accessibility statement
            </Link>
            <Link href="#" color="inherit" display="block" underline="hover">
              Privacy policy
            </Link>
            <Link href="#" color="inherit" display="block" underline="hover">
              Sitemap
            </Link>
            <Link href="#" color="inherit" display="block" underline="hover">
              Terms
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;

