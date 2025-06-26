import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button, 
  TextField, 
  Typography, 
  MenuItem,
  Box,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import API_URLS, { apiRequest } from '../config/api';
import { useAuth } from '../contexts/AuthContext';

interface ProfileEditProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfileEdit({ open, onClose }: ProfileEditProps) {
  const [profile, setProfile] = useState({
    name: '',
    phoneNumber: '',
    gender: true,
    address: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { user, updateUser } = useAuth();

  const token = localStorage.getItem('token');

  useEffect(() => {
    // Load data từ user context hoặc API
    const loadProfileData = async () => {
      if (open) {
        // Kiểm tra xem user context có đầy đủ dữ liệu không
        const hasCompleteUserData = user && 
          user.name && 
          user.phoneNumber !== undefined && 
          user.address !== undefined;
        
        if (hasCompleteUserData) {
          // Ưu tiên dùng data từ context nếu đầy đủ
          setProfile({
            name: user.name || '',
            phoneNumber: user.phoneNumber || '',
            gender: user.gender !== undefined ? user.gender : true,
            address: user.address || '',
            avatar: user.avatar || ''
          });
          setHasChanges(false);
        } else if (token) {
          // Gọi API để lấy thông tin đầy đủ nếu context thiếu dữ liệu
          try {
            const response = await apiRequest(API_URLS.USER.getProfile, {
              method: 'GET'
            });
            
            const profileData = {
              name: response.name || user?.name || '',
              phoneNumber: response.phoneNumber || '',
              gender: response.gender !== undefined ? response.gender : (user?.gender !== undefined ? user.gender : true),
              address: response.address || '',
              avatar: response.avatar || user?.avatar || ''
            };
            
            setProfile(profileData);
            
            // Cập nhật user context nếu có dữ liệu mới
            if (updateUser && response) {
              updateUser({
                name: profileData.name,
                avatar: profileData.avatar,
                phoneNumber: profileData.phoneNumber,
                address: profileData.address,
                gender: profileData.gender
              });
            }
            
            setHasChanges(false);
          } catch (error) {
            console.error('Lỗi khi tải thông tin profile:', error);
            toast.error('Không thể tải thông tin cá nhân');
            
            // Fallback: sử dụng dữ liệu từ context nếu có
            if (user) {
              setProfile({
                name: user.name || '',
                phoneNumber: user.phoneNumber || '',
                gender: user.gender !== undefined ? user.gender : true,
                address: user.address || '',
                avatar: user.avatar || ''
              });
              setHasChanges(false);
            }
          }
        }
      }
    };
    
    loadProfileData();
  }, [token, open, user, updateUser]); // Thêm updateUser vào dependencies

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setHasChanges(true);
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, gender: e.target.value === 'true' });
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    // Validation
    if (!profile.name.trim()) {
      toast.error('Họ tên không được để trống');
      return;
    }
    
    if (profile.phoneNumber && !/^[0-9]{10,11}$/.test(profile.phoneNumber)) {
      toast.error('Số điện thoại không hợp lệ (10-11 chữ số)');
      return;
    }
    
    setLoading(true);
    try {
      const response = await apiRequest(API_URLS.USER.updateProfile, {
        method: 'PUT',
        body: JSON.stringify(profile)
      });
      
      // Cập nhật context user với thông tin mới ngay lập tức
      // Ưu tiên dùng dữ liệu từ response API, fallback về profile form
      const updatedData = {
        name: response?.name || profile.name,
        avatar: response?.avatar || profile.avatar,
        phoneNumber: response?.phoneNumber || profile.phoneNumber || '',
        address: response?.address || profile.address || '',
        gender: response?.gender !== undefined ? response.gender : profile.gender
      };
      
      if (updateUser) {
        console.log('Updating user context with profile data:', updatedData);
        updateUser(updatedData);
      }
      
      toast.success('Cập nhật thông tin thành công');
      setHasChanges(false); // Reset changes flag sau khi update thành công
      
      // Refresh profile data từ server để đảm bảo đồng bộ
      try {
        const refreshedProfile = await apiRequest(API_URLS.USER.getProfile, {
          method: 'GET'
        });
        
        const finalData = {
          name: refreshedProfile?.name || updatedData.name,
          avatar: refreshedProfile?.avatar || updatedData.avatar,
          phoneNumber: refreshedProfile?.phoneNumber || updatedData.phoneNumber || '',
          address: refreshedProfile?.address || updatedData.address || '',
          gender: refreshedProfile?.gender !== undefined ? refreshedProfile.gender : updatedData.gender
        };
        
        // Cập nhật lại context với data mới nhất từ server
        if (updateUser) {
          console.log('Final update to user context with refreshed data:', finalData);
          updateUser(finalData);
        }
        
        // Cập nhật form với data mới nhất
        setProfile(finalData);
      } catch (refreshError) {
        console.warn('Could not refresh profile data after update:', refreshError);
        // Không show error cho user vì update đã thành công
      }
      
      // Đóng dialog sau khi cập nhật thành công
      setTimeout(() => {
        handleClose();
      }, 500); // Delay nhỏ để user thấy toast message
      
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast.error(err.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Không reset form khi đóng để giữ lại thông tin đã nhập
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Cập nhật thông tin cá nhân</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mt: 1 }}>
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
          disabled={loading || !hasChanges}
          onClick={handleSubmit}
        >
          {loading ? 'Đang cập nhật...' : 'Cập nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}