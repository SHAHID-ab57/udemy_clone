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

const CourseCreationForm = () => {
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
  });

  const [uploading, setUploading] = useState({
    photo: false,
    thumbnail: false,
    video: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setUploading((prev) => ({ ...prev, [name]: true }));

      try {
        const uploadedUrl = await uploadFileToSupabase(file, name);
        setFormData((prev) => ({ ...prev, [name]: uploadedUrl }));
      } catch (err) {
        console.error(`Failed to upload ${name}:`, err.message);
      } finally {
        setUploading((prev) => ({ ...prev, [name]: false }));
      }
    }
  };

  const uploadFileToSupabase = async (file, folder) => {
    try {
      const fileName = `${folder}/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from("project_file")
        .upload(fileName, file);

      if (error) {
        throw new Error(error.message);
      }

      const { publicUrl } = supabase.storage
        .from("project_file")
        .getPublicUrl(fileName);
      return publicUrl;
    } catch (err) {
      console.error("File upload failed:", err.message);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from("courseUpload").insert([
        {
          InstructorName: formData.instructorName,
          InstructorBio: formData.bio,
          InstructorQualification: formData.qualifications,
          InstructorImage: formData.photo,
          courseTitle: formData.courseTitle,
          courseShortDis: formData.courseShortIntro,
          courseDescription: formData.courseDescription,
          courseThumbnail: formData.courseThumbnail,
          courseVideo: formData.courseVideo,
          courseLanguage: formData.courseLanguage,
          coursePrice: parseFloat(formData.coursePrice),
          courseRating: formData.courseRating,
          courseTag: formData.courseTag,
          courseRequirement: formData.courseRequirements,
        },
      ]);

      if (error) {
        throw new Error(error.message);
      }

      // Reset form after successful submission
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
      });
    } catch (err) {
      console.error("Error submitting form:", err.message);
    }
  };

  const isUploading = uploading.photo || uploading.thumbnail || uploading.video;

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
          {/* Instructor Details Section */}
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
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Qualifications"
                fullWidth
                name="qualifications"
                value={formData.qualifications}
                onChange={handleInputChange}
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
                  disabled={uploading.photo}
                >
                  {uploading.photo ? "Uploading..." : "Upload Instructor Photo"}
                </Button>
              </label>
            </Grid>
          </Grid>

          {/* Course Details Section */}
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Tags (comma-separated)"
                fullWidth
                name="courseTag"
                value={formData.courseTag}
                onChange={handleInputChange}
                placeholder="e.g., Programming, Design, Marketing"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Language"
                fullWidth
                name="courseLanguage"
                value={formData.courseLanguage}
                onChange={handleInputChange}
                required
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
              />
            </Grid>
          </Grid>

          {/* Upload Section */}
          <Grid container spacing={3}>
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
                  disabled={uploading.thumbnail}
                >
                  {uploading.thumbnail ? "Uploading..." : "Upload Thumbnail"}
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
                  disabled={uploading.video}
                >
                  {uploading.video ? "Uploading..." : "Upload Video"}
                </Button>
              </label>
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Button
              variant="contained"
              type="submit"
              disabled={isUploading}
            >
              {isUploading ? "Please Wait..." : "Submit"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CourseCreationForm;
