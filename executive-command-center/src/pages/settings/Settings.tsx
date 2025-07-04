import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Storage as StorageIcon,
  Api as ApiIcon,
  Shield as ShieldIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState({
    // General Settings
    companyName: 'Exalt Application Limited',
    timezone: 'UTC+4',
    language: 'en',
    currency: 'USD',
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    systemAlerts: true,
    performanceAlerts: true,
    securityAlerts: true,
    
    // Security
    twoFactorAuth: true,
    sessionTimeout: 30, // minutes
    passwordExpiry: 90, // days
    auditLogging: true,
    
    // System
    autoRefresh: true,
    refreshInterval: 30, // seconds
    dataRetention: 365, // days
    backupFrequency: 'daily',
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSettingChange = (setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSaveSettings = () => {
    // Implement save functionality
    console.log('Saving settings:', settings);
  };

  const integrations = [
    {
      name: 'Alibaba Cloud',
      status: 'connected',
      description: 'Primary cloud infrastructure provider',
      lastSync: '2 minutes ago',
    },
    {
      name: 'Firebase Auth',
      status: 'connected',
      description: 'Authentication and user management',
      lastSync: '5 minutes ago',
    },
    {
      name: 'Stripe Payments',
      status: 'connected',
      description: 'Payment processing integration',
      lastSync: '1 hour ago',
    },
    {
      name: 'AWS S3',
      status: 'disconnected',
      description: 'Secondary storage backup',
      lastSync: 'Never',
    },
  ];

  const systemInfo = [
    {
      component: 'Executive Dashboard',
      version: '1.0.0',
      status: 'healthy',
      uptime: '99.95%',
    },
    {
      component: 'API Gateway',
      version: '2.3.1',
      status: 'healthy',
      uptime: '99.92%',
    },
    {
      component: 'Database Cluster',
      version: 'PostgreSQL 14.5',
      status: 'healthy',
      uptime: '99.98%',
    },
    {
      component: 'Message Queue',
      version: 'Kafka 3.2.0',
      status: 'warning',
      uptime: '98.87%',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            ⚙️ System Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure executive dashboard preferences and system parameters
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
        >
          Save Changes
        </Button>
      </Box>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="General" />
            <Tab label="Notifications" />
            <Tab label="Security" />
            <Tab label="Integrations" />
            <Tab label="System" />
          </Tabs>
        </Box>

        {/* General Settings Tab */}
        <TabPanel value={activeTab} index={0}>
          <Typography variant="h6" gutterBottom>
            General Configuration
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={settings.companyName}
                onChange={(e) => handleSettingChange('companyName', e.target.value)}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Timezone</InputLabel>
                <Select
                  value={settings.timezone}
                  label="Timezone"
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                >
                  <MenuItem value="UTC+4">UAE Standard Time (UTC+4)</MenuItem>
                  <MenuItem value="UTC+2">South Africa Standard Time (UTC+2)</MenuItem>
                  <MenuItem value="UTC+1">Central European Time (UTC+1)</MenuItem>
                  <MenuItem value="UTC+8">Singapore Standard Time (UTC+8)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Language</InputLabel>
                <Select
                  value={settings.language}
                  label="Language"
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="ar">العربية (Arabic)</MenuItem>
                  <MenuItem value="fr">Français (French)</MenuItem>
                  <MenuItem value="de">Deutsch (German)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Default Currency</InputLabel>
                <Select
                  value={settings.currency}
                  label="Default Currency"
                  onChange={(e) => handleSettingChange('currency', e.target.value)}
                >
                  <MenuItem value="USD">USD - US Dollar</MenuItem>
                  <MenuItem value="AED">AED - UAE Dirham</MenuItem>
                  <MenuItem value="EUR">EUR - Euro</MenuItem>
                  <MenuItem value="ZAR">ZAR - South African Rand</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Notifications Tab */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>
            Notification Preferences
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Email Notifications"
                secondary="Receive email alerts for important events"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <Divider />
            
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText
                primary="SMS Notifications"
                secondary="Receive critical alerts via SMS"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.smsNotifications}
                  onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <Divider />
            
            <ListItem>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText
                primary="System Alerts"
                secondary="Infrastructure and system health notifications"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.systemAlerts}
                  onChange={(e) => handleSettingChange('systemAlerts', e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <Divider />
            
            <ListItem>
              <ListItemIcon>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText
                primary="Security Alerts"
                secondary="Security incidents and authentication events"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.securityAlerts}
                  onChange={(e) => handleSettingChange('securityAlerts', e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>
            Security Configuration
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            Security settings affect all executive dashboard users. Changes require administrative approval.
          </Alert>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <ShieldIcon />
              </ListItemIcon>
              <ListItemText
                primary="Two-Factor Authentication"
                secondary="Require 2FA for all executive access"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.twoFactorAuth}
                  onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <Divider />
            
            <ListItem>
              <ListItemIcon>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText
                primary="Audit Logging"
                secondary="Log all user actions and system events"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.auditLogging}
                  onChange={(e) => handleSettingChange('auditLogging', e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Session Timeout (minutes)"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password Expiry (days)"
                type="number"
                value={settings.passwordExpiry}
                onChange={(e) => handleSettingChange('passwordExpiry', parseInt(e.target.value))}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Integrations Tab */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" gutterBottom>
            External Integrations
          </Typography>
          
          <List>
            {integrations.map((integration, index) => (
              <React.Fragment key={integration.name}>
                <ListItem>
                  <ListItemIcon>
                    <ApiIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1">{integration.name}</Typography>
                        <Chip
                          label={integration.status}
                          size="small"
                          color={integration.status === 'connected' ? 'success' : 'error'}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {integration.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Last sync: {integration.lastSync}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Button
                      size="small"
                      variant="outlined"
                      color={integration.status === 'connected' ? 'error' : 'primary'}
                    >
                      {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < integrations.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </TabPanel>

        {/* System Tab */}
        <TabPanel value={activeTab} index={4}>
          <Typography variant="h6" gutterBottom>
            System Configuration
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance Settings
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoRefresh}
                        onChange={(e) => handleSettingChange('autoRefresh', e.target.checked)}
                      />
                    }
                    label="Auto-refresh data"
                  />
                  
                  <TextField
                    fullWidth
                    label="Refresh Interval (seconds)"
                    type="number"
                    value={settings.refreshInterval}
                    onChange={(e) => handleSettingChange('refreshInterval', parseInt(e.target.value))}
                    margin="normal"
                    disabled={!settings.autoRefresh}
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Data Management
                  </Typography>
                  
                  <TextField
                    fullWidth
                    label="Data Retention (days)"
                    type="number"
                    value={settings.dataRetention}
                    onChange={(e) => handleSettingChange('dataRetention', parseInt(e.target.value))}
                    margin="normal"
                  />
                  
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Backup Frequency</InputLabel>
                    <Select
                      value={settings.backupFrequency}
                      label="Backup Frequency"
                      onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                    >
                      <MenuItem value="hourly">Hourly</MenuItem>
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    System Information
                  </Typography>
                  
                  <List>
                    {systemInfo.map((component, index) => (
                      <React.Fragment key={component.component}>
                        <ListItem>
                          <ListItemIcon>
                            <StorageIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1">{component.component}</Typography>
                                <Chip
                                  label={component.status}
                                  size="small"
                                  color={component.status === 'healthy' ? 'success' : 'warning'}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  Version: {component.version}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Uptime: {component.uptime}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < systemInfo.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default Settings;