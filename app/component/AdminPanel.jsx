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
  LinearProgress,
  Skeleton,
  useMediaQuery,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  PendingActions as PendingIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import supabase from "@/app/config/configsupa";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminPanel = () => {
  const [pendingCourses, setPendingCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { data: pendingData },
          { data: allData },
          { data: usersData }
        ] = await Promise.all([
          supabase.from("courseUpload").select("*").eq("status", "pending"),
          supabase.from("courseUpload").select("*"),
          supabase.from("users").select("*")
        ]);

        setPendingCourses(pendingData);
        setAllCourses(allData);
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (allCourses.length > 0) {
      const approvedCount = allCourses.filter(c => c.status === "approved").length;
      const pendingCount = allCourses.filter(c => c.status === "pending").length;
      const rejectedCount = allCourses.filter(c => c.status === "rejected").length;

      setChartData({
        labels: ["Approved", "Pending", "Rejected"],
        datasets: [{
          label: "Course Status",
          data: [approvedCount, pendingCount, rejectedCount],
          backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
          borderWidth: 0,
        }],
      });
    }
  }, [allCourses]);

  const handleCourseStatus = async (id, status) => {
    try {
      const { data, error } = await supabase
        .from("courseUpload")
        .update({ status })
        .eq("id", id)
        .select("*");

      if (!error) {
        setAllCourses(prev => prev.map(c => c.id === id ? { ...c, status } : c));
        setPendingCourses(prev => prev.filter(c => c.id !== id));
        
        if (data[0]) {
          await supabase.from("notifications").insert([{
            name: "Course Status Update",
            title: data[0].courseTitle,
            message: `Your course "${data[0].courseTitle}" has been ${status}.`,
            user: data[0].InstructorName,
          }]);
        }
      }
    } catch (error) {
      console.error("Error updating course:", error.message);
    }
  };

  const handleDeleteCourse = async (id) => {
    const { error } = await supabase.from("courseUpload").delete().eq("id", id);
    if (!error) setAllCourses(prev => prev.filter(c => c.id !== id));
  };
  

  return (
    <Box sx={{ p: isMobile ? 2 : 4, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
    <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#5022c3' }}>
      Admin Dashboard
    </Typography>
  
    {loading && <LinearProgress sx={{ mb: 3 }} />}
  
    {/* Stats Cards */}
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {[
        { title: 'Total Courses', count: allCourses.length, icon: <SchoolIcon />, color: '#5022c3' },
        { title: 'Pending Courses', count: pendingCourses?.length, icon: <PendingIcon />, color: '#FFB020' },
        { title: 'Total Users', count: users?.length, icon: <PeopleIcon />, color: '#14B8A6' },
        { title: 'Rejected Courses', count: allCourses.filter(c => c.status === 'rejected').length, icon: <BlockIcon />, color: '#D14343' }
      ].map((item, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ borderRadius: 3, bgcolor: item.color, color: 'white', boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {loading ? <Skeleton width={60} /> : item.count}
                  </Typography>
                  <Typography variant="body2">{item.title}</Typography>
                </Box>
                <Box sx={{ fontSize: 40, opacity: 0.8 }}>{item.icon}</Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  
    {/* Chart Section */}
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, borderRadius: 3, height: '100%', boxShadow: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Course Status Distribution
          </Typography>
          {chartData ? (
            <Box sx={{ height: 300 }}>
              <Doughnut data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
            </Box>
          ) : (
            <Skeleton variant="rectangular" height={300} />
          )}
        </Paper>
      </Grid>
  
      {/* Pending Courses Table */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, borderRadius: 3, height: '100%', boxShadow: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Pending Approvals
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#e3e3e3' }}>
                  <TableCell>Course Title</TableCell>
                  <TableCell>Instructor</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array(3).fill().map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                    </TableRow>
                  ))
                ) : pendingCourses.map((course) => (
                  <TableRow key={course.id} hover>
                    <TableCell>{course.courseTitle}</TableCell>
                    <TableCell>{course.InstructorName}</TableCell>
                    <TableCell align="right">
                      <Button startIcon={<CheckCircleIcon />} variant="contained" sx={{ bgcolor: '#14B8A6', color: 'white', m:1 }} size="small" onClick={() => handleCourseStatus(course.id, "approved")}>
                        {!isMobile && 'Approve'}
                      </Button>
                      <Button startIcon={<CancelIcon />} variant="contained" sx={{ bgcolor: '#D14343', color: 'white' ,m:1}} size="small" onClick={() => handleCourseStatus(course.id, "rejected")}>
                        {!isMobile && 'Reject'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  
    {/* All Courses Grid */}
    <Paper sx={{ p: 3, borderRadius: 3, mb: 3, boxShadow: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        All Courses
      </Typography>
      <Grid container spacing={3}>
        {loading ? (
          Array(5).fill().map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <Skeleton variant="rectangular" width="100%" height={180} />
                <Box sx={{ p: 2 }}>
                  <Skeleton width="60%" />
                  <Skeleton width="40%" />
                </Box>
              </Card>
            </Grid>
          ))
        ) : allCourses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <Box sx={{ height: 180, backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url(${course.courseThumbnail || 'default.jpg'})` }} />
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{course.courseTitle}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{course.InstructorName}</Typography>
              </Box>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button variant="outlined" color="error" size="small" startIcon={<DeleteIcon />} onClick={() => handleDeleteCourse(course.id)} sx={{ width: '100%' }}>
                  {!isMobile && 'Delete'}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  </Box>
  
  );
};

export default AdminPanel;
