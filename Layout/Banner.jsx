"use client";
import React from "react";
import Carousel from "react-material-ui-carousel";
import { Button, Typography, Box } from "@mui/material";

const Banner = () => {
    const items = [
        {
            image: "https://img-c.udemycdn.com/notices/web_carousel_slide/image/10ca89f6-811b-400e-983b-32c5cd76725a.jpg",
            header: "Skills that drive you forward",
            description: "Technology and the world of work change fast — with us, you’re faster. Get the skills to achieve goals and stay competitive.",
            buttonText: "View Plan",
        },
        {
            image: "https://img-c.udemycdn.com/notices/web_carousel_slide/image/e6cc1a30-2dec-4dc5-b0f2-c5b656909d5b.jpg",
            header: "Learning that gets you",
            description: "Skills for your present (and your future). Get started with us.",
            buttonText: "",
        },
    ];

    return (
        <Box sx={{ mb: 5 }}>
            <Carousel
                indicators={true}
                navButtonsAlwaysVisible={true}
                animation="fade"
                autoPlay={true}
                interval={5000}
                sx={{
                    height: "400px",
                    overflow: "hidden",
                    mx:"70px"
                }}
            >
                {items.map((item, index) => (
                    <Box
                        key={index}
                        sx={{
                            backgroundImage: `url(${item.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            height: "400px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "start",
                            px: { xs: 3, sm: 6, md: 10 }, 
                        }}
                    >
                        <Box
                            sx={{
                                backgroundColor: "#fff",
                                borderRadius: "8px",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                p: { xs: 2, sm: 4, md: 5 },
                                maxWidth: { xs: "80%", sm: "70%", md: "50%" },
                                height:"auto"
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
                                {item.header}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    mb: 3,
                                    fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" },
                                }}
                            >
                                {item.description}
                            </Typography>
                            {item.buttonText && (
                                <Button
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        textTransform: "none",
                                        backgroundColor: "#5022c3",
                                        ":hover": {
                                            backgroundColor: "#3d18a3",
                                        },
                                    }}
                                >
                                    {item.buttonText}
                                </Button>
                            )}
                        </Box>
                    </Box>
                ))}
            </Carousel>
        </Box>
    );
};

export default Banner;
