"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Button,
} from "@mui/material";
import supabase from "@/app/config/configsupa";
import { useRouter } from "next/navigation";

const CourseView = ({ params }) => {
    const {id} = React.use(params)
  const [course, setCourse] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCourse = async () => {
      const { data, error } = await supabase
        .from("courseUpload")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching course:", error.message);
        return;
      }
      setCourse(data);
    };

    fetchCourse();
  }, [id]);

  if (!course) return <Typography>Loading course details...</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Card
        sx={{
          p: 3,
          boxShadow: 4,
          borderRadius: "12px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            sx={{ mb: 3, color: "#5022c3", fontWeight: "bold", textAlign: "center" }}
          >
            {course.courseTitle}
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Avatar
                src={course.InstructorImage}
                alt={course.InstructorName}
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  mx: "auto",
                  boxShadow: 3,
                }}
              />
              <Typography variant="h6" align="center">
                {course.InstructorName}
              </Typography>
              <Typography variant="body2" align="center" color="text.secondary">
                {course.InstructorQualification}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Description:</strong> {course.courseDescription}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Language:</strong> {course.courseLanguage}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Price:</strong> ${course.coursePrice}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Requirements:</strong> {course.courseRequirement}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Category:</strong> {course.courseCategory}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            variant="contained"
            onClick={() => router.push("/admin")}
            sx={{
              backgroundColor: "#5022c3",
              "&:hover": { backgroundColor: "#3d18a3" },
              borderRadius: "8px",
            }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default CourseView;
