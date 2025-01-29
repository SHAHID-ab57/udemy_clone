"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Rating,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import supabase from "@/app/config/configsupa";

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    rating: searchParams.get("rating") || "",
    price: searchParams.get("price") || "",
    language: searchParams.get("language") || "",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      const { data: courseUpload, error } = await supabase
        .from("courseUpload")
        .select("*");

      if (error) {
        console.error("Error fetching courses:", error);
      } else {
        // Apply filters dynamically
        const filteredCourses = courseUpload.filter((course) => {
          const matchesQuery = course.courseTitle
            .toLowerCase()
            .includes(query.toLowerCase());

          const matchesCategory = !filters.category || course.courseCategory === filters.category;
          const matchesRating = !filters.rating || course.courseRating >= parseFloat(filters.rating);
          const matchesPrice = !filters.price || course.coursePrice <= parseFloat(filters.price);
          const matchesLanguage = !filters.language || course.courseLanguage === filters.language;

          return matchesQuery && matchesCategory && matchesRating && matchesPrice && matchesLanguage;
        });

        setCourses(filteredCourses);
      }
    };

    fetchCourses();
  }, [query, filters]);

  const handleFilterChange = (field, value) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);

    // Update the URL with the new filter values
    const params = new URLSearchParams(updatedFilters);
    router.push(`/search?${params.toString()}`);
  };

  const handleDeleteCourse = async (courseId) => {
    const { error } = await supabase
      .from("courseUpload")
      .delete()
      .eq("id", courseId);

    if (error) {
      console.error("Error deleting course:", error);
    } else {
      setCourses(courses.filter((course) => course.id !== courseId));
    }
  };

  return (
    <Box sx={{ display: "flex", p: 2 }}>
      {/* Left Sidebar */}
      <Box sx={{ width: "25%", p: 2 }}>
        <Typography variant="h6" gutterBottom>Filters</Typography>
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Programming">Programming</MenuItem>
            <MenuItem value="Design">Design</MenuItem>
            <MenuItem value="Data Science">Data Science</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Rating</InputLabel>
          <Select
            value={filters.rating}
            onChange={(e) => handleFilterChange("rating", e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="4">4 & above</MenuItem>
            <MenuItem value="3">3 & above</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Price</InputLabel>
          <Select
            value={filters.price}
            onChange={(e) => handleFilterChange("price", e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="50">Under $50</MenuItem>
            <MenuItem value="100">Under $100</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Language</InputLabel>
          <Select
            value={filters.language}
            onChange={(e) => handleFilterChange("language", e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Spanish">Spanish</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Right Content */}
      <Box sx={{ flex: 1, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Search Results for "{query}"
        </Typography>

        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Button
                onClick={() => router.push(`/details/${course.id}`)}
                sx={{
                  width: "100%",
                  padding: 0,
                  borderRadius: 2,
                  boxShadow: "none",
                  textTransform: "none",
                }}
              >
                <Card
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    overflow: "hidden",
                    textAlign: "left",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Box
                    sx={{
                      height: 140,
                      backgroundImage: `url(${course.courseThumbnail})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6">{course.courseTitle}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.InstructorName}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Rating
                        name="read-only"
                        value={course.courseRating || 0}
                        readOnly
                      />
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {course.courseLanguage} | ${course.coursePrice}
                    </Typography>
                  </CardContent>
                </Card>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default SearchPage;
