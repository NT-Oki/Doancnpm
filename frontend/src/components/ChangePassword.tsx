import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import API_URLS, { apiRequest } from '../config/api';

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;
    
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
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 6 }}>
      <Typography variant="h6" gutterBottom>Đổi mật khẩu</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Mật khẩu cũ"
          type="password"
          fullWidth
          margin="normal"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          required
        />
        <TextField
          label="Mật khẩu mới"
          type="password"
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          helperText="Mật khẩu phải có ít nhất 8 ký tự"
          required
        />
        <TextField
          label="Xác nhận mật khẩu mới"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          error={confirmPassword !== '' && newPassword !== confirmPassword}
          helperText={confirmPassword !== '' && newPassword !== confirmPassword ? 'Mật khẩu không khớp' : ''}
          required
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
        </Button>
      </form>
    </Paper>
  );
}