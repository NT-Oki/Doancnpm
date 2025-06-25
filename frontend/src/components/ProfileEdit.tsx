import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Paper, MenuItem } from '@mui/material';
import { toast } from 'react-toastify';


export default function ProfileEdit() {
  const [profile, setProfile] = useState({
    name: '',
    phoneNumber: '',
    gender: true,
    address: '',
    avatar: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    // Gọi API lấy thông tin user hiện tại (nếu có endpoint)
    // axios.get('/profile', { headers: { Authorization: `Bearer ${token}` } })
    //   .then(res => setProfile(res.data));
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, gender: e.target.value === 'true' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(
        '/profile',
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Cập nhật thông tin thành công');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Cập nhật thất bại');
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 6 }}>
      <Typography variant="h6" gutterBottom>Cập nhật thông tin cá nhân</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Họ tên"
          name="name"
          fullWidth
          margin="normal"
          value={profile.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Số điện thoại"
          name="phoneNumber"
          fullWidth
          margin="normal"
          value={profile.phoneNumber}
          onChange={handleChange}
        />
        <TextField
          select
          label="Giới tính"
          name="gender"
          fullWidth
          margin="normal"
          value={profile.gender ? 'true' : 'false'}
          onChange={handleGenderChange}
        >
          <MenuItem value="true">Nam</MenuItem>
          <MenuItem value="false">Nữ</MenuItem>
        </TextField>
        <TextField
          label="Địa chỉ"
          name="address"
          fullWidth
          margin="normal"
          value={profile.address}
          onChange={handleChange}
        />
        <TextField
          label="Avatar (URL)"
          name="avatar"
          fullWidth
          margin="normal"
          value={profile.avatar}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Cập nhật
        </Button>
      </form>
    </Paper>
  );
}