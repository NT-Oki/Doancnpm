import React, { useState, useRef, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Typography, 
  Box,
  CircularProgress,
  IconButton
} from '@mui/material';
import { Close as CloseIcon, CheckCircle as CheckIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
import API_URLS, { apiRequest } from '../config/api';

interface ChangePasswordProps {
  open: boolean;
  onClose: () => void;
}

export default function ChangePassword({ open, onClose }: ChangePasswordProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyingOldPassword, setVerifyingOldPassword] = useState(false);
  const [oldPasswordVerified, setOldPasswordVerified] = useState(false);
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const debounceTimer = useRef<number | null>(null);

  // Verify old password in real-time với tên function khác
  const verifyOldPasswordAsync = async (password: string) => {
    if (password.length < 3) { // Chỉ verify khi nhập ít nhất 3 ký tự
      setOldPasswordVerified(false);
      setOldPasswordError('');
      return;
    }

    setVerifyingOldPassword(true);
    setOldPasswordError('');
    
    try {
      // Gọi API verify password
      await apiRequest(API_URLS.USER.verifyPassword, {
        method: 'POST',
        body: JSON.stringify({ password }),
      });
      setOldPasswordVerified(true);
      setOldPasswordError('');
    } catch (err: any) {
      console.error('Password verification error:', err);
      
      // CHỈ skip verification nếu endpoint thực sự không tồn tại (404)
      if (err.message?.includes('404') || err.message?.includes('Not Found')) {
        console.warn('Verify password endpoint not available, skipping verification');
        setOldPasswordVerified(true);
        setOldPasswordError('');
      } else {
        // Tất cả các lỗi khác (bao gồm mật khẩu sai, lỗi authorization, etc.) đều hiển thị lỗi
        setOldPasswordVerified(false);
        setOldPasswordError(err.message || 'Mật khẩu cũ không đúng');
      }
    } finally {
      setVerifyingOldPassword(false);
    }
  };

  const handleOldPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOldPassword(value);
    setOldPasswordVerified(false);
    setOldPasswordError('');
    
    // Reset new password fields khi old password thay đổi
    setNewPassword('');
    setConfirmPassword('');
    
    // Clear previous timer
    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
    }
    
    // Debounce verification
    if (value.length > 0) {
      debounceTimer.current = window.setTimeout(() => {
        verifyOldPasswordAsync(value);
      }, 800);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;
    
    // Đảm bảo mật khẩu cũ đã được verify
    if (!oldPasswordVerified || !!oldPasswordError) {
      toast.error('Vui lòng nhập mật khẩu cũ đúng');
      return;
    }
    
    // Validate trước khi gửi
    if (newPassword.length < 8) {
      toast.error('Mật khẩu mới phải có ít nhất 8 ký tự');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    
    setLoading(true);
    try {
      await apiRequest(API_URLS.USER.changePassword, {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
      });
      toast.success('Đổi mật khẩu thành công');
      handleClose();
    } catch (err: any) {
      toast.error(err.message ?? 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Clear timer khi đóng
    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
    }
    
    // Reset form khi đóng
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setOldPasswordVerified(false);
    setOldPasswordError('');
    setLoading(false);
    setVerifyingOldPassword(false);
    
    // Reset show password states
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    
    onClose();
  };

  // Cleanup timer when component unmounts
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        window.clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Đổi mật khẩu</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mt: 1 }}>
            <TextField
              label="Mật khẩu cũ"
              type={showOldPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={oldPassword}
              onChange={handleOldPasswordChange}
              error={!!oldPasswordError}
              helperText={oldPasswordError}
              required
              InputProps={{
                endAdornment: (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      edge="end"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      {showOldPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    {verifyingOldPassword ? (
                      <CircularProgress size={20} />
                    ) : oldPasswordVerified ? (
                      <CheckIcon color="success" />
                    ) : null}
                  </Box>
                ),
              }}
            />
            
            {/* Chỉ hiển thị thông báo và các field mật khẩu mới khi đã nhập mật khẩu cũ */}
            {oldPassword.trim() && oldPassword.length >= 3 && (
              <Box sx={{ mt: 2 }}>
                {oldPasswordVerified && !oldPasswordError && (
                  <Typography variant="body2" color="success.main" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <CheckIcon sx={{ mr: 1, fontSize: 16 }} />
                    Mật khẩu cũ đã được xác thực
                  </Typography>
                )}
                {oldPasswordError && (
                  <Typography variant="body2" color="error.main" sx={{ mb: 2 }}>
                    {oldPasswordError}
                  </Typography>
                )}
                {!oldPasswordVerified && !verifyingOldPassword && !oldPasswordError && oldPassword.length >= 3 && (
                  <Typography variant="body2" color="warning.main" sx={{ mb: 2 }}>
                    ⚠️ Không thể xác thực mật khẩu cũ trước (sẽ được kiểm tra khi đổi mật khẩu)
                  </Typography>
                )}
              </Box>
            )}
            
            {/* CHỈ hiển thị các field mật khẩu mới khi mật khẩu cũ đã được XÁC THỰC ĐÚNG */}
            {oldPasswordVerified && !oldPasswordError && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  label="Mật khẩu mới"
                  type={showNewPassword ? 'text' : 'password'}
                  fullWidth
                  margin="normal"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  helperText="Mật khẩu phải có ít nhất 8 ký tự"
                  required
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                        size="small"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
                <TextField
                  label="Xác nhận mật khẩu mới"
                  type={showConfirmPassword ? 'text' : 'password'}
                  fullWidth
                  margin="normal"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={confirmPassword !== '' && newPassword !== confirmPassword}
                  helperText={confirmPassword !== '' && newPassword !== confirmPassword ? 'Mật khẩu không khớp' : ''}
                  required
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        size="small"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
              </Box>
            )}
          </Box>
        </form>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={
            loading || 
            !oldPasswordVerified || 
            !!oldPasswordError ||
            !newPassword || 
            newPassword.length < 8 ||
            newPassword !== confirmPassword
          }
          onClick={handleSubmit}
        >
          {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}