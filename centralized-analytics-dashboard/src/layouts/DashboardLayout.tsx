import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Badge,
  InputBase,
  alpha,
  Collapse
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  AccountCircle,
  ExpandLess,
  ExpandMore,
  Description as ReportIcon,
  Category as ProductIcon,
  ShoppingCart as OrderIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// Drawer width
const drawerWidth = 280;

// Navigation items structure
const mainNavItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { 
    text: 'Analytics', 
    icon: <AssessmentIcon />, 
    children: [
      { text: 'Orders', icon: <OrderIcon />, path: '/dashboard/analytics/orders' },
      { text: 'Inventory', icon: <InventoryIcon />, path: '/dashboard/analytics/inventory' },
      { text: 'Shipping', icon: <ShippingIcon />, path: '/dashboard/analytics/shipping' },
      { text: 'Users', icon: <PeopleIcon />, path: '/dashboard/analytics/users' },
      { text: 'Products', icon: <ProductIcon />, path: '/dashboard/analytics/products' }
    ]
  },
  { 
    text: 'Reports', 
    icon: <ReportIcon />, 
    children: [
      { text: 'View Reports', icon: <BarChartIcon />, path: '/dashboard/reports' },
      { text: 'Generate Report', icon: <ReportIcon />, path: '/dashboard/reports/generate' }
    ]
  }
];

const secondaryNavItems = [
  { 
    text: 'Settings', 
    icon: <SettingsIcon />, 
    children: [
      { text: 'General', icon: <SettingsIcon />, path: '/dashboard/settings' },
      { text: 'User Management', icon: <PeopleIcon />, path: '/dashboard/settings/users' },
      { text: 'Role Management', icon: <PeopleIcon />, path: '/dashboard/settings/roles' }
    ]
  }
];

const DashboardLayout: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // State
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationMenuAnchor, setNotificationMenuAnchor] = useState<null | HTMLElement>(null);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  
  // Handlers
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };
  
  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationMenuAnchor(event.currentTarget);
  };
  
  const handleNotificationMenuClose = () => {
    setNotificationMenuAnchor(null);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleMenuExpand = (menuText: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuText]: !prev[menuText]
    }));
  };
  
  const handleNavigation = (path: string) => {
    navigate(path);
    if (isSmallScreen) {
      setMobileOpen(false);
    }
  };

  // Render nested menu items
  const renderMenuItems = (items: any[]) => {
    return items.map((item) => (
      <React.Fragment key={item.text}>
        {item.children ? (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleMenuExpand(item.text)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {expandedMenus[item.text] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={expandedMenus[item.text]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children.map((child: any) => (
                  <ListItem key={child.text} disablePadding>
                    <ListItemButton 
                      sx={{ pl: 4 }}
                      onClick={() => handleNavigation(child.path)}
                    >
                      <ListItemIcon>{child.icon}</ListItemIcon>
                      <ListItemText primary={child.text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </>
        ) : (
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        )}
      </React.Fragment>
    ));
  };
  
  const drawer = (
    <div>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: [1],
        }}
      >
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          Analytics Dashboard
        </Typography>
      </Toolbar>
      <Divider />
      <List>{renderMenuItems(mainNavItems)}</List>
      <Divider />
      <List>{renderMenuItems(secondaryNavItems)}</List>
    </div>
  );
  
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Search box */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: theme.shape.borderRadius,
              backgroundColor: alpha(theme.palette.common.white, 0.15),
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.25),
              },
              marginRight: theme.spacing(2),
              marginLeft: 0,
              width: '100%',
              [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(3),
                width: 'auto',
              },
            }}
          >
            <Box
              sx={{
                padding: theme.spacing(0, 2),
                height: '100%',
                position: 'absolute',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SearchIcon />
            </Box>
            <InputBase
              placeholder="Search…"
              sx={{
                color: 'inherit',
                '& .MuiInputBase-input': {
                  padding: theme.spacing(1, 1, 1, 0),
                  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                  transition: theme.transitions.create('width'),
                  width: '100%',
                  [theme.breakpoints.up('md')]: {
                    width: '20ch',
                  },
                },
              }}
            />
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Notifications */}
          <IconButton
            size="large"
            aria-label="show new notifications"
            color="inherit"
            onClick={handleNotificationMenuOpen}
          >
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          {/* User profile */}
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleUserMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </Avatar>
          </IconButton>
          
          {/* User menu */}
          <Menu
            anchorEl={userMenuAnchor}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
          >
            <MenuItem onClick={handleUserMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleUserMenuClose}>My account</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
          
          {/* Notifications menu */}
          <Menu
            anchorEl={notificationMenuAnchor}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(notificationMenuAnchor)}
            onClose={handleNotificationMenuClose}
          >
            <MenuItem onClick={handleNotificationMenuClose}>
              New order received (#12345)
            </MenuItem>
            <MenuItem onClick={handleNotificationMenuClose}>
              Inventory alert: Low stock (SKU-789)
            </MenuItem>
            <MenuItem onClick={handleNotificationMenuClose}>
              System update scheduled for maintenance
            </MenuItem>
            <MenuItem onClick={handleNotificationMenuClose}>
              5 users registered today
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
