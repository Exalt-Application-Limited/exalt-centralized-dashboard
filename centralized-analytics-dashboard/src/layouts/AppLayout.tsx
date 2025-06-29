import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Chip,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
  People as PeopleIcon,
  ShoppingCart as OrdersIcon,
  Timeline as RealTimeIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useRealTime } from '../services/RealTimeContext';

const drawerWidth = 280;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isConnected, messageCount } = useRealTime();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigationItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      description: 'Main overview',
    },
    {
      text: 'Real-Time Dashboard',
      icon: <RealTimeIcon />,
      path: '/dashboard/realtime',
      description: 'Live data updates',
      badge: isConnected ? messageCount : 0,
    },
    { type: 'divider' },
    {
      text: 'Analytics',
      icon: <AnalyticsIcon />,
      description: 'Data insights',
      header: true,
    },
    {
      text: 'Inventory Analytics',
      icon: <InventoryIcon />,
      path: '/analytics/inventory',
      description: 'Stock & warehouse data',
    },
    {
      text: 'Order Analytics',
      icon: <OrdersIcon />,
      path: '/analytics/orders',
      description: 'Sales & order trends',
    },
    {
      text: 'Shipping Analytics',
      icon: <ShippingIcon />,
      path: '/analytics/shipping',
      description: 'Delivery performance',
    },
    {
      text: 'User Analytics',
      icon: <PeopleIcon />,
      path: '/analytics/users',
      description: 'Customer insights',
    },
  ];

  const drawer = (
    <Box>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <DashboardIcon color="primary" />
          <Box>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
              Analytics Hub
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Centralized Dashboard
            </Typography>
          </Box>
        </Box>
      </Toolbar>
      <Divider />
      
      {/* Connection Status */}
      <Box sx={{ p: 2, bgcolor: 'background.default' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: isConnected ? 'success.main' : 'error.main',
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {isConnected ? 'Connected' : 'Disconnected'}
          </Typography>
          {isConnected && messageCount > 0 && (
            <Chip label={`${messageCount} msgs`} size="small" variant="outlined" />
          )}
        </Box>
        <Typography variant="caption" color="text.secondary">
          Real-time data streaming {isConnected ? 'active' : 'inactive'}
        </Typography>
      </Box>
      
      <Divider />
      
      <List>
        {navigationItems.map((item, index) => {
          if (item.type === 'divider') {
            return <Divider key={index} sx={{ my: 1 }} />;
          }

          if (item.header) {
            return (
              <ListItem key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
                  {item.icon}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {item.text}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
            );
          }

          const isSelected = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={isSelected}
                onClick={() => {
                  navigate(item.path!);
                  if (isMobile) {
                    setMobileOpen(false);
                  }
                }}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon>
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  secondary={item.description}
                  secondaryTypographyProps={{
                    variant: 'caption',
                    color: isSelected ? 'inherit' : 'text.secondary',
                    sx: { opacity: isSelected ? 0.8 : 1 }
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {navigationItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Connection indicator */}
            <Chip
              label={isConnected ? 'Live' : 'Offline'}
              color={isConnected ? 'success' : 'error'}
              size="small"
              variant="outlined"
              sx={{ color: 'white', borderColor: 'white' }}
            />
            
            <IconButton color="inherit">
              <Badge badgeContent={isConnected ? messageCount : 0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <IconButton color="inherit">
              <SettingsIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="navigation"
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
