"use client";

import VideoPlayer from '@/app/component/VideoPlayer';
import supabase from '@/app/config/configsupa';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Grid,
  TextField,
  Typography,
  Avatar,
  Rating,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Cookies from "js-cookie";

const CoursePage = ({ params }) => {
  const { id } = React.use(params);
const router = useRouter()
  const [course, setCourse] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
    const [isUser, setIsUser] = useState(false);
    const [userName, setUserName] = useState("");
    const [wishlistButton, setWishlistButton] = useState(false);

   useEffect(() => {
      const token = Cookies.get("token");
      const storedUserName = Cookies.get("userName");
  
      if (token && storedUserName) {
        setIsUser(true);
        setUserName(storedUserName);
      }
    }, []);

    console.log("userName", userName);
    

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('courseUpload')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching course:", error);
      } else {
        setCourse(data);
      }
    })();
  }, [id]);

  const feedbackFetch = async () => {
    const { data, error } = await supabase
      .from('courseFeedback')
      .select('*')
      .eq('courseId', id);

    if (data) {
      setFeedback(data);

      //  average rating
      const totalRating = data.reduce((sum, item) => sum + parseFloat(item.rating), 0);
      const average = totalRating / data.length;
      setAverageRating(average.toFixed(1)); 
    }

    if (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  useEffect(() => {
    feedbackFetch();
  }, [id]);

  const handleSubmitFeedback = async () => {
    if (!comment || ratingValue === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please provide both a comment and a rating!',
      });
      return;
    }

    try {
      const { error } = await supabase.from('courseFeedback').insert([
        {
          courseId: id,
          comment,
          rating: ratingValue,
        },
      ]);

      if (error) {
        console.error('Error submitting feedback:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error submitting feedback. Please try again later.',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Feedback submitted successfully!',
        });
        setComment('');
        setRatingValue(0);
        feedbackFetch();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Unexpected error occurred.',
      });
    }
  };
  const addToWishlist = async (course) => {
    try {
      // Check if the course is already in the wishlist
      const { data, error: fetchError } = await supabase
        .from("wishlist")
        .select("*")
        .eq("courseId", course.id)
        .single();
  
      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error checking wishlist:", fetchError);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error checking wishlist. Please try again later.",
        });
        return;
      }
  
      if (data) {
        Swal.fire({
          icon: "info",
          title: "Already in Wishlist",
          text: "This course is already in your wishlist!",
        });
        setWishlistButton(true); // Disable button if already in wishlist
        return;
      }
  
      // If not in wishlist, add it
      const { error } = await supabase.from("wishlist").insert([
        {
          courseId: course.id,
          courseTitle: course.courseTitle,
          courseShortDis: course.courseShortDis,
        },
      ]);
  
      if (error) {
        console.error("Error adding to wishlist:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error adding to wishlist. Please try again later.",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Course added to wishlist successfully!",
        });
        setWishlistButton(true); // Disable button after adding
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unexpected error occurred.",
      });
    }
  };
  
  // Fetch wishlist status and disable button if already in wishlist
  useEffect(() => {
    const fetchWishlistStatus = async () => {
      const { data, error } = await supabase.from("wishlist").select("*").eq("courseId", id);
      if (data && data.length > 0) {
        setWishlistButton(true);
      }
    };
    fetchWishlistStatus();
  }, [course]);

  const addToCart = async (course) => {
    try {
      const { data, error } = await supabase
        .from("cart")
        .select("*")
        .eq("courseId", course.id)
        .single();

      if (data) {
        // If course is already in the cart, update quantity
        await supabase
          .from("cart")
          .update({ quantity: data.quantity + 1 })
          .eq("id", data.id);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Course quantity updated in cart!',
          });
      } else {
        // Add new course to the cart
        if(userName){
        await supabase.from("cart").insert([
          {
            courseId: course.id,
            courseTitle: course.courseTitle,
            coursePrice: course.coursePrice,
            quantity: 1,
          },
        ]);
        }
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Course added to cart successfully!',
        });
        
      }

      if(userName){
        
        router.push("/cart")
      }else{
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: 'Please login to add course to cart.',
        });
        router.push("/signin")
      }

      // if (error) {
      //   console.error("Error adding to cart:", error);
      //   alert("Error adding to cart. Please try again later.");
      // }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Unexpected error occurred.");
    }
  };

 

  if (!course) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Left Section */}
        <Grid item xs={12} lg={8}>
          
          <Box sx={{ boxShadow: 3 }}>
            <VideoPlayer url={course.courseVideo} width={"100%"} height={"100%"} />
          </Box>

          {/* Course Header */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {course.courseTitle}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {course.courseShortDis}
            </Typography>

            {/* Average Rating Display */}
            <Box display="flex" alignItems="center" gap={2} mt={2}>
              <Rating
                name="average-rating-display"
                value={averageRating || 0}
                readOnly
                size="large"
              />
              <Typography variant="body1" fontWeight="bold">
                {averageRating} / 5
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({feedback.length} {feedback.length === 1 ? 'review' : 'reviews'})
              </Typography>
            </Box>
          </Box>

          {/* About Course Section */}
          <Card sx={{ mt: 4, p: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              About Course
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {course.courseDescription}
            </Typography>

            <Box mt={3}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Course Requirements:
              </Typography>
              <ul>
                {course.courseRequirement.split(',').map((req, index) => (
                  <li key={index}>
                    <Typography variant="body2" color="text.secondary">
                      {req.trim()}
                    </Typography>
                  </li>
                ))}
              </ul>
            </Box>

            <Box mt={3}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Tags:
              </Typography>
              <Chip label={course.courseTag} color="primary" variant="outlined" />
            </Box>
          </Card>

          {/* Instructor Details */}
          <Card sx={{ mt: 4, p: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Instructor Details
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mt={2}>
              <Avatar src={course.InstructorImage} alt="Instructor" sx={{ width: 64, height: 64 }} />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {course.InstructorName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {course.InstructorQualification}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" mt={2}>
              {course.InstructorBio}
            </Typography>
          </Card>

          {/* Comments and Ratings Section */}
          <Card sx={{ mt: 4, p: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Leave a Review
            </Typography>
            <Box mt={2}>
              <Typography variant="body1" gutterBottom>
                Rate this course:
              </Typography>
              <Rating
                name="course-rating"
                value={ratingValue}
                onChange={(event, newValue) => setRatingValue(newValue)}
                size="large"
              />
            </Box>
            <Box mt={2}>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Leave a comment..."
                variant="outlined"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Box>
            <Button
              variant="contained"
              sx={{ mt: 2, bgcolor: '#5022c3', '&:hover': { bgcolor: '#3e1a9e' } }}
              onClick={handleSubmitFeedback}
            >
              Submit
            </Button>
            {feedback.length > 0 && (
              <Box sx={{ mt: 5 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Course Reviews
                </Typography>
                {feedback.map((item, index) => (
                  <Box key={index} mt={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar src={item.userImage} alt="User" sx={{ width: 32, height: 32 }} />
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {item.userName}
                        </Typography>
                        <Rating
                          name="course-rating-display"
                          value={item.rating || 0}
                          readOnly
                          size="small"
                        />
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                      sx={{ p: 1 }}
                    >
                      {item.comment}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Card>
        </Grid>

        {/* Right Section */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 3, position: 'sticky', top: 16 }}>
            <Typography variant="h4" fontWeight="bold">
              ${course.coursePrice}
            </Typography>
            <Box mt={3}>
              <Button
              onClick={()=>addToCart(course)}
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#5022c3', '&:hover': { bgcolor: '#3e1a9e' } }}
              >
                Buy Now
              </Button>
              <Button
              onClick={()=>addToWishlist(course)}
                variant="outlined"
                fullWidth
                disabled={wishlistButton}
                sx={{ mt: 2, color: '#5022c3', borderColor: '#5022c3', '&:hover': { bgcolor: '#f3f0fd' } }}
              >
                Add to Wishlist
              </Button>
            </Box>
            <Box mt={4}>
              <Typography variant="body2" color="text.secondary">
                <strong>Language:</strong> {course.courseLanguage}
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CoursePage;
