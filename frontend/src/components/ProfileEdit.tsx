import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, MenuItem } from '@mui/material';
import { toast } from 'react-toastify';
import API_URLS, { apiRequest } from '../config/api';


export default function ProfileEdit() {
  const [profile, setProfile] = useState({
    name: '',
    phoneNumber: '',
    gender: true,
    address: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    // Gọi API lấy thông tin user hiện tại
    const fetchProfile = async () => {
      try {
        const response = await apiRequest(API_URLS.USER.getProfile, {
          method: 'GET'
        });
        setProfile({
          name: response.name || '',
          phoneNumber: response.phoneNumber || '',
          gender: response.gender !== undefined ? response.gender : true,
          address: response.address || '',
          avatar: response.avatar || ''
        });
      } catch (error) {
        console.error('Lỗi khi tải thông tin profile:', error);
        toast.error('Không thể tải thông tin cá nhân');
      }
    };
    
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, gender: e.target.value === 'true' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    try {
      await apiRequest(API_URLS.USER.updateProfile, {
        method: 'PUT',
        body: JSON.stringify(profile)
      });
      toast.success('Cập nhật thông tin thành công');
    } catch (err: any) {
      toast.error(err.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
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
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
          {loading ? 'Đang cập nhật...' : 'Cập nhật'}
        </Button>
      </form>
    </Paper>
  );
}