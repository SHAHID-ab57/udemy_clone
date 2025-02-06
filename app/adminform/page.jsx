"use client";
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import supabase from "@/app/config/configsupa";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const CourseCreationForm = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    instructorName: "",
    bio: "",
    qualifications: "",
    photo: null,
    courseTitle: "",
    courseShortIntro: "",
    courseDescription: "",
    courseThumbnail: null,
    courseVideo: null,
    courseLanguage: "",
    coursePrice: "",
    courseRating: "",
    courseTag: "",
    courseRequirements: "",
    courseCategory:""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const uploadFileToSupabase = async (file, folder) => {
    const fileName = `${folder}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("project_file")
      .upload(fileName, file);
    
    if (error) {
      Swal.fire("Error!", error.message, "error");
      throw new Error(error.message);
    }

    const { data:url } = supabase.storage
      .from("project_file")
      .getPublicUrl(fileName);
    
    console.log(`Uploaded ${fileName} to Supabase. Public URL: ${url.publicUrl}`);
    return url.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Uploading...",
      text: "Please wait while we process your request.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const photoUrl = formData.photo
        ? await uploadFileToSupabase(formData.photo, "photos")
        : null;
      const thumbnailUrl = formData.courseThumbnail
        ? await uploadFileToSupabase(formData.courseThumbnail, "thumbnails")
        : null;
      const videoUrl = formData.courseVideo
        ? await uploadFileToSupabase(formData.courseVideo, "videos")
        : null;

      console.log("photoUrl", photoUrl);
      console.log("thumbnailUrl", thumbnailUrl);
      console.log("videoUrl", videoUrl);

      const { data, error } = await supabase.from("courseUpload").insert([
        {
          InstructorName: formData.instructorName,
          InstructorBio: formData.bio,
          InstructorQualification: formData.qualifications,
          InstructorImage: photoUrl,
          courseTitle: formData.courseTitle,
          courseShortDis: formData.courseShortIntro,
          courseDescription: formData.courseDescription,
          courseThumbnail: thumbnailUrl,
          courseVideo: videoUrl,
          courseLanguage: formData.courseLanguage,
          coursePrice: formData.coursePrice,
          courseRating: formData.courseRating,
          courseTag: formData.courseTag || "", 
          courseRequirement: formData.courseRequirements,
          courseCategory: formData.courseCategory || ""
        },
      ]);
      
    
      if (error) {
        console.error("Database insert error:", error.message);
        throw new Error(error.message);
      }
      Swal.fire("Success!", "Course created successfully!", "success");
      router.push('/admin')
      
      setFormData({
        instructorName: "",
        bio: "",
        qualifications: "",
        photo: null,
        courseTitle: "",
        courseShortIntro: "",
        courseDescription: "",
        courseThumbnail: null,
        courseVideo: null,
        courseLanguage: "",
        coursePrice: "",
        courseRating: "",
        courseTag: "",
        courseRequirements: "",
        courseCategory:""
      });
    } catch (err) {
      console.error("Submission error:", err.message);
    }
  };

  console.log("form data",formData);
  

  return (
    <Box sx={{ p: 3, backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, textAlign: "center", color: "#5022c3", fontWeight: 700 }}
      >
        Course Creation and Management
      </Typography>
      <Paper sx={{ p: 3, borderRadius: "8px", boxShadow: 3 }}>
        <form onSubmit={handleSubmit}>
          <Typography
            variant="h6"
            sx={{ mb: 2, color: "#5022c3", fontWeight: 600 }}
          >
            Instructor Profile
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Instructor Name*"
                fullWidth
                name="instructorName"
                value={formData.instructorName}
                onChange={handleInputChange}
                required
                sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Qualifications"
                fullWidth
                name="qualifications"
                value={formData.qualifications}
                onChange={handleInputChange}
                sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Bio"
                fullWidth
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                multiline
                rows={4}
                sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="photo-upload"
                type="file"
                name="photo"
                onChange={handleFileChange}
              />
              <label htmlFor="photo-upload">
                <Button
                  variant="contained"
                  component="span"
                  sx={{ backgroundColor: "#5022c3", borderRadius: "8px" }}
                >
                  Upload Instructor Photo
                </Button>
              </label>
            </Grid>
          </Grid>

          <Typography
            variant="h6"
            sx={{ mt: 4, mb: 2, color: "#5022c3", fontWeight: 600 }}
          >
            Course Details
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Course Title"
                fullWidth
                name="courseTitle"
                value={formData.courseTitle}
                onChange={handleInputChange}
                required
                sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Short Intro"
                fullWidth
                name="courseShortIntro"
                value={formData.courseShortIntro}
                onChange={handleInputChange}
                required
                sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Course Description"
                fullWidth
                name="courseDescription"
                value={formData.courseDescription}
                onChange={handleInputChange}
                required
                multiline
                rows={4}
                sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="thumbnail-upload"
                type="file"
                name="courseThumbnail"
                onChange={handleFileChange}
              />
              <label htmlFor="thumbnail-upload">
                <Button
                  variant="contained"
                  component="span"
                  fullWidth
                  sx={{ backgroundColor: "#5022c3", borderRadius: "8px" }}
                >
                  Upload Thumbnail
                </Button>
              </label>
            </Grid>
            <Grid item xs={12} md={6}>
              <input
                accept="video/*"
                style={{ display: "none" }}
                id="video-upload"
                type="file"
                name="courseVideo"
                onChange={handleFileChange}
              />
              <label htmlFor="video-upload">
                <Button
                  variant="contained"
                  component="span"
                  fullWidth
                  sx={{ backgroundColor: "#5022c3", borderRadius: "8px" }}
                >
                  Upload Video
                </Button>
              </label>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Language"
                fullWidth
                name="courseLanguage"
                value={formData.courseLanguage}
                onChange={handleInputChange}
                required
                sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Price"
                fullWidth
                name="coursePrice"
                value={formData.coursePrice}
                onChange={handleInputChange}
                required
                sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Tag"
                fullWidth
                name="courseTag"
                value={formData.courseTag}
                onChange={handleInputChange}
                required
                sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Category"
                fullWidth
                name="courseCategory"
                value={formData.courseCategory}
                onChange={handleInputChange}
                required
                sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Rating"
                fullWidth
                name="courseRating"
                value={formData.courseRating}
                onChange={handleInputChange}
                required
                sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Basic Requirements"
                fullWidth
                name="courseRequirements"
                value={formData.courseRequirements}
                onChange={handleInputChange}
                required
                multiline
                rows={4}
                sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Button
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: "#5022c3",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#3d18a3",
                },
                borderRadius: "8px",
                padding: "10px 30px",
              }}
            >
              Submit
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CourseCreationForm;
