import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Button,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import StakeholderInvitationSystem from '../../components/shared/StakeholderInvitationSystem';

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
      id={`stakeholder-tabpanel-${index}`}
      aria-labelledby={`stakeholder-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const StakeholderManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const stakeholders = [
    {
      id: 1,
      name: 'James Wilson',
      email: 'james.wilson@exalt.com',
      role: 'Chief Executive Officer',
      accessLevel: 'BOARD',
      department: 'Executive',
      lastLogin: '2 hours ago',
      status: 'active',
      avatar: 'JW',
    },
    {
      id: 2,
      name: 'Sarah Chen',
      email: 'sarah.chen@exalt.com',
      role: 'Chief Financial Officer',
      accessLevel: 'C_LEVEL',
      department: 'Finance',
      lastLogin: '1 day ago',
      status: 'active',
      avatar: 'SC',
    },
    {
      id: 3,
      name: 'Mohammed Al-Rashid',
      email: 'mohammed.rashid@exalt.com',
      role: 'Chief Technology Officer',
      accessLevel: 'C_LEVEL',
      department: 'Technology',
      lastLogin: '3 hours ago',
      status: 'active',
      avatar: 'MA',
    },
    {
      id: 4,
      name: 'Elena Rodriguez',
      email: 'elena.rodriguez@exalt.com',
      role: 'VP Operations',
      accessLevel: 'SENIOR_VP',
      department: 'Operations',
      lastLogin: '5 hours ago',
      status: 'active',
      avatar: 'ER',
    },
    {
      id: 5,
      name: 'David Kim',
      email: 'david.kim@exalt.com',
      role: 'Regional Director APAC',
      accessLevel: 'REGIONAL_VP',
      department: 'Regional',
      lastLogin: '1 week ago',
      status: 'inactive',
      avatar: 'DK',
    },
  ];

  const accessLevels = [
    {
      level: 'BOARD',
      name: 'Board Chairman',
      description: 'Full ecosystem access with board privileges',
      permissions: ['All Domains', 'Financial Reports', 'Strategic Planning', 'Board Reports'],
      count: 1,
      color: 'error',
    },
    {
      level: 'C_LEVEL',
      name: 'C-Level Executive',
      description: 'Cross-domain oversight and executive decisions',
      permissions: ['All Domains', 'Financial Reports', 'Strategic Planning', 'Stakeholder Management'],
      count: 2,
      color: 'warning',
    },
    {
      level: 'SENIOR_VP',
      name: 'Senior Vice President',
      description: 'Multi-domain access with strategic oversight',
      permissions: ['Multi-Domain Access', 'Operational Reports', 'Team Management'],
      count: 1,
      color: 'info',
    },
    {
      level: 'REGIONAL_VP',
      name: 'Regional Vice President',
      description: 'Regional operations and domain-specific access',
      permissions: ['Regional Access', 'Domain Reports', 'Local Operations'],
      count: 1,
      color: 'success',
    },
  ];

  const getAccessLevelColor = (level: string) => {
    const accessLevel = accessLevels.find(al => al.level === level);
    return accessLevel?.color || 'default';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'default';
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            👥 Stakeholder Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage executive access, permissions, and stakeholder communications
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setInviteDialogOpen(true)}
        >
          Invite Stakeholder
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  Total Stakeholders
                </Typography>
              </Box>
              <Typography variant="h4">
                {stakeholders.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SecurityIcon color="success" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  Active Users
                </Typography>
              </Box>
              <Typography variant="h4">
                {stakeholders.filter(s => s.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BusinessIcon color="warning" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  Executive Level
                </Typography>
              </Box>
              <Typography variant="h4">
                {stakeholders.filter(s => ['BOARD', 'C_LEVEL'].includes(s.accessLevel)).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AssessmentIcon color="info" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  Access Levels
                </Typography>
              </Box>
              <Typography variant="h4">
                {accessLevels.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="All Stakeholders" />
            <Tab label="Access Levels" />
            <Tab label="Permissions" />
            <Tab label="Activity Log" />
          </Tabs>
        </Box>

        {/* All Stakeholders Tab */}
        <TabPanel value={activeTab} index={0}>
          <Typography variant="h6" gutterBottom>
            Executive & Stakeholder Directory
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Stakeholder</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Access Level</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stakeholders.map((stakeholder) => (
                  <TableRow key={stakeholder.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {stakeholder.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {stakeholder.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {stakeholder.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{stakeholder.role}</TableCell>
                    <TableCell>
                      <Chip
                        label={stakeholder.accessLevel.replace('_', ' ')}
                        size="small"
                        color={getAccessLevelColor(stakeholder.accessLevel) as any}
                      />
                    </TableCell>
                    <TableCell>{stakeholder.department}</TableCell>
                    <TableCell>{stakeholder.lastLogin}</TableCell>
                    <TableCell>
                      <Chip
                        label={stakeholder.status}
                        size="small"
                        color={getStatusColor(stakeholder.status) as any}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" sx={{ mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" sx={{ mr: 1 }}>
                        <EmailIcon />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Access Levels Tab */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>
            Access Level Configuration
          </Typography>
          <Grid container spacing={3}>
            {accessLevels.map((level) => (
              <Grid item xs={12} md={6} key={level.level}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" component="h3">
                          {level.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {level.description}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${level.count} users`}
                        size="small"
                        color={level.color as any}
                      />
                    </Box>

                    <Typography variant="subtitle2" gutterBottom>
                      Permissions:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {level.permissions.map((permission, index) => (
                        <Chip
                          key={index}
                          label={permission}
                          size="small"
                          variant="outlined"
                          color={level.color as any}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              Access levels are hierarchical. Board members have all permissions of lower levels, 
              plus additional strategic and fiduciary oversight capabilities.
            </Typography>
          </Alert>
        </TabPanel>

        {/* Permissions Tab */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>
            Permission Matrix
          </Typography>
          <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <SecurityIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Detailed Permission Matrix
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Granular permission controls and access management would be displayed here
              </Typography>
            </Box>
          </Box>
        </TabPanel>

        {/* Activity Log Tab */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" gutterBottom>
            Stakeholder Activity Log
          </Typography>
          <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <AssessmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Activity Monitoring
              </Typography>
              <Typography variant="body2" color="text.secondary">
                User activity logs, login history, and access patterns would be displayed here
              </Typography>
            </Box>
          </Box>
        </TabPanel>
      </Card>

      {/* Invite Dialog */}
      <Dialog 
        open={inviteDialogOpen} 
        onClose={() => setInviteDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Invite New Stakeholder
        </DialogTitle>
        <DialogContent>
          <StakeholderInvitationSystem
            onInviteSent={() => {
              setInviteDialogOpen(false);
              // Refresh stakeholder list
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteDialogOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StakeholderManagement;