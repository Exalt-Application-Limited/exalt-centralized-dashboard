import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  Domain as DomainIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  ExpandLess,
  ExpandMore,
  Store as StoreIcon,
  LocalShipping as ShippingIcon,
  Warehouse as WarehouseIcon,
  LocalTaxi as TaxiIcon,
  Cloud as CloudIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

const DRAWER_WIDTH = 280;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [domainsOpen, setDomainsOpen] = useState(true);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    await logout();
    navigate('/auth/login');
  };

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <DashboardIcon />,
      color: theme.palette.primary.main,
    },
    {
      label: 'Domain Management',
      icon: <DomainIcon />,
      children: [
        {
          label: 'Overview',
          path: '/domains',
          icon: <DomainIcon />,
        },
        {
          label: 'Social Commerce',
          path: '/domains/social-commerce',
          icon: <StoreIcon />,
          color: theme.customColors.socialCommerce,
        },
        {
          label: 'Warehousing',
          path: '/domains/warehousing',
          icon: <WarehouseIcon />,
          color: theme.customColors.warehousing,
        },
        {
          label: 'Courier Services',
          path: '/domains/courier-services',
          icon: <ShippingIcon />,
          color: theme.customColors.courier,
        },
        {
          label: 'Haulage Logistics',
          path: '/domains/haulage-logistics',
          icon: <TaxiIcon />,
          color: theme.customColors.haulage,
        },
        {
          label: 'Infrastructure',
          path: '/domains/shared-infrastructure',
          icon: <CloudIcon />,
          color: theme.customColors.infrastructure,
        },
      ],
    },
    {
      label: 'Stakeholders',
      path: '/stakeholders',
      icon: <PeopleIcon />,
      color: theme.palette.secondary.main,
    },
    {
      label: 'Analytics',
      path: '/analytics',
      icon: <AnalyticsIcon />,
      color: theme.palette.info.main,
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: <SettingsIcon />,
      color: theme.palette.text.secondary,
    },
  ];

  const renderNavigationItem = (item: any, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = item.path ? isActivePath(item.path) : false;
    const isParentActive = hasChildren && item.children.some((child: any) => isActivePath(child.path));

    if (hasChildren) {
      return (
        <React.Fragment key={item.label}>
          <ListItem
            button
            onClick={() => item.label === 'Domain Management' && setDomainsOpen(!domainsOpen)}
            sx={{
              pl: 2 + level * 2,
              backgroundColor: isParentActive ? `${theme.palette.primary.main}10` : 'transparent',
              '&:hover': {
                backgroundColor: `${theme.palette.primary.main}15`,
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isParentActive ? theme.palette.primary.main : 'text.secondary',
                minWidth: 40,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: isParentActive ? 600 : 500,
                color: isParentActive ? 'primary.main' : 'text.primary',
              }}
            />
            {item.label === 'Domain Management' && (domainsOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItem>
          {item.label === 'Domain Management' && (
            <Collapse in={domainsOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children.map((child: any) => renderNavigationItem(child, level + 1))}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    }

    return (
      <ListItem
        key={item.label}
        button
        onClick={() => navigate(item.path)}
        sx={{
          pl: 2 + level * 2,
          backgroundColor: isActive ? `${item.color || theme.palette.primary.main}15` : 'transparent',
          borderRight: isActive ? `3px solid ${item.color || theme.palette.primary.main}` : 'none',
          '&:hover': {
            backgroundColor: `${item.color || theme.palette.primary.main}10`,
          },
        }}
      >
        <ListItemIcon
          sx={{
            color: isActive ? (item.color || theme.palette.primary.main) : 'text.secondary',
            minWidth: 40,
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{
            fontWeight: isActive ? 600 : 500,
            color: isActive ? (item.color || 'primary.main') : 'text.primary',
          }}
        />
      </ListItem>
    );
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo/Brand */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={700} color="primary.main">
          Exalt Command Center
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Executive Dashboard
        </Typography>
      </Box>

      <Divider />

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List>
          {navigationItems.map((item) => renderNavigationItem(item))}
        </List>
      </Box>

      {/* User Info */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: 'primary.main',
              fontSize: '0.875rem',
            }}
          >
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={500} noWrap>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.accessLevel?.replace('_', ' ')}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { lg: `${DRAWER_WIDTH}px` },
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { lg: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {/* Dynamic page title based on current route */}
            {location.pathname === '/dashboard' && 'Executive Dashboard'}
            {location.pathname.startsWith('/domains/social-commerce') && 'Social Commerce Domain'}
        {location.pathname.startsWith('/domains/shared-infrastructure') && 'Shared Infrastructure Domain'}
        {location.pathname.startsWith('/domains/warehousing') && 'Warehousing Domain'}
        {location.pathname.startsWith('/domains/courier-services') && 'Courier Services Domain'}
        {location.pathname.startsWith('/domains/haulage-logistics') && 'Haulage Logistics Domain'}
        {location.pathname.startsWith('/domains') && !location.pathname.includes('/domains/') && 'Domain Management'}
            {location.pathname === '/stakeholders' && 'Stakeholder Management'}
            {location.pathname === '/analytics' && 'Global Analytics'}
            {location.pathname === '/settings' && 'System Settings'}
          </Typography>

          {/* Notifications */}
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile Menu */}
          <IconButton
            color="inherit"
            onClick={handleProfileMenuOpen}
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
          >
            <AccountIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>
          <ListItemIcon>
            <AccountIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/settings'); }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { lg: DRAWER_WIDTH }, flexShrink: { lg: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', lg: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          overflow: 'auto',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;