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
  TablePagination,
  Chip,
  ChipProps,
  // Thêm các imports mới cho Select
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
// Thêm các icon cần thiết
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EventSeatIcon from '@mui/icons-material/EventSeat'; // Cho empty state
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'; // Cho tổng tiền trong dialog

import axios from 'axios';
import API_URLS from '../../../config/api';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { SelectChangeEvent } from '@mui/material/Select'; // Import SelectChangeEvent

interface BookingCheckoutDto {
  bookingId: number;
  userId: number;
  nameSeats: string[];
  quantityNormalSeat: number;
  totalPriceNormalSeat: number;
  quantityCoupleSeat: number;
  totalPriceCoupleSeat: number;
  totalPrice: Number | null;
  movieName: string;
  startTime: string;
  roomName: string;
  bookingCode: string | null;
  userName: string;
  userEmail: string;
  userCode: string;
  bookingStatus: number; // Đảm bảo trường này có trong DTO của bạn
  // Thêm các trường promotion nếu bạn muốn hiển thị chúng trong chi tiết
  promotionCode?: string;
  promotionName?: string;
  originalAmount?: Number;
  discountAmount?: Number;
}

interface StatusConfig {
  label: string;
  color: ChipProps['color'];
  variant?: ChipProps['variant'];
}

const getStatusChipProps = (statusCode: number): StatusConfig => {
  switch (statusCode) {
    case 2: // Thanh toán thành công
      return { label: 'Đã thanh toán', color: 'success', variant: 'filled' };
    case 3: // Đã xem
      return { label: 'Đã xem', color: 'primary', variant: 'filled' };
    case 1: // Ví dụ: Đang chờ thanh toán (nếu có trạng thái này)
      return { label: 'Đang chờ', color: 'warning', variant: 'outlined' };
    default: // Các trạng thái khác
      return { label: 'Không xác định', color: 'default', variant: 'outlined' };
  }
};

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
  const [selectedStatus, setSelectedStatus] = useState<number | ''>(''); // <-- THÊM STATE CHO LỌC TRẠNG THÁI

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

  // --- SỬA ĐỔI HÀM fetchBookings ĐỂ HỖ TRỢ PHÂN TRANG, TÌM KIẾM VÀ LỌC THEO TRẠNG THÁI ---
  const fetchBookings = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      // Gửi các tham số page, size (rowsPerPage), search (searchText) và status (selectedStatus) lên backend
      const response = await axios.get(API_URLS.ADMIN.booking.list_booking, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          page: page,       // Gửi trang hiện tại
          size: rowsPerPage, // Gửi số lượng mục trên mỗi trang
          search: searchText, // Gửi từ khóa tìm kiếm
          status: selectedStatus !== '' ? selectedStatus : undefined, // <-- THÊM THAM SỐ STATUS
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

  // --- THAY ĐỔI useEffect ĐỂ GỌI fetchBookings MỖI KHI page, rowsPerPage, searchText HOẶC selectedStatus THAY ĐỔI ---
  useEffect(() => {
    fetchBookings();
  }, [page, rowsPerPage, searchText, selectedStatus]); // Thêm selectedStatus vào dependencies

  // --- HÀM THAY ĐỔI TRANG VÀ SỐ LƯỢNG MỤC TRÊN MỖI TRANG ---
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset về trang đầu tiên khi thay đổi số mục trên mỗi trang
  };

  // Hàm xử lý thay đổi trạng thái lọc
  const handleStatusChange = (event: SelectChangeEvent<number>) => {
    setSelectedStatus(event.target.value as number);
    setPage(0); // Reset về trang đầu tiên khi thay đổi bộ lọc trạng thái
    // fetchBookings() sẽ được gọi qua useEffect
  };

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

  const handleSearch = () => {
    setPage(0); // Luôn reset về trang đầu tiên khi tìm kiếm mới
    fetchBookings(); // Thực hiện tìm kiếm
  };

  const handleRefresh = () => {
    setSearchText(''); // Xóa nội dung tìm kiếm
    setSelectedStatus(''); // Xóa bộ lọc trạng thái
    setPage(0); // Reset về trang đầu tiên
    setRowsPerPage(10); // Reset số hàng mỗi trang (tùy chọn)
    fetchBookings(); // Tải lại toàn bộ dữ liệu
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Quản lý đặt vé
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
        <TextField
          label="Tìm kiếm"
          placeholder="Tên phim, phòng, khách hàng, mã vé..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          size="small"
          sx={{ flexGrow: 1, maxWidth: { sm: 400 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {searchText && (
                  <IconButton
                    aria-label="clear search"
                    onClick={() => setSearchText('')}
                    size="small"
                  >
                    X
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />

        {/* <-- THÊM SELECT LỌC THEO TRẠNG THÁI Ở ĐÂY --> */}
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel id="booking-status-label">Trạng thái</InputLabel>
          <Select
            labelId="booking-status-label"
            id="booking-status-select"
            value={selectedStatus}
            label="Trạng thái"
            onChange={handleStatusChange}
          >
            <MenuItem value="">
              <em>Tất cả</em>
            </MenuItem>
            <MenuItem value={2}>Đã thanh toán</MenuItem>
            <MenuItem value={3}>Đã xem</MenuItem>
           
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleSearch}
          startIcon={<SearchIcon />}
          sx={{ height: '40px' }}
        >
          Tìm kiếm
        </Button>
        <Button
          variant="outlined"
          onClick={handleRefresh}
          startIcon={<RefreshIcon />}
          sx={{ height: '40px' }}
        >
          Làm mới
        </Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, py: 5 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>Đang tải dữ liệu...</Typography>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 1000 }}>
            <TableHead>
  <TableRow sx={{ backgroundColor: 'dark' }}> {/* Chỉ cần đặt màu nền ở đây */}
    <TableCell sx={{ fontWeight: 'bold', color: 'common.dark' }}>Mã đặt vé</TableCell>
    <TableCell sx={{ fontWeight: 'bold', color: 'common.dark' }}>Khách hàng</TableCell>
    <TableCell sx={{ fontWeight: 'bold', color: 'common.dark' }}>Tên phim</TableCell>
    <TableCell sx={{ fontWeight: 'bold', color: 'common.dark' }}>Phòng</TableCell>
    <TableCell sx={{ fontWeight: 'bold', color: 'common.dark' }}>Thời gian chiếu</TableCell>
    <TableCell sx={{ fontWeight: 'bold', color: 'common.dark' }}>Ghế</TableCell>
    <TableCell sx={{ fontWeight: 'bold', color: 'common.dark' }} align="right">Tổng tiền</TableCell>
    <TableCell sx={{ fontWeight: 'bold', color: 'common.dark' }} align="center">Trạng thái</TableCell>
    <TableCell sx={{ fontWeight: 'bold', color: 'common.dark' }} align="center">Thao tác</TableCell>
  </TableRow>
</TableHead>
              <TableBody>
                {data.length > 0 ? (
                  data.map((booking) => {
                    const statusProps = getStatusChipProps(booking.bookingStatus);
                    return (
                      <TableRow
                        key={booking.bookingId}
                        sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' }, '&:hover': { backgroundColor: 'action.selected' } }}
                      >
                        <TableCell>{booking?.bookingCode || 'N/A'}</TableCell>
                        <TableCell>{booking.userName}</TableCell>
                        <TableCell>{booking.movieName}</TableCell>
                        <TableCell>{booking.roomName}</TableCell>
                        <TableCell>{booking?.startTime || 'N/A'}</TableCell>
                        <TableCell>{booking.nameSeats?.join(', ') || 'N/A'}</TableCell>
                        <TableCell align="right">
                          {booking.totalPrice !== null && booking.totalPrice !== undefined ? `${booking.totalPrice.toLocaleString('vi-VN')} VND` : 'N/A'}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={statusProps.label}
                            color={statusProps.color}
                            variant={statusProps.variant}
                            size="small"
                            sx={{ minWidth: 90 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <IconButton
                              aria-label="view detail"
                              color="info"
                              onClick={() => handleViewDetail(booking)}
                              size="small"
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            {/* <IconButton
                              aria-label="delete"
                              color="error"
                              onClick={() => handleOpenConfirmDelete(booking.bookingId)}
                              size="small"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton> */}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Typography variant="h6" color="text.secondary">
                        <EventSeatIcon sx={{ fontSize: 40, mb: 1, color: 'text.disabled' }} />
                        <br />
                        Không có dữ liệu đặt vé nào
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalElements}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
            }
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

      {/* Detail Dialog */}
      <Dialog open={openDetailDialog} onClose={handleCloseDetailDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'common.white', pb: 1.5 }}>Chi tiết đặt vé</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          {selectedBooking && (
            <Stack spacing={1.5}>
              <Typography variant="body1"><strong>Mã vé:</strong> {selectedBooking.bookingCode || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Khách hàng:</strong> {selectedBooking.userName || 'N/A'} ({selectedBooking.userEmail || 'N/A'})</Typography>
              <Typography variant="body1"><strong>Mã khách hàng:</strong> {selectedBooking.userCode || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Phim:</strong> {selectedBooking.movieName || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Phòng:</strong> {selectedBooking.roomName || 'N/A'}</Typography>
              <Typography variant="body1">
                <strong>Thời gian chiếu:</strong> {selectedBooking.startTime || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Ghế:</strong> {selectedBooking.nameSeats?.join(', ') || 'N/A'}
              </Typography>
              <Typography variant="body1"><strong>Số lượng ghế thường:</strong> {selectedBooking.quantityNormalSeat}</Typography>
              <Typography variant="body1"><strong>Tiền ghế thường:</strong> {selectedBooking.totalPriceNormalSeat?.toLocaleString('vi-VN') || '0'} VND</Typography>
              <Typography variant="body1"><strong>Số lượng ghế đôi:</strong> {selectedBooking.quantityCoupleSeat}</Typography>
              <Typography variant="body1"><strong>Tiền ghế đôi:</strong> {selectedBooking.totalPriceCoupleSeat?.toLocaleString('vi-VN') || '0'} VND</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                <strong>Tổng tiền ban đầu:</strong> {selectedBooking.originalAmount?.toLocaleString('vi-VN') || '0'} VND
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                <strong>Số tiền giảm giá:</strong> {selectedBooking.discountAmount?.toLocaleString('vi-VN') || '0'} VND
              </Typography>
              {selectedBooking.promotionCode && (
                <Typography variant="body1"><strong>Mã khuyến mãi:</strong> {selectedBooking.promotionCode}</Typography>
              )}
              {selectedBooking.promotionName && (
                <Typography variant="body1"><strong>Tên khuyến mãi:</strong> {selectedBooking.promotionName}</Typography>
              )}
              <Typography variant="h6" sx={{ mt: 2, color: 'primary.dark', display: 'flex', alignItems: 'center' }}>
                <MonetizationOnIcon sx={{ mr: 1 }} />
                Tổng tiền cuối cùng: {selectedBooking.totalPrice?.toLocaleString('vi-VN') || '0'} VND
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog} variant="contained" color="primary">Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}