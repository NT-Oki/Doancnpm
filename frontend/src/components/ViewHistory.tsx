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
  Avatar,
} from "@mui/material";
// import Grid from "@mui/material/Grid"; // Loại bỏ Grid
import {
  // CalendarToday, // Đã bỏ import
  // AccessTime, // Đã bỏ import
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
  "success" | "warning" | "error" | "info" | "default" // Thêm 'info' và 'default'
> = {
  Completed: "success",
  Pending: "warning",
  Cancelled: "error",
  Confirmed: "info", // Thêm trạng thái Confirmed nếu có
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

      // Lọc các booking có trạng thái "Confirmed" hoặc "Completed" nếu cần
      setBookings(
        data.filter(
          (booking) =>
            booking.status?.toLowerCase() === "seen" &&
            (booking.totalAmount ?? 0) > 0
        )
      );
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tải lịch sử đặt vé.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  return (
    <Box p={{ xs: 2, md: 8 }}>
      <Typography variant="h4" fontWeight="bold" mt={3} gutterBottom>
        {t("history.title")}
      </Typography>
      <Typography color="text.secondary" mb={4}>
        {t("history.subtitle")}
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : bookings.length === 0 ? (
        <Typography variant="h6" color="text.secondary" mt={4}>
          {t("history.empty")}
        </Typography>
      ) : (
        <Box
          display="flex"
          flexWrap="wrap"
          gap={3} // Khoảng cách giữa các item (tương tự spacing của Grid)
          justifyContent={{ xs: "center", sm: "flex-start" }} // Căn giữa trên màn hình nhỏ, căn trái trên màn hình lớn
        >
          {bookings.map((booking) => (
            <Card
              key={booking.codeBooking}
              variant="outlined"
              sx={{
                // ĐÂY LÀ PHẦN THAY ĐỔI ĐỂ ĐẢM BẢO 1 DÒNG 1 PHIM
                width: "100%", // Mỗi Card sẽ chiếm 100% chiều rộng của container
                // Các thuộc tính khác không thay đổi để giữ nguyên nội dung
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: { xs: 130, sm: 150, md: 170 }, // Giữ nguyên minHeight của bạn
                maxHeight: { xs: "auto", sm: "auto", md: "auto" }, // Giữ nguyên maxHeight của bạn
                flexGrow: 1,
                borderRadius: 2,
                overflow: "hidden",
                cursor: "pointer",
                "&:hover": {
                  boxShadow: 8,
                  transform: "translateY(-5px)",
                  transition: "0.3s ease-in-out",
                },
              }}
              onClick={() => setSelectedBooking(booking)}
            >
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: "primary.main",
                  fontWeight: "bold",
                  mr: 2,
                }}
              >
                {booking.movieTitle
                  ? booking.movieTitle.charAt(0).toUpperCase()
                  : "?"}
              </Avatar>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1, // Đảm bảo CardContent chiếm đủ không gian còn lại
                  p: 2,
                  "&:last-child": { pb: 2 },
                }}
              >
                {/* TIÊU ĐỀ PHIM */}
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    mb: 1,
                    minHeight: "1.4em", // Đảm bảo chiếm đủ 2 dòng
                    lineHeight: "1.4em",
                  }}
                >
                  {booking.movieTitle}
                </Typography>

                {/* THÔNG TIN CHI TIẾT */}
                {/* Giữ nguyên flexGrow và justifyContent để đẩy nội dung ra xa nhau nếu muốn, hoặc điều chỉnh nếu thấy khoảng trắng */}
                <Stack
                  spacing={1}
                  mt={1}
                  flexGrow={1}
                  justifyContent="space-between"
                >
                  {/* Mã đặt vé */}
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <ConfirmationNumber fontSize="small" />
                    <Typography variant="body2" fontWeight="bold">
                      {booking.codeBooking}
                    </Typography>
                  </Stack>

                  {/* Ghế ngồi */}
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Place fontSize="small" />
                    <Typography variant="body2" fontWeight="bold">
                      {booking.seatNames && booking.seatNames.length > 0
                        ? booking.seatNames.join(", ")
                        : "Chưa chọn ghế"}
                    </Typography>
                  </Stack>
                </Stack>

                {/* GIÁ VÀ TRẠNG THÁI */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={2}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <AttachMoney fontSize="small" />
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="success.main"
                    >
                      {booking.totalAmount != null
                        ? booking.totalAmount.toLocaleString("vi-VN")
                        : "0"}{" "}
                      VNĐ
                    </Typography>
                  </Stack>
                  <Chip
                    label={t(
                      `booking.status.${booking.status.toLowerCase()}`,
                      booking.status
                    )}
                    size="small"
                    color={statusColor[booking.status] || "default"}
                  />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
      {/* Dialog vẫn giữ nguyên như code trước đó */}
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
              {/* Ngày đặt trong Dialog */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography> {t("dialog.date_booking")}:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {selectedBooking.dateBooking}
                </Typography>
              </Stack>
              {/* Giờ chiếu trong Dialog */}
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
                  ? selectedBooking.totalAmount.toLocaleString("vi-VN")
                  : "0"}{" "}
                VNĐ
              </Typography>
              <Chip
                label={t(
                  `booking.status.${selectedBooking.status.toLowerCase()}`,
                  selectedBooking.status
                )}
                size="small"
                color={statusColor[selectedBooking.status] || "default"}
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
