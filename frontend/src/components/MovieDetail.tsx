import "./util.css"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import {
    Box,
    Typography,
    Button,
    CardMedia,
    Chip,
    Toolbar,
    Tabs,
    Tab,
    Card,
    CardContent,
    Avatar,
    Rating,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Grid,
    Paper,
    Skeleton,
} from "@mui/material"
import { Edit, Add, Star as StarIcon } from "@mui/icons-material"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import API_URLS from "../config/api"
import Header from "./Header"
import Footer from "./Footer"

interface ShowtimeDetail {
    id: number
    startTime: string
    cinema: string
    room: string
}

interface Movie {
    id: number
    nameMovie: string
    releaseDate: string
    durationMovie: string
    actor: string
    director: string
    studio: string
    content: string
    trailer: string
    avatar: string
    statusFilmId: StatusFilm
}

interface StatusFilm {
    id: number
    name: string
}

interface GroupedShowtimesMap {
    [date: string]: ShowtimeDetail[]
}

interface MovieDetailResponse {
    movie: Movie
    showtimes: GroupedShowtimesMap
}

interface ReviewResponse {
    id: number
    movieId: number
    userId: number
    email: string
    avatar: string
    rating: number
    comment: string
    updatedAt: string
}

interface ReviewRequestDTO {
    movieId: number
    userId: number
    rating: number
    comment: string
}

const MovieDetail = () => {
    const { t, i18n } = useTranslation()
    const { id } = useParams()
    const [movie, setMovie] = useState<Movie | null>(null)
    const [groupedShowtimes, setGroupedShowtimes] = useState<GroupedShowtimesMap | null>(null)
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [reviews, setReviews] = useState<ReviewResponse[]>([])
    const [reviewsLoading, setReviewsLoading] = useState(false)
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
    const [editingReview, setEditingReview] = useState<ReviewResponse | null>(null)
    const [newReview, setNewReview] = useState<{ rating: number; comment: string }>({
        rating: 5,
        comment: "",
    })
    const [permissionReview, setPermissionReview] = useState<boolean | null>(null);
    const [userReview, setUserReview] = useState<ReviewResponse | null>(null)

    const showtimeSectionRef = useRef<HTMLDivElement>(null)
    const reviewSectionRef = useRef<HTMLDivElement>(null)
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")
    const navigate = useNavigate()
    const location = useLocation()

    // Fetch movie details
    useEffect(() => {
        if (!id) return
        axios
            .get<MovieDetailResponse>(API_URLS.MOVIE.detail(id), {
                headers: { "Accept-Language": i18n.language },
            })
            .then((res) => {
                setMovie(res.data.movie)
                const fetchedShowtimes = res.data.showtimes || {}
                setGroupedShowtimes(fetchedShowtimes)
                const sortedDates = Object.keys(fetchedShowtimes).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
                if (sortedDates.length > 0) {
                    setSelectedDate(sortedDates[0])
                }
            })
            .catch((err) => {
                console.error("Lỗi khi tải chi tiết phim:", err)
                toast.error(t("movie.notfound"))
            })
    }, [id, t, i18n.language])

    // Fetch reviews
    useEffect(() => {
        if (!id) return
        fetchReviews()
    }, [id])

    useEffect(() => {
        if (userId != null) {
            checkPermissionReview();
        }
    }, [userId]);

    const checkPermissionReview = async () => {
        try {
            const response = await axios.get(API_URLS.REVIEW.chechkPermissionReview(), {
                headers: {
                    "Accept-Language": i18n.language,
                    "Authorization": `Bearer ${token}`,
                },
                params: {
                    userId: userId,
                    movieId: id,
                },
            });
            setPermissionReview(response.data === true); // hoặc kiểm tra kỹ hơn nếu response.data là object
        } catch (error) {
            console.error("Error fetching permission review:", error);
            setPermissionReview(false); // fallback nếu lỗi
        } finally {
            setReviewsLoading(false);
        }
    };

    console.log("token", token)
    const fetchReviews = async () => {
        setReviewsLoading(true)
        try {
            const response = await axios.get(API_URLS.REVIEW.getListReviewsByMovieId(id), {
                headers: { "Accept-Language": i18n.language,
                },
            })
            setReviews(response.data)

            // Find current user's review
            if (userId) {
                const currentUserReview = response.data.find(
                    (review: ReviewResponse) => review.userId === Number.parseInt(userId),
                )
                setUserReview(currentUserReview || null)
            }
        } catch (error) {
            console.error("Error fetching reviews:", error)
        } finally {
            setReviewsLoading(false)
        }
    }

    useEffect(() => {
        const shouldScroll = location.state && (location.state as { scrollToShowtime?: boolean }).scrollToShowtime
        if (shouldScroll && groupedShowtimes && Object.keys(groupedShowtimes).length > 0) {
            handleScrollToShowtime()
            navigate(location.pathname, { replace: true, state: {} })
        }
    }, [groupedShowtimes, location.state, navigate, location.pathname])

    if (!movie) {
        return (
            <Typography variant="h6" sx={{ padding: 4 }}>
                {t("movie.loading")}
            </Typography>
        )
    }

    const castList = movie.actor ? movie.actor.split(",") : []

    const getEmbedUrl = (url: string) => {
        if (!url) return ""
        if (url.includes("youtu.be/")) {
            const videoId = url.split("youtu.be/")[1]
            return `https://www.youtube.com/embed/${videoId}`
        }
        if (url.includes("watch?v=")) {
            return url.replace("watch?v=", "embed/")
        }
        return url
    }

    const sortedDates = groupedShowtimes
        ? Object.keys(groupedShowtimes).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        : []

    const showtimesForSelectedDate = selectedDate && groupedShowtimes ? groupedShowtimes[selectedDate] : []

    const groupedShowtimesByCinema: { [cinemaName: string]: ShowtimeDetail[] } = {}
    showtimesForSelectedDate.forEach((st) => {
        if (!groupedShowtimesByCinema[st.cinema]) {
            groupedShowtimesByCinema[st.cinema] = []
        }
        groupedShowtimesByCinema[st.cinema].push(st)
    })

    const handleDateChange = (event: React.SyntheticEvent, newValue: string) => {
        setSelectedDate(newValue)
    }

    const handleScrollToShowtime = () => {
        if (showtimeSectionRef.current) {
            showtimeSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }

    const handleScrollToReviews = () => {
        if (reviewSectionRef.current) {
            reviewSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }

    const handleChooseShowTime = async (id: number) => {
        try {
            const res = await axios.post(
                API_URLS.BOOKING.CHOOSE_SHOWTIME,
                { userId: Number.parseInt(userId || "0"), showtimeId: id },
                { headers: { Authorization: `Bearer ${token}`, "Accept-Language": i18n.language } },
            )
            const bookingId = res.data.id
            localStorage.setItem("bookingId", bookingId)
            toast.success(t(res.data.message, { 0: bookingId }))
            navigate(`/booking/${bookingId}/${movie.id}/${id}/choose-seat`)
        } catch (err: any) {
            toast.error(t(err.response?.data?.error || "booking.create.failed"))
        }
    }

    const handleOpenReviewDialog = (review?: ReviewResponse) => {
        if (review) {
            setEditingReview(review)
            setNewReview({ rating: review.rating, comment: review.comment })
        } else {
            setEditingReview(null)
            setNewReview({ rating: 5, comment: "" })
        }
        setReviewDialogOpen(true)
    }

    const handleCloseReviewDialog = () => {
        setReviewDialogOpen(false)
        setEditingReview(null)
        setNewReview({ rating: 5, comment: "" })
    }

    const handleSubmitReview = async () => {
        if (!userId || !movie) {
            toast.error("Vui lòng đăng nhập để gửi đánh giá")
            return
        }

        if (newReview.comment.trim().length < 10) {
            toast.error("Nội dung đánh giá phải có ít nhất 10 ký tự")
            return
        }

        try {
            const reviewData: ReviewRequestDTO = {
                movieId: movie.id,
                userId: Number.parseInt(userId),
                rating: newReview.rating,
                comment: newReview.comment.trim(),
            }

            if (editingReview) {
                // Update existing review
                await axios.put(API_URLS.REVIEW.updateReview(editingReview.id), reviewData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Accept-Language": i18n.language,
                    },
                })
                toast.success("Đánh giá đã được cập nhật thành công!")
            } else {
                // Create new review
                await axios.post(API_URLS.REVIEW.addReview, reviewData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Accept-Language": i18n.language,
                    },
                })
                toast.success("Đánh giá đã được gửi thành công!")
            }

            handleCloseReviewDialog()
            fetchReviews() // Refresh reviews
        } catch (error: any) {
            console.error("Error submitting review:", error)
            toast.error(error.response?.data?.message || "Không thể gửi đánh giá")
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
        return (sum / reviews.length).toFixed(1)
    }

    const getRatingDistribution = () => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        reviews.forEach((review) => {
            distribution[review.rating as keyof typeof distribution]++
        })
        return distribution
    }

    const ratingDistribution = getRatingDistribution()

    return (
        <Box>
            <Header />
            <Toolbar />
            <Box sx={{ paddingLeft: { xs: 2, md: 20 }, paddingRight: { xs: 2, md: 20 }, paddingBottom: 10, paddingTop: 10 }}>
                <Box sx={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "center" }}>
                    <CardMedia
                        component="img"
                        image={movie.avatar}
                        alt={movie.nameMovie}
                        sx={{
                            width: { xs: "100%", sm: 400, md: 450 },
                            height: { xs: 400, sm: 450, md: 500 },
                            objectFit: "cover",
                            borderRadius: 2,
                        }}
                    />
                    <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: 300 } }}>
                        <Typography
                            variant="h3"
                            fontWeight="bold"
                            mb={2}
                            sx={{ fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" } }}
                        >
                            {movie.nameMovie}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            {t("movie.description")}
                        </Typography>
                        <Typography paragraph sx={{ textAlign: "justify" }}>
                            {movie.content}
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            {t("movie.actor")}
                        </Typography>
                        <Box sx={{ mb: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {castList.map((actor, idx) => (
                                <Chip key={idx} label={actor.trim()} color="primary" sx={{ m: 0.5 }} />
                            ))}
                        </Box>
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            {t("movie.director")}
                        </Typography>
                        <Typography>{movie.director}</Typography>
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            {t("movie.duration")}
                        </Typography>
                        <Typography>{movie.durationMovie}</Typography>
                        <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
                            <Button variant="contained" color="error" size="large" onClick={handleScrollToShowtime}>
                                {t("booking.create.success").split(" ")[0]}
                            </Button>
                                <Button variant="outlined" color="primary" size="large" onClick={handleScrollToReviews}>
                                    Xem đánh giá
                                </Button>


                        </Box>
                    </Box>
                </Box>

                <Typography variant="h5" sx={{ mt: 6 }}>
                    {t("movie.trailer")}
                </Typography>
                <Box sx={{ mt: 2, mb: 4 }}>
                    <iframe
                        width="100%"
                        height="450"
                        src={getEmbedUrl(movie.trailer)}
                        title={t("movie.trailer")}
                        allowFullScreen
                        style={{ borderRadius: "12px" }}
                    />
                </Box>

                {/* Reviews Section */}
                <Box ref={reviewSectionRef} sx={{ mt: 6 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                        <Typography variant="h5">Đánh giá & Xếp hạng</Typography>
                        {permissionReview && (
                            <Button
                                variant="contained"
                                startIcon={userReview ? <Edit /> : <Add />}
                                onClick={() => handleOpenReviewDialog(userReview || undefined)}
                                sx={{ borderRadius: 2 }}
                            >
                                {userReview ? "Chỉnh sửa đánh giá" : "Viết đánh giá"}
                            </Button>
                        )}
                    </Box>

                    {/* Rating Summary */}
                    <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: "center" }}>
                                    <Typography variant="h2" fontWeight="bold" color="primary">
                                        {calculateAverageRating()}
                                    </Typography>
                                    <Rating value={Number.parseFloat(calculateAverageRating())} readOnly precision={0.1} size="large" />
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        Dựa trên {reviews.length} đánh giá
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <Box key={rating} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                        <Typography variant="body2" sx={{ minWidth: 20 }}>
                                            {rating}
                                        </Typography>
                                        <StarIcon sx={{ fontSize: 16, mx: 1, color: "gold" }} />
                                        <Box
                                            sx={{
                                                flex: 1,
                                                height: 8,
                                                backgroundColor: "grey.200",
                                                borderRadius: 1,
                                                mx: 1,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    height: "100%",
                                                    backgroundColor: "primary.main",
                                                    borderRadius: 1,
                                                    width: `${reviews.length > 0 ? (ratingDistribution[rating as keyof typeof ratingDistribution] / reviews.length) * 100 : 0}%`,
                                                }}
                                            />
                                        </Box>
                                        <Typography variant="body2" sx={{ minWidth: 30, textAlign: "right" }}>
                                            {ratingDistribution[rating as keyof typeof ratingDistribution]}
                                        </Typography>
                                    </Box>
                                ))}
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Reviews List */}
                    <Box>
                        {reviewsLoading ? (
                            // Loading skeletons
                            Array.from({ length: 3 }).map((_, index) => (
                                <Card key={index} sx={{ mb: 2, borderRadius: 2 }}>
                                    <CardContent>
                                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                            <Skeleton variant="circular" width={48} height={48} />
                                            <Box sx={{ ml: 2, flex: 1 }}>
                                                <Skeleton variant="text" width="30%" />
                                                <Skeleton variant="text" width="60%" />
                                            </Box>
                                        </Box>
                                        <Skeleton variant="text" width="100%" />
                                        <Skeleton variant="text" width="80%" />
                                    </CardContent>
                                </Card>
                            ))
                        ) : reviews.length === 0 ? (
                            <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
                                <Typography variant="h6" color="text.secondary">
                                    Chưa có đánh giá nào
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Hãy là người đầu tiên chia sẻ suy nghĩ về bộ phim này!
                                </Typography>
                            </Paper>
                        ) : (
                            reviews.map((review) => (
                                <Card key={review.id} sx={{ mb: 2, borderRadius: 2, position: "relative" }}>
                                    <CardContent>
                                        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                                            <Avatar src={review.avatar} alt={review.email} sx={{ width: 48, height: 48, mr: 2 }}>
                                                {review.email.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        {review.email}
                                                    </Typography>
                                                    {userId && review.userId === Number.parseInt(userId) && (
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleOpenReviewDialog(review)}
                                                            sx={{ color: "primary.main" }}
                                                        >
                                                            <Edit fontSize="small" />
                                                        </IconButton>
                                                    )}
                                                </Box>
                                                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                    <Rating value={review.rating} readOnly size="small" />
                                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                                        {formatDate(review.updatedAt)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                                            {review.comment}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </Box>
                </Box>

                <Typography variant="h5" sx={{ mt: 6, mb: 3 }}>
                    {t("showtime.schedule")}
                </Typography>
                <Box>
                    {sortedDates.length === 0 ? (
                        <Typography>{t("showtime.none")}</Typography>
                    ) : (
                        <Box
                            ref={showtimeSectionRef}
                            sx={{
                                borderBottom: 1,
                                borderColor: "divider",
                                overflowX: "auto",
                                "&::-webkit-scrollbar": { display: "none" },
                            }}
                        >
                            <Tabs
                                value={selectedDate}
                                onChange={handleDateChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                aria-label={t("showtime.schedule")}
                            >
                                {sortedDates.map((date) => (
                                    <Tab
                                        key={date}
                                        label={new Date(
                                            Number.parseInt(date.substring(0, 4)),
                                            Number.parseInt(date.substring(5, 7)) - 1,
                                            Number.parseInt(date.substring(8, 10)),
                                        ).toLocaleDateString("vi-VN", { weekday: "short", month: "2-digit", day: "2-digit" })}
                                        value={date}
                                        sx={{ minWidth: 120 }}
                                    />
                                ))}
                            </Tabs>
                        </Box>
                    )}
                    {selectedDate && groupedShowtimes && groupedShowtimes[selectedDate] && (
                        <Box sx={{ mt: 3 }}>
                            {Object.keys(groupedShowtimesByCinema).length === 0 ? (
                                <Typography>{t("showtime.none")}</Typography>
                            ) : (
                                Object.keys(groupedShowtimesByCinema).map((cinemaName) => (
                                    <Box key={cinemaName} sx={{ mb: 3, p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}>
                                        <Typography variant="h6" color="secondary" sx={{ mb: 1 }}>
                                            {cinemaName}
                                        </Typography>
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                            {groupedShowtimesByCinema[cinemaName].map((st) => (
                                                <Button
                                                    key={st.id}
                                                    variant="outlined"
                                                    color="primary"
                                                    sx={{
                                                        minWidth: "unset",
                                                        px: 1.5,
                                                        py: 0.5,
                                                        fontSize: "0.8rem",
                                                        fontWeight: "bold",
                                                        "&:hover": { backgroundColor: "primary.light" },
                                                    }}
                                                    onClick={() => handleChooseShowTime(st.id)}
                                                >
                                                    {st.startTime}
                                                </Button>
                                            ))}
                                        </Box>
                                    </Box>
                                ))
                            )}
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Review Dialog */}
            <Dialog
                open={reviewDialogOpen}
                onClose={handleCloseReviewDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ pb: 1 }}>{editingReview ? "Chỉnh sửa đánh giá của bạn" : "Viết đánh giá"}</DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 3, mt: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Xếp hạng
                        </Typography>
                        <Rating
                            value={newReview.rating}
                            onChange={(_, newValue) => {
                                setNewReview((prev) => ({ ...prev, rating: newValue || 1 }))
                            }}
                            size="large"
                        />
                    </Box>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Đánh giá của bạn"
                        placeholder="Chia sẻ suy nghĩ của bạn về bộ phim này..."
                        value={newReview.comment}
                        onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        Tối thiểu 10 ký tự
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={handleCloseReviewDialog} color="inherit">
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmitReview}
                        variant="contained"
                        disabled={newReview.comment.trim().length < 10}
                        sx={{ borderRadius: 2 }}
                    >
                        {editingReview ? "Cập nhật đánh giá" : "Gửi đánh giá"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Toolbar />
        </Box>
    )
}

export default MovieDetail
