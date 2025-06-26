import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Search, AccountCircle } from '@mui/icons-material'; // Loại bỏ Language vì không cần
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import logo from '../assets/images/logo.png';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    console.log('Tìm kiếm:', searchQuery);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleLanguage = (event: React.MouseEvent<HTMLElement>, newLanguage: string | null) => {
    if (newLanguage && ['vi', 'en'].includes(newLanguage)) {
      i18n.changeLanguage(newLanguage);
    }
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#111', width: '100%', top: 0 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Link
            to="/"
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
          >
            <img src={logo} alt="CGV Logo" style={{ height: '50px', marginRight: '10px' }} />
            {t('app.name')} {/* "Cinema" hoặc "Rạp phim" */}
          </Link>
        </Typography>

        <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#f1e4ff',
              borderRadius: '20px',
              p: '2px',
              mr: 2,
              height: '24px',
            }}
        >
          <Button
              onClick={() => i18n.changeLanguage('vi')}
              sx={{
                borderRadius: '20px',
                bgcolor: i18n.language === 'vi' ? '#4B0082' : 'transparent',
                color: i18n.language === 'vi' ? '#fff' : '#4B0082',
                fontWeight: 'bold',
                textTransform: 'none',
                minWidth: '30px',
                fontSize: '0.7rem',
                padding: '2px 8px',
                lineHeight: 1,
                height: '20px',
              }}
          >
            VI
          </Button>
          <Button
              onClick={() => i18n.changeLanguage('en')}
              sx={{
                borderRadius: '20px',
                bgcolor: i18n.language === 'en' ? '#4B0082' : 'transparent',
                color: i18n.language === 'en' ? '#fff' : '#4B0082',
                fontWeight: 'bold',
                textTransform: 'none',
                minWidth: '30px',
                fontSize: '0.7rem',
                padding: '2px 8px',
                lineHeight: 1,
                height: '20px',
              }}
          >
            EN
          </Button>
        </Box>


        <IconButton color="inherit" onClick={handleMenuOpen}>
          <AccountCircle />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {user ? (
            [
              <Box key="user-info" sx={{ p: 2, pb: 1.5 }}>
                <Typography variant="subtitle2" noWrap>
                  {user.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                  {user.email}
                </Typography>
              </Box>,
              <Divider key="divider1" sx={{ borderStyle: 'dashed' }} />,
              <MenuItem
                key="profile-edit"
                onClick={() => {
                  navigate('/profile/edit');
                  handleMenuClose();
                }}
              >
                {t('nav.profileEdit')} {/* "Cập nhật thông tin" hoặc "Edit Profile" */}
              </MenuItem>,
              <MenuItem
                key="change-password"
                onClick={() => {
                  navigate('/change-password');
                  handleMenuClose();
                }}
              >
                {t('nav.changePassword')} {/* "Đổi mật khẩu" hoặc "Change Password" */}
              </MenuItem>,
              <Divider key="divider2" sx={{ borderStyle: 'dashed' }} />,
              <Box key="logout" sx={{ p: 1 }}>
                <Button fullWidth color="error" size="medium" variant="text" onClick={handleLogout}>
                  {t('nav.logout')} {/* "Đăng xuất" hoặc "Logout" */}
                </Button>
              </Box>,
            ]
          ) : (
            <Box sx={{ p: 1 }}>
              <Button
                fullWidth
                color="error"
                size="medium"
                variant="text"
                component={Link}
                to="/login"
                onClick={handleMenuClose}
              >
                {t('nav.login')} {/* "Đăng nhập" hoặc "Login" */}
              </Button>
            </Box>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}