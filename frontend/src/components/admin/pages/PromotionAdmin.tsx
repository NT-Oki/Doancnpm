import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
  Tooltip,
  TablePagination,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Restore,
  LocalOffer,
  DateRange,
  Percent,
  AttachMoney,
} from '@mui/icons-material';
import API_URLS, { apiRequest } from '../../../config/api';

interface Promotion {
  id: number;
  code: string;
  name: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PromotionFormData {
  code: string;
  name: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  usageLimit: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const PromotionAdmin: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [formData, setFormData] = useState<PromotionFormData>({
    code: '',
    name: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    usageLimit: 1,
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    isActive: true,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPromotions();
  }, [showDeleted, page, rowsPerPage]);

// ...existing code...
const fetchPromotions = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    // SỬA: Đảm bảo parameter được gửi chính xác
    const params = new URLSearchParams({
      page: page.toString(),
      size: rowsPerPage.toString(),
      includeDeleted: showDeleted.toString(), // Gửi boolean dưới dạng string
      sortBy: 'createdAt',
      sortDir: 'desc'
    });
    
    const url = `${API_URLS.ADMIN.promotion.list}?${params.toString()}`;
    
    console.log('=== fetchPromotions ===');
    console.log('URL:', url);
    console.log('showDeleted:', showDeleted);
    console.log('page:', page, 'rowsPerPage:', rowsPerPage);
    console.log('Token present:', !!token);
    
    const response = await apiRequest(url, { 
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Raw API Response:', response);
    console.log('Response type:', typeof response);
    
    if (response && typeof response === 'object') {
      if ('data' in response && Array.isArray(response.data)) {
        console.log('Setting promotions from response.data:', response.data.length);
        console.log('Backend includeDeleted:', response.includeDeleted);
        console.log('Total elements:', response.totalElements);
        
        // Log chi tiết promotions để debug
        response.data.forEach((promo: any, index: number) => {
          console.log(`Promotion ${index + 1}:`, {
            code: promo.code,
            name: promo.name,
            isDeleted: promo.isDeleted,
            isActive: promo.isActive,
            createdAt: promo.createdAt
          });
        });
        
        setPromotions(response.data);
        setTotalElements(response.totalElements || response.data.length);
      } else if (Array.isArray(response)) {
        console.log('Setting promotions from direct array:', response.length);
        setPromotions(response);
        setTotalElements(response.length);
      } else {
        console.warn('Unexpected response structure:', response);
        setPromotions([]);
        setTotalElements(0);
      }
    } else {
      console.error('Invalid response:', response);
      setPromotions([]);
      setTotalElements(0);
    }
  } catch (error) {
    console.error('Error fetching promotions:', error);
    console.error('Error type:', typeof error);
    console.error('Error details:', error);
    
    // Xử lý error message an toàn
    let errorMessage = 'Có lỗi xảy ra khi tải danh sách khuyến mãi';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      if ('message' in error && typeof error.message === 'string') {
        errorMessage = error.message;
      } else if ('error' in error && typeof error.error === 'string') {
        errorMessage = error.error;
      } else {
        errorMessage = JSON.stringify(error);
      }
    }
    
    showSnackbar(`Lỗi khi tải danh sách khuyến mãi: ${errorMessage}`, 'error');
    setPromotions([]);
    setTotalElements(0);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  console.log('useEffect triggered - showDeleted changed to:', showDeleted);
  
  // Reset page về 0 khi thay đổi filter
  setPage(0);
  
  // Reset dữ liệu trước khi fetch
  setPromotions([]);
  setTotalElements(0);
  
  fetchPromotions();
}, [showDeleted, rowsPerPage]);

// useEffect riêng cho page change
useEffect(() => {
  if (page !== 0) { // Chỉ fetch khi page > 0 (để tránh duplicate fetch khi reset page)
    fetchPromotions();
  }
}, [page]);

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.code.trim()) {
      errors.code = 'Mã khuyến mãi không được để trống';
    } else if (formData.code.length < 3) {
      errors.code = 'Mã khuyến mãi phải có ít nhất 3 ký tự';
    }

    if (!formData.name.trim()) {
      errors.name = 'Tên khuyến mãi không được để trống';
    }

    if (formData.discountValue <= 0) {
      errors.discountValue = 'Giá trị giảm giá phải lớn hơn 0';
    }

    if (formData.discountType === 'PERCENTAGE' && formData.discountValue > 100) {
      errors.discountValue = 'Phần trăm giảm giá không được vượt quá 100%';
    }

    if (formData.minOrderAmount < 0) {
      errors.minOrderAmount = 'Giá trị đơn hàng tối thiểu không được âm';
    }

    if (formData.usageLimit <= 0) {
      errors.usageLimit = 'Số lần sử dụng phải lớn hơn 0';
    }

    if (formData.startDate >= formData.endDate) {
      errors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const url = editingPromotion
        ? API_URLS.ADMIN.promotion.update(editingPromotion.id)
        : API_URLS.ADMIN.promotion.add;

      const method = editingPromotion ? 'PUT' : 'POST';

      const requestData = {
        ...formData,
        code: formData.code.toUpperCase(),
        startDate: formData.startDate,
        endDate: formData.endDate,
      };

      await apiRequest(url, {
        method,
        body: JSON.stringify(requestData),
      });

      showSnackbar(
        editingPromotion ? 'Cập nhật khuyến mãi thành công' : 'Thêm khuyến mãi thành công',
        'success'
      );
      handleCloseDialog();
      fetchPromotions();
    } catch (error: any) {
      console.error('Error saving promotion:', error);
      showSnackbar(error.message || 'Có lỗi xảy ra khi lưu khuyến mãi', 'error');
    }
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      code: promotion.code,
      name: promotion.name,
      description: promotion.description,
      discountType: promotion.discountType,
      discountValue: promotion.discountValue,
      minOrderAmount: promotion.minOrderAmount,
      maxDiscountAmount: promotion.maxDiscountAmount || 0,
      usageLimit: promotion.usageLimit,
      startDate: new Date(promotion.startDate).toISOString().slice(0, 16),
      endDate: new Date(promotion.endDate).toISOString().slice(0, 16),
      isActive: promotion.isActive,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khuyến mãi này?')) {
      return;
    }

    try {
      await apiRequest(API_URLS.ADMIN.promotion.delete(id), {
        method: 'DELETE',
      });
      showSnackbar('Xóa khuyến mãi thành công', 'success');
      fetchPromotions();
    } catch (error: any) {
      console.error('Error deleting promotion:', error);
      showSnackbar(error.message || 'Có lỗi xảy ra khi xóa khuyến mãi', 'error');
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await apiRequest(API_URLS.ADMIN.promotion.restore(id), {
        method: 'PUT',
      });
      showSnackbar('Khôi phục khuyến mãi thành công', 'success');
      fetchPromotions();
    } catch (error: any) {
      console.error('Error restoring promotion:', error);
      showSnackbar(error.message || 'Có lỗi xảy ra khi khôi phục khuyến mãi', 'error');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPromotion(null);
    setFormData({
      code: '',
      name: '',
      description: '',
      discountType: 'PERCENTAGE',
      discountValue: 0,
      minOrderAmount: 0,
      maxDiscountAmount: 0,
      usageLimit: 1,
      startDate: new Date().toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      isActive: true,
    });
    setFormErrors({});
  };

  const getStatusChip = (promotion: Promotion) => {
    if (promotion.isDeleted) {
      return <Chip label="Đã xóa" color="default" size="small" />;
    }

    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);

    if (!promotion.isActive) {
      return <Chip label="Tạm dừng" color="warning" size="small" />;
    }

    if (now < startDate) {
      return <Chip label="Chưa bắt đầu" color="info" size="small" />;
    }

    if (now > endDate) {
      return <Chip label="Đã hết hạn" color="error" size="small" />;
    }

    if (promotion.usedCount >= promotion.usageLimit) {
      return <Chip label="Đã hết lượt" color="error" size="small" />;
    }

    return <Chip label="Đang hoạt động" color="success" size="small" />;
  };

  const formatDiscountValue = (promotion: Promotion) => {
    if (promotion.discountType === 'PERCENTAGE') {
      return `${promotion.discountValue}%`;
    }
    return `${promotion.discountValue.toLocaleString('vi-VN')} vnđ`;
  };

  // Update page when filters change
  useEffect(() => {
    setPage(0);
  }, [showDeleted]);

  return (
    <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center' }}>
            <LocalOffer sx={{ mr: 2, color: 'primary.main' }} />
            Quản lý khuyến mãi
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={showDeleted}
                  onChange={(e) => setShowDeleted(e.target.checked)}
                />
              }
              label="Hiển thị đã xóa"
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
            >
              Thêm khuyến mãi
            </Button>
          </Box>
        </Box>

        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã</TableCell>
                  <TableCell>Tên khuyến mãi</TableCell>
                  <TableCell>Giảm giá</TableCell>
                  <TableCell>Thời gian áp dụng</TableCell>
                  <TableCell>Sử dụng</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Đang tải...
                    </TableCell>
                  </TableRow>
                ) : promotions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  promotions.map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {promotion.code}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{promotion.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {promotion.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {promotion.discountType === 'PERCENTAGE' ? <Percent /> : <AttachMoney />}
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {formatDiscountValue(promotion)}
                          </Typography>
                        </Box>
                        {promotion.minOrderAmount > 0 && (
                          <Typography variant="caption" color="text.secondary">
                            Tối thiểu: {promotion.minOrderAmount.toLocaleString('vi-VN')} vnđ
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <DateRange sx={{ fontSize: 16, mr: 0.5 }} />
                          <Typography variant="caption">
                            {new Date(promotion.startDate).toLocaleDateString('vi-VN')}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          đến {new Date(promotion.endDate).toLocaleDateString('vi-VN')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {promotion.usedCount} / {promotion.usageLimit}
                        </Typography>
                      </TableCell>
                      <TableCell>{getStatusChip(promotion)}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {!promotion.isDeleted ? (
                            <>
                              <Tooltip title="Chỉnh sửa">
                                <IconButton size="small" onClick={() => handleEdit(promotion)}>
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Xóa">
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleDelete(promotion.id)}
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            </>
                          ) : (
                            <Tooltip title="Khôi phục">
                              <IconButton 
                                size="small" 
                                color="success"
                                onClick={() => handleRestore(promotion.id)}
                              >
                                <Restore />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalElements}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </Card>

        {/* Dialog thêm/sửa khuyến mãi */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingPromotion ? 'Chỉnh sửa khuyến mãi' : 'Thêm khuyến mãi mới'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
              <TextField
                label="Mã khuyến mãi"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                error={!!formErrors.code}
                helperText={formErrors.code}
                fullWidth
                required
              />
              
              <TextField
                label="Tên khuyến mãi"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={!!formErrors.name}
                helperText={formErrors.name}
                fullWidth
                required
              />
              
              <TextField
                label="Mô tả"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={2}
                fullWidth
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Loại giảm giá</InputLabel>
                  <Select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'PERCENTAGE' | 'FIXED_AMOUNT' })}
                  >
                    <MenuItem value="PERCENTAGE">Phần trăm (%)</MenuItem>
                    <MenuItem value="FIXED_AMOUNT">Số tiền cố định (vnđ)</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label={formData.discountType === 'PERCENTAGE' ? 'Phần trăm giảm (%)' : 'Số tiền giảm (vnđ)'}
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                  error={!!formErrors.discountValue}
                  helperText={formErrors.discountValue}
                  fullWidth
                  required
                />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  label="Giá trị đơn hàng tối thiểu (vnđ)"
                  type="number"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                  error={!!formErrors.minOrderAmount}
                  helperText={formErrors.minOrderAmount}
                  fullWidth
                />

                <TextField
                  label="Số lần sử dụng tối đa"
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                  error={!!formErrors.usageLimit}
                  helperText={formErrors.usageLimit}
                  fullWidth
                  required
                />
              </Box>

              {formData.discountType === 'PERCENTAGE' && (
                <TextField
                  label="Số tiền giảm tối đa (vnđ)"
                  type="number"
                  value={formData.maxDiscountAmount}
                  onChange={(e) => setFormData({ ...formData, maxDiscountAmount: Number(e.target.value) })}
                  fullWidth
                  helperText="Để trống hoặc 0 nếu không giới hạn"
                />
              )}

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  label="Ngày bắt đầu"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  fullWidth
                  required
                  error={!!formErrors.startDate}
                  helperText={formErrors.startDate}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  label="Ngày kết thúc"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  fullWidth
                  required
                  error={!!formErrors.endDate}
                  helperText={formErrors.endDate}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label="Kích hoạt khuyến mãi"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button variant="contained" onClick={handleSubmit}>
              {editingPromotion ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar thông báo */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  };

export default PromotionAdmin;
