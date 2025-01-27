"use client";
import Image from "next/image";
import styles from "./page.module.css";
import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  Container,
  Grid,
  Card,
  CardContent,
  Rating, // Importing Rating
} from "@mui/material";
import Banner from "@/Layout/Banner";
import { useEffect, useState } from "react";
import supabase from "./config/configsupa";
import { useRouter } from "next/navigation";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [averageRatings, setAverageRatings] = useState({}); // Ratings per course
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:600px)");

  // Fetch course data
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data: courseUpload, error } = await supabase
          .from("courseUpload")
          .select();
        if (error) setError(error.message);
        else setData(courseUpload);
      } catch (err) {
        setError("Unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch feedback and calculate ratings
  useEffect(() => {
    const fetchFeedback = async () => {
      const { data: feedbackData, error } = await supabase
        .from("courseFeedback")
        .select("*");

      if (feedbackData) {
        setFeedback(feedbackData);

        // Calculate average ratings for each course
        const ratingsMap = feedbackData.reduce((acc, item) => {
          if (!acc[item.courseId]) {
            acc[item.courseId] = { totalRating: 0, count: 0 };
          }
          acc[item.courseId].totalRating += parseFloat(item.rating);
          acc[item.courseId].count += 1;
          return acc;
        }, {});

        // Finalize average ratings
        const averages = Object.keys(ratingsMap).reduce((acc, courseId) => {
          acc[courseId] = (
            ratingsMap[courseId].totalRating / ratingsMap[courseId].count
          ).toFixed(1);
          return acc;
        }, {});

        setAverageRatings(averages);
      }

      if (error) console.error("Error fetching feedback:", error);
    };

    fetchFeedback();
  }, []);

  const categoryData = data?.filter((data) => {
    return category ? data?.courseCategory === category : data.status === "approved";
  });

  console.log(data);
  

  return (
    <>
      <Banner />
      <Container maxWidth="lg" sx={{ my: 4 }}>
        {/* Title Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{ fontWeight: "bold" }}
            gutterBottom
          >
            All the skills you need in one place
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: "bold", color: "#666" }}
            gutterBottom
          >
            From critical skills to technical topics, Udemy supports your
            professional development.
          </Typography>
        </Box>
        <Divider />

        {/* Categories Section */}
        <Box
          sx={{
            mt: 4,
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: isMobile ? "center" : "flex-start",
          }}
        >
          {data?.map((data, index) => (
            <Button
              onClick={() => setCategory(data?.courseCategory)}
              key={index}
              sx={{
                backgroundColor: "gray",
                color: "white",
                textTransform: "none",
                borderRadius: "20px",
                padding: "8px 16px",
                fontSize: "14px",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#6e6e6e",
                  boxShadow: "none",
                },
                minWidth: isMobile ? "100%" : "fit-content",
                maxWidth: "200px", 
                textAlign: "center",
              }}
            >
              {data?.courseCategory}
            </Button>
          ))}
        </Box>

        {/* Cards Section */}
        <Box sx={{ my: 4 }}>
          <Grid container spacing={3}>
            {categoryData?.map((data, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Button
                  onClick={() => router.push(`details/${data.id}`)}
                  sx={{
                    width: "100%",
                    padding: 0,
                    borderRadius: 2,
                    boxShadow: "none",
                    textTransform: "none",
                    "&:hover": {
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <Card
                    sx={{
                      width: "100%",
                      borderRadius: 2,
                      overflow: "hidden",
                      textAlign: "left",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                      "&:hover": {
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 140,
                        backgroundImage: `url(${data?.courseThumbnail})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        {data?.courseTitle}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {data?.InstructorName}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Rating
                          name="read-only-rating"
                          value={parseFloat(averageRatings[data?.id]) || 0}
                          readOnly
                          precision={0.1}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {averageRatings[data?.id]
                            ? `${averageRatings[data?.id]} / 5`
                            : "No ratings yet"}
                        </Typography>
                      </Box>
                    </CardContent>
                    <Box
                      sx={{
                        m: 2,
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: "#3d18a3",
                          color: "#fff",
                          padding: "5px",
                        }}
                      >
                        Premium
                      </span>
                    </Box>
                  </Card>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
                {/* company logos */}
                <Box sx={{
          my:5
        }}>
          <Typography align="center" variant="body1" sx={{
            
            color: "#666",
            my: 4,
            py:3,
            fontSize: 16,
            lineHeight: 1.5,
          }}>
          Trusted by over 16,000 companies and millions of learners around the world
          </Typography>
          <Stack spacing={3} direction={"row"} justifyContent={"space-between"}
          sx={{
            mx:3
          }}
          >
           <Stack>
             <Image
               src="https://cms-images.udemycdn.com/content/tqevknj7om/svg/volkswagen_logo.svg?position=c&quality=80&x.app=portals"
               alt="Company 1"
               width={100}
               height={50}
             />
            
           </Stack>
           <Stack>
           <Image
               src="https://cms-images.udemycdn.com/content/2gevcc0kxt/svg/samsung_logo.svg?position=c&quality=80&x.app=portals"
               alt="Company 2"
               width={100}
               height={50}
             />
            
           </Stack>
           <Stack>
           <Image
               src="https://cms-images.udemycdn.com/content/mueb2ve09x/svg/cisco_logo.svg?position=c&quality=80&x.app=portals"
               alt="Company 2"
               width={100}
               height={50}
             />
            
           </Stack>
           <Stack>
           <Image
               src="https://cms-images.udemycdn.com/content/ryaowrcjb2/svg/vimeo_logo_resized-2.svg?position=c&quality=80&x.app=portals"
               alt="Company 2"
               width={100}
               height={50}
             />
            
           </Stack>
           <Stack>
           <Image
               src="https://cms-images.udemycdn.com/content/bthyo156te/svg/procter_gamble_logo.svg?position=c&quality=80&x.app=portals"
               alt="Company 2"
               width={100}
               height={50}
             />
            
           </Stack>
           <Stack>
           <Image
               src="https://cms-images.udemycdn.com/content/luqe0d6mx2/svg/hewlett_packard_enterprise_logo.svg?position=c&quality=80&x.app=portals"
               alt="Company 2"
               width={100}
               height={50}
             />
            
           </Stack>
           <Stack>
           <Image
               src="https://cms-images.udemycdn.com/content/siaewwmkch/svg/citi_logo.svg?position=c&quality=80&x.app=portals"
               alt="Company 2"
               width={100}
               height={50}
             />
            
           </Stack>
           <Stack>
           <Image
               src="https://cms-images.udemycdn.com/content/swmv0okrlh/svg/ericsson_logo.svg?position=c&quality=80&x.app=portals"
               alt="Company 2"
               width={100}
               height={50}
             />
            
           </Stack>
          </Stack>
        </Box>
      </Container>
    </>
  );
}
