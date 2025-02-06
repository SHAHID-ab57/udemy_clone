"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useRouter } from "next/navigation";
import supabase from "@/app/config/configsupa";
import Swal from "sweetalert2"; // Import SweetAlert2

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const router = useRouter();

  const fetchCourses = async () => {
    const { data, error } = await supabase.from("courseUpload").select("*");
    if (error) console.error("Error fetching courses:", error.message);
    else {
      setCourses(data || []);
      calculateAnalytics(data || []);
    }
  };

  const deleteCourse = async (id) => {
    // Use SweetAlert2 for the confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5022c3",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from("courseUpload").delete().eq("id", id);
      if (!error) {
        Swal.fire("Deleted!", "The course has been deleted.", "success");
        fetchCourses(); // Refresh the courses list
      } else {
        console.error("Error deleting course:", error.message);
        Swal.fire("Error!", "There was an issue deleting the course.", "error");
      }
    }
  };

  const calculateAnalytics = (courses) => {
    const totalCourses = courses.length;
    const averageRating =
      courses.reduce((sum, course) => sum + parseFloat(course.courseRating || 0), 0) / totalCourses;
    setAnalytics({ totalCourses, averageRating });
  };

  const handleAddCourse = () => {
    router.push("/adminform");
  };

  const handleEditCourse = (course) => {
    router.push(`/adminedit/${course.id}`);
  };

  const handleViewCourse = (course) => {
    router.push(`/adminview/${course.id}`);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h3"
        align="center"
        sx={{ mb: 3, color: "#5022c3", fontWeight: "bold" }}
      >
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Total Courses</Typography>
            <Typography variant="h4">{analytics.totalCourses || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Average Rating</Typography>
            <Typography variant="h4">
              {analytics.averageRating?.toFixed(1) || "N/A"}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddCourse}
          sx={{
            mb: 2,
            backgroundColor: "#5022c3",
            "&:hover": { backgroundColor: "#3d18a3" },
          }}
        >
          Add New Course
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.courseTitle}</TableCell>
                  <TableCell>{course.courseCategory}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleViewCourse(course)}>
                      <VisibilityIcon sx={{ color: "#5022c3" }} />
                    </IconButton>
                    <IconButton onClick={() => handleEditCourse(course)}>
                      <EditIcon sx={{ color: "#4caf50" }} />
                    </IconButton>
                    <IconButton onClick={() => deleteCourse(course.id)}>
                      <DeleteIcon sx={{ color: "#f44336" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Dashboard;
