"use client";
import { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, Box, Container } from "@mui/material";
import html2canvas from "html2canvas";

const Page = () => {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (name && course) {
      setGenerated(true);
    }
  };

  const handleDownload = () => {
    const certificateElement = document.getElementById("certificate");
    html2canvas(certificateElement).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "certificate.png";
      link.click();
    });
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        // backgroundColor: "#f5f5f5",
        padding: 2,
      }}
    >
      {!generated ? (
        <Card sx={{ p: 4, width: "100%", boxShadow: 3, borderRadius: 2 }}>
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h5" gutterBottom align="center">
              Certificate Generator
            </Typography>
            <TextField
              label="Enter your name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ bgcolor: "white" }}
            />
            <TextField
              label="Enter course name"
              variant="outlined"
              fullWidth
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              sx={{ bgcolor: "white" }}
            />
            <Button variant="contained" color="primary" onClick={handleGenerate} fullWidth>
              Generate Certificate
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box
          id="certificate"
          sx={{
            textAlign: "center",
            position: "relative",
            width: "800px", // Adjust based on your certificate size
            height: "600px", // Adjust based on your certificate size
            backgroundImage: `url(/certificate.png)`, // Ensure the image is in the public folder
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: "5px solid #3f51b5",
            borderRadius: 2,
            boxShadow: 3,
            mt: 4,
            p: 2,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              position: "absolute",
              top: "35%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
            }}
          >
            Certificate of Completion
          </Typography>
          <Typography
            variant="h6"
            sx={{
              position: "absolute",
              top: "55%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)",
            }}
          >
            {name} has successfully completed {course}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 4, position: "absolute", bottom: "10%", left: "20%" }}
            onClick={handleDownload}
          >
            Download Certificate
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 4, position: "absolute", bottom: "10%", right: "20%" }}
            onClick={() => setGenerated(false)}
          >
            Generate Another
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Page;