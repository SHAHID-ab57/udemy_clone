"use client";
import React from "react";
import { Button, Typography, Box } from "@mui/material";
import { useRouter } from "next/navigation";

const TeacherLanding = () => {
    const router = useRouter()
    return (
        <Box
            sx={{
                backgroundImage: `url(https://s.udemycdn.com/teaching/billboard-desktop-v4.jpg)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                px: { xs: 3, sm: 6, md: 10 }, 
            }}
        >
            <Box
                sx={{
                    backgroundColor: "transparent",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    p: { xs: 2, sm: 4, md: 5 },
                    maxWidth: { xs: "100%", sm: "70%", md: "50%" },
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "bold",
                        mb: 2,
                        fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                    }}
                >
                    Come teach with us
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        mb: 3,
                        fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" },
                    }}
                >
                    Become an instructor and change lives — including your own.
                </Typography>
                <Button
                onClick={()=>router.push("courseUpload")}
                    variant="contained"
                    size="large"
                    sx={{
                        textTransform: "none",
                        backgroundColor: "#3d18a3",
                        color: "#000",
                        ":hover": {
                            backgroundColor: "#2a1282",
                        },
                    }}
                >
                    Get started
                </Button>
            </Box>
        </Box>
    );
};

export default TeacherLanding;

