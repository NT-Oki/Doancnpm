import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  CalendarToday,
  AccessTime,
  Place,
  ConfirmationNumber,
  AttachMoney,
} from "@mui/icons-material";
import API_URLS, { apiRequest } from "../config/api";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface UserHistoryBooking {
  codeBooking: string;
  dateBooking: string;
  totalAmount: number;
  status: string;
  movieTitle: string;
  startTime: string;
  seatNames: string[];
}

const statusColor: Record<
  UserHistoryBooking["status"],
  "success" | "warning" | "error"
> = {
  Completed: "success",
  Pending: "warning",
  Cancelled: "error",
};

const ViewHistory: React.FC = () => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<UserHistoryBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] =
    useState<UserHistoryBooking | null>(null);

  const fetchBookingHistory = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        navigate("/login");
        return;
      }

      const data = await apiRequest(
        API_URLS.BOOKING.GET_USER_HISTORY(Number(userId)),
        {},
        () => {
          localStorage.removeItem("token");
          navigate("/login");
        },
        navigate
      );

      setBookings(
        data.filter((booking: any) => booking.status === "Confirmed")
      );
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  return (
    <Box p={8}>
      <Typography variant="h2" fontWeight="bold" mt={3} gutterBottom>
        {t("history.title")}
      </Typography>
      <Typography color="text.secondary" mb={3}>
        {t("history.subtitle")}
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : bookings.length === 0 ? (
        <Typography>{t("history.empty")}</Typography>
      ) : (
        <Grid container spacing={3} alignItems="stretch">
          {bookings.map((booking) => (
            <Grid item xs={12} sm={6} md={4} key={booking.codeBooking}>
              <Card
                variant="outlined"
                sx={{
                  p: 2,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  cursor: "pointer", // thêm để hover thấy rõ
                  "&:hover": {
                    boxShadow: 3,
                    transform: "scale(1.01)",
                    transition: "0.2s",
                  },
                }}
                onClick={() => setSelectedBooking(booking)}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="start"
                    mb={1}
                  >
                    <Typography
                      fontWeight="bold"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {booking.movieTitle}
                    </Typography>
                  </Stack>
                  <Stack spacing={1} mt={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <ConfirmationNumber fontSize="small" />
                      <Typography variant="body2" fontWeight="bold">
                        {booking.codeBooking}
                      </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Place fontSize="small" />
                      <Typography variant="body2" fontWeight="bold">
                        {booking.seatNames && booking.seatNames.length > 0
                          ? booking.seatNames.join(", ")
                          : "Chưa chọn ghế"}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      mt={1}
                    >
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="success.main"
                      >
                        {booking.totalAmount != null
                          ? booking.totalAmount.toLocaleString()
                          : "0"}{" "}
                        đ
                      </Typography>
                    </Stack>
                    <Chip
                      label={t(
                        `booking.status.${booking.status.toLowerCase()}`,
                        booking.status
                      )}
                      size="small"
                      color={statusColor[booking.status]}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle variant="h4">{t("dialog.booking_detail")}</DialogTitle>
        <DialogContent dividers>
          {selectedBooking && (
            <Stack spacing={1}>
              <Typography variant="h6" fontWeight="bold">
                {selectedBooking.movieTitle}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography>{t("dialog.code_booking")}:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {selectedBooking.codeBooking}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography> {t("dialog.date_booking")}:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {selectedBooking.dateBooking}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography> {t("dialog.start_time")}:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {selectedBooking.startTime}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography> {t("dialog.seats")}:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {selectedBooking.seatNames &&
                  selectedBooking.seatNames.length > 0
                    ? selectedBooking.seatNames.join(", ")
                    : t("dialog.no_seat")}
                </Typography>
              </Stack>
              <Typography
                variant="body1"
                fontWeight="bold"
                color="success.main"
              >
                {t("dialog.price")}:{" "}
                {selectedBooking.totalAmount != null
                  ? selectedBooking.totalAmount.toLocaleString()
                  : "0"}{" "}
                đ
              </Typography>
              <Chip
                label={t(
                  `booking.status.${selectedBooking.status.toLowerCase()}`,
                  selectedBooking.status
                )}
                size="small"
                color={statusColor[selectedBooking.status]}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedBooking(null)} variant="outlined">
            {t("dialog.close")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewHistory;
