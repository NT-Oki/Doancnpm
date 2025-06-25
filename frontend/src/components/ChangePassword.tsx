import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import API_URLS, { apiRequest } from '../config/api';

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          required
        />
        <TextField
          label="Xác nhận mật khẩu mới"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Đổi mật khẩu
        </Button>
      </form>
    </Paper>
  );
}