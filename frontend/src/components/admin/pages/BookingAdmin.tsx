// components/BookingAdmin.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  TablePagination, // <-- Import TablePagination
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import API_URLS from '../../../config/api';
import { SnackbarProvider, useSnackbar } from 'notistack';

interface BookingCheckoutDto {
  bookingId: number;
  userId: number;
  nameSeats: string[];
  quantityNormalSeat: number;
  totalPriceNormalSeat: number;
  quantityCoupleSeat: number;
  totalPriceCoupleSeat: number;
  totalPrice: number | null;
  movieName: string;
  startTime: string;
  roomName: string;
  bookingCode: string | null;
  userName: string;
  userEmail: string;
  userCode: string;
  // Thêm các trường promotion nếu bạn muốn hiển thị chúng trong chi tiết
  promotionCode?: string;
  promotionName?: string;
  originalAmount?: number;
  discountAmount?: number;
}

// Bọc BookingAdmin với SnackbarProvider
export default function BookingAdminW() {
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <BookingAdmin />
    </SnackbarProvider>
  );
}

function BookingAdmin() {
  const token = localStorage.getItem("token");
  const [data, setData] = useState<BookingCheckoutDto[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  // States cho Confirm Dialog
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [bookingToDeleteId, setBookingToDeleteId] = useState<number | null>(null);

  const { enqueueSnackbar } = useSnackbar();
  const [selectedBooking, setSelectedBooking] = useState<BookingCheckoutDto | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  // --- THÊM CÁC STATES MỚI CHO PHÂN TRANG ---
  const [page, setPage] = useState(0); // Trang hiện tại (0-indexed)
  const [rowsPerPage, setRowsPerPage] = useState(10); // Số lượng mục trên mỗi trang
  const [totalElements, setTotalElements] = useState(0); // Tổng số lượng mục từ API

  const handleViewDetail = (booking: BookingCheckoutDto) => {
    setSelectedBooking(booking);
    setOpenDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedBooking(null);
  };

  // --- SỬA ĐỔI HÀM fetchBookings ĐỂ HỖ TRỢ PHÂN TRANG VÀ TÌM KIẾM ---
  const fetchBookings = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      // Gửi các tham số page, size (rowsPerPage) và search (searchText) lên backend
      const response = await axios.get(API_URLS.ADMIN.booking.list_booking, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          page: page,       // Gửi trang hiện tại
          size: rowsPerPage, // Gửi số lượng mục trên mỗi trang
          search: searchText // Gửi từ khóa tìm kiếm
        }
      });

      // Giả định response từ backend có dạng: { content: [], totalElements: 100 }
      setData(response.data.content || []); // Dữ liệu của trang hiện tại
      setTotalElements(response.data.totalElements || 0); // Tổng số lượng mục
    } catch (err: any) {
      console.error("Lỗi khi lấy danh sách đặt vé", err.response?.data || err.message);
      enqueueSnackbar("Lỗi khi lấy danh sách đặt vé", { variant: 'error' });
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  // --- THAY ĐỔI useEffect ĐỂ GỌI fetchBookings MỖI KHI page, rowsPerPage HOẶC searchText THAY ĐỔI ---
  useEffect(() => {
    fetchBookings();
  }, [page, rowsPerPage, searchText]); // Thêm searchText vào dependencies

  // --- HÀM THAY ĐỔI TRANG VÀ SỐ LƯỢNG MỤC TRÊN MỖI TRANG ---
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset về trang đầu tiên khi thay đổi số mục trên mỗi trang
  };

  // `filteredBookings` không còn cần thiết vì backend đã xử lý lọc
  // Chúng ta sẽ sử dụng trực tiếp `data` (đã được phân trang và tìm kiếm từ API)
  const displayBookings = data;

  // Mở hộp thoại xác nhận xóa
  const handleOpenConfirmDelete = (id: number) => {
    setBookingToDeleteId(id);
    setOpenConfirmDialog(true);
  };

  // Đóng hộp thoại xác nhận xóa
  const handleCloseConfirmDelete = () => {
    setOpenConfirmDialog(false);
    setBookingToDeleteId(null);
  };

  // Thực hiện xóa sau khi xác nhận
  const handleConfirmDelete = async () => {
    if (bookingToDeleteId === null) return;

    try {
      const response = await axios.delete(API_URLS.ADMIN.booking.delete_booking(bookingToDeleteId), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      enqueueSnackbar(response.data?.message || "Xóa đặt vé thành công!", { variant: 'success' });
      fetchBookings(); // Tải lại danh sách sau khi xóa, sẽ tự động lấy trang hiện tại
    } catch (err: any) {
      console.error("Lỗi khi xóa đặt vé: ", err.response?.data?.message || err.message);
      enqueueSnackbar("Lỗi khi xóa đặt vé: " + (err.response?.data?.message || err.message), { variant: 'error' });
    } finally {
      handleCloseConfirmDelete();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý đặt vé
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Tìm kiếm theo tên phim, phòng, khách hàng hoặc mã vé"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          size="small"
          sx={{ width: 400 }}
        />
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Mã đặt vé</TableCell>
                  <TableCell>Khách hàng</TableCell>
                  <TableCell>Tên phim</TableCell>
                  <TableCell>Phòng</TableCell>
                  <TableCell>Thời gian chiếu</TableCell>
                  <TableCell>Ghế</TableCell>
                  <TableCell>Tổng tiền</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayBookings.length > 0 ? (
                  displayBookings.map((booking) => (
                    <TableRow key={booking.bookingId}>
                      <TableCell>{booking?.bookingCode || ''}</TableCell>
                      <TableCell>{booking.userName}</TableCell>
                      <TableCell>{booking.movieName}</TableCell>
                      <TableCell>{booking.roomName}</TableCell>
                      <TableCell>{booking?.startTime || ''}</TableCell>
                      <TableCell>{booking.nameSeats?.join(', ')}</TableCell>
                      <TableCell>
                        {booking.totalPrice?.toLocaleString('vi-VN') || ''} VND
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleViewDetail(booking)}
                          sx={{ mr: 1 }}
                        >
                          Xem chi tiết
                        </Button>
                        {/* <IconButton
                          aria-label="delete"
                          color="error"
                          onClick={() => handleOpenConfirmDelete(booking.bookingId)}
                        >
                          <DeleteIcon />
                        </IconButton> */}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      Không có đặt vé nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* --- THÊM THÀNH PHẦN PHÂN TRANG --- */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]} // Các tùy chọn số mục trên mỗi trang
            component="div"
            count={totalElements} // Tổng số mục từ API
            rowsPerPage={rowsPerPage} // Số mục hiện tại trên mỗi trang
            page={page} // Trang hiện tại
            onPageChange={handleChangePage} // Hàm xử lý khi thay đổi trang
            onRowsPerPageChange={handleChangeRowsPerPage} // Hàm xử lý khi thay đổi số mục
            labelRowsPerPage="Số hàng mỗi trang:" // Nhãn tùy chỉnh
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
            } // Nhãn hiển thị số hàng
            sx={{ mt: 2 }}
          />
        </>
      )}

      {/* Confirm Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDelete}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">{"Xác nhận xóa đặt vé?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Bạn có chắc chắn muốn xóa đặt vé này không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDelete} color="primary">
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Dialog (Đã thêm hiển thị thông tin khuyến mãi) */}
      <Dialog open={openDetailDialog} onClose={handleCloseDetailDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Chi tiết đặt vé</DialogTitle>
        <DialogContent dividers>
          {selectedBooking && (
            <Stack spacing={1}>
              <Typography><strong>Mã vé:</strong> {selectedBooking.bookingCode}</Typography>
              <Typography><strong>Khách hàng:</strong> {selectedBooking.userName} ({selectedBooking.userEmail})</Typography>
              <Typography><strong>Mã khách hàng:</strong> {selectedBooking.userCode}</Typography>
              <Typography><strong>Phim:</strong> {selectedBooking.movieName}</Typography>
              <Typography><strong>Phòng:</strong> {selectedBooking.roomName}</Typography>
              <Typography><strong>Thời gian chiếu:</strong> {selectedBooking.startTime}</Typography>
              <Typography><strong>Ghế:</strong> {selectedBooking.nameSeats.join(', ')}</Typography>
              <Typography><strong>Số lượng ghế thường:</strong> {selectedBooking.quantityNormalSeat}</Typography>
              <Typography><strong>Tiền ghế thường:</strong> {selectedBooking.totalPriceNormalSeat?.toLocaleString('vi-VN')} VND</Typography>
              <Typography><strong>Số lượng ghế đôi:</strong> {selectedBooking.quantityCoupleSeat}</Typography>
              <Typography><strong>Tiền ghế đôi:</strong> {selectedBooking.totalPriceCoupleSeat?.toLocaleString('vi-VN')} VND</Typography>
              <Typography><strong>Tổng tiền ban đầu:</strong> {selectedBooking.originalAmount?.toLocaleString('vi-VN')} VND</Typography>
              <Typography><strong>Số tiền giảm giá:</strong> {selectedBooking.discountAmount?.toLocaleString('vi-VN')} VND</Typography>
              <Typography><strong>Tổng tiền cuối cùng:</strong> {selectedBooking.totalPrice?.toLocaleString('vi-VN')} VND</Typography>
              {selectedBooking.promotionCode && (
                <Typography><strong>Mã khuyến mãi:</strong> {selectedBooking.promotionCode}</Typography>
              )}
              {selectedBooking.promotionName && (
                <Typography><strong>Tên khuyến mãi:</strong> {selectedBooking.promotionName}</Typography>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}