// ProfilePage.js
import React, { useContext } from 'react';
import { Avatar, Button, Typography, Menu, MenuItem, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../store/AuthContext';
import { maleAvatar, femaleAvatar } from '../iconsImports';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
const ProfilePage = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authCtx.logout();
    handleClose();
    navigate('/');
  };

  const handleManageProfile = () => {
    const rolePaths = {
      Admin: '/admin/my-profile',
      Asm: '/asm/my-profile',
      Zsm: '/zsm/my-profile',
      Ad: '/ad/my-profile',
      Md: '/md/my-profile',
      Ret: '/customer/my-profile',
      Dd: '/customer/my-profile',
      Api: '/api-user/my-profile',
    };
    navigate(rolePaths[user.role] || '/other/my-profile');
    handleClose();
  };

  return (
    <Box sx={{ textAlign: 'center', padding: '2rem' }}>
      <Avatar
        alt={user?.name}
        src={user?.gender === 'FEMALE' ? femaleAvatar : maleAvatar}
        sx={{ width: 80, height: 80, marginBottom: '1rem' }}
      />
      <Typography variant="h6">{user?.name}</Typography>
      <Button onClick={handleMenu} sx={{ marginTop: '1rem' }}>
<SettingsIcon/>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleManageProfile}>Manage Your Profile</MenuItem>
        <MenuItem onClick={handleLogout}>
          Logout <LogoutIcon sx={{ marginLeft: '0.5rem' }} />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ProfilePage;
