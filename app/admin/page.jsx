"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import supabase from "@/app/config/configsupa";

// Import necessary Chart.js components
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the components with Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const AdminPanel = () => {
  const [pendingCourses, setPendingCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch pending courses
        const { data: pendingData, error: pendingError } = await supabase
          .from("courseUpload")
          .select("*")
          .eq("status", "pending");

        if (pendingError) {
          console.error("Error fetching pending courses:", pendingError.message);
        } else {
          setPendingCourses(pendingData);
        }

        // Fetch all courses
        const { data: allData, error: allError } = await supabase.from("courseUpload").select("*");

        if (allError) {
          console.error("Error fetching all courses:", allError.message);
        } else {
          setAllCourses(allData);

          // Prepare chart data
          const approvedCount = allData.filter((course) => course.status === "approved").length;
          const pendingCount = allData.filter((course) => course.status === "pending").length;
          const rejectedCount = allData.filter((course) => course.status === "rejected").length;

          setChartData({
            labels: ["Approved", "Pending", "Rejected"],
            datasets: [
              {
                label: "Course Status",
                data: [approvedCount, pendingCount, rejectedCount],
                backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
              },
            ],
          });
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCourseStatus = async (id, status) => {
    try {
      // Update course status
      const { data, error: updateError } = await supabase
        .from("courseUpload")
        .update({ status })
        .eq("id", id)
        .select("*"); // Ensure the updated course is returned

      if (updateError) {
        console.error("Error updating course status:", updateError.message);
        return;
      }

      const course = data[0]; // The updated course data
      if (status === "approved") {
        // Ensure that course has valid data before proceeding with notification
        if (course && course.courseTitle && course.InstructorName) {
          const { error: notificationError } = await supabase.from("notifications").insert([
            {
              name: "New Course Added ",
              title: course.courseTitle,
              message: `Your course "${course.courseTitle}" has been approved.`,
              user: course.InstructorName,
            },
          ]);

          if (notificationError) {
            console.error("Error sending notification:", notificationError.message);
          }
        } else {
          console.error("Course data is invalid. Notification not sent.");
        }
      }

      // Update local state
      setPendingCourses((prev) => prev.filter((course) => course.id !== id));
    } catch (error) {
      console.error("Error handling course status:", error.message);
    }
  };

  const handleDeleteCourse = async (id) => {
    const { error } = await supabase.from("courseUpload").delete().eq("id", id);
    if (error) {
      console.error("Error deleting course:", error.message);
    } else {
      setAllCourses((prev) => prev.filter((course) => course.id !== id));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center", fontWeight: 700 }}>
        Admin Panel
      </Typography>

      {/* Overview Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: "8px", boxShadow: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Overview
            </Typography>
            <Typography>Total Courses: {allCourses.length}</Typography>
            <Typography>Total Users: {users.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: "8px", boxShadow: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Course Status Distribution
            </Typography>
            {chartData && (
              <Doughnut
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                  },
                }}
              />
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Pending Courses */}
      <Paper sx={{ p: 3, borderRadius: "8px", boxShadow: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Pending Course Approvals
        </Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : pendingCourses.length === 0 ? (
          <Typography>No pending courses.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Course Title</TableCell>
                  <TableCell>Instructor</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.courseTitle}</TableCell>
                    <TableCell>{course.InstructorName}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleCourseStatus(course.id, "approved")}
                        sx={{ mr: 2 }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleCourseStatus(course.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* All Courses */}
      <Paper sx={{ p: 3, borderRadius: "8px", boxShadow: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          All Courses
        </Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : allCourses.length === 0 ? (
          <Typography>No courses available.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Course Title</TableCell>
                  <TableCell>Instructor</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.courseTitle}</TableCell>
                    <TableCell>{course.InstructorName}</TableCell>
                    <TableCell>{course.status}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default AdminPanel;
