import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Divider,
  Alert,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  PersonAdd as PersonAddIcon,
  Groups as GroupsIcon,
  Security as SecurityIcon,
  AdminPanelSettings as AdminIcon,
  Supervisor as SupervisorIcon,
} from '@mui/icons-material';

import { apiService } from '../../services/apiService';

interface StakeholderInvitation {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  title: string;
  department: string;
  accessLevel: 'BOARD' | 'C_LEVEL' | 'SENIOR_VP' | 'DEPARTMENT_HEAD' | 'ANALYST';
  domainAccess: string[];
  status?: 'pending' | 'sent' | 'accepted' | 'expired';
  sentAt?: string;
  expiresAt?: string;
}

interface StakeholderInvitationSystemProps {
  onInvitationSent?: (invitation: StakeholderInvitation) => void;
  domainFilter?: string[];
}

const ACCESS_LEVELS = [
  { value: 'BOARD', label: '👑 Board Chairman', description: 'Full ecosystem access' },
  { value: 'C_LEVEL', label: '👔 C-Level Executive', description: 'Cross-domain oversight' },
  { value: 'SENIOR_VP', label: '💼 Senior VP', description: 'Regional + departmental analytics' },
  { value: 'DEPARTMENT_HEAD', label: '🏛️ Department Head', description: 'Departmental scope access' },
  { value: 'ANALYST', label: '📊 Business Analyst', description: 'Read-only analytics access' },
];

const DEPARTMENTS = [
  'Executive Office',
  'Finance & Accounting',
  'Technology & Engineering',
  'Operations & Logistics',
  'Marketing & Sales',
  'Human Resources',
  'Legal & Compliance',
  'Business Development',
  'Customer Success',
  'Product Management',
];

const DOMAIN_OPTIONS = [
  { id: 'social-commerce', name: 'Social Commerce', icon: '🏢' },
  { id: 'warehousing', name: 'Warehousing', icon: '🏭' },
  { id: 'courier-services', name: 'Courier Services', icon: '🚚' },
  { id: 'haulage-logistics', name: 'Haulage Logistics', icon: '🚛' },
  { id: 'shared-infrastructure', name: 'Shared Infrastructure', icon: '⚙️' },
];

const StakeholderInvitationSystem: React.FC<StakeholderInvitationSystemProps> = ({
  onInvitationSent,
  domainFilter,
}) => {
  const [invitationForm, setInvitationForm] = useState<StakeholderInvitation>({
    email: '',
    firstName: '',
    lastName: '',
    title: '',
    department: '',
    accessLevel: 'ANALYST',
    domainAccess: [],
  });

  const [pendingInvitations, setPendingInvitations] = useState<StakeholderInvitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [bulkInviteOpen, setBulkInviteOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPendingInvitations();
  }, []);

  const fetchPendingInvitations = async () => {
    try {
      // Mock data for demonstration
      setPendingInvitations([
        {
          id: '1',
          email: 'sarah.mitchell@exalt.com',
          firstName: 'Sarah',
          lastName: 'Mitchell',
          title: 'Chief Financial Officer',
          department: 'Finance & Accounting',
          accessLevel: 'C_LEVEL',
          domainAccess: ['social-commerce', 'warehousing', 'courier-services'],
          status: 'sent',
          sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          email: 'david.chen@exalt.com',
          firstName: 'David',
          lastName: 'Chen',
          title: 'Chief Technology Officer',
          department: 'Technology & Engineering',
          accessLevel: 'C_LEVEL',
          domainAccess: ['shared-infrastructure', 'social-commerce'],
          status: 'pending',
          sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          email: 'maria.rodriguez@exalt.com',
          firstName: 'Maria',
          lastName: 'Rodriguez',
          title: 'Chief Operating Officer',
          department: 'Operations & Logistics',
          accessLevel: 'C_LEVEL',
          domainAccess: ['warehousing', 'courier-services', 'haulage-logistics'],
          status: 'accepted',
          sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch pending invitations:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!invitationForm.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!invitationForm.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!invitationForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invitationForm.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!invitationForm.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!invitationForm.department) {
      newErrors.department = 'Department is required';
    }
    if (invitationForm.domainAccess.length === 0) {
      newErrors.domainAccess = 'At least one domain must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormChange = (field: keyof StakeholderInvitation, value: any) => {
    setInvitationForm(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDomainAccessChange = (domainId: string, checked: boolean) => {
    const newDomainAccess = checked
      ? [...invitationForm.domainAccess, domainId]
      : invitationForm.domainAccess.filter(id => id !== domainId);
    
    handleFormChange('domainAccess', newDomainAccess);
  };

  const handleSendInvitation = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await apiService.inviteStakeholder(invitationForm);
      
      // Add to pending invitations
      const newInvitation: StakeholderInvitation = {
        ...invitationForm,
        id: Date.now().toString(),
        status: 'sent',
        sentAt: new Date().toISOString(),
      };
      
      setPendingInvitations(prev => [newInvitation, ...prev]);
      
      // Reset form
      setInvitationForm({
        email: '',
        firstName: '',
        lastName: '',
        title: '',
        department: '',
        accessLevel: 'ANALYST',
        domainAccess: [],
      });

      if (onInvitationSent) {
        onInvitationSent(newInvitation);
      }
    } catch (error) {
      console.error('Failed to send invitation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendInvitation = async (invitationId: string) => {
    try {
      // Update invitation status
      setPendingInvitations(prev =>
        prev.map(inv =>
          inv.id === invitationId
            ? { ...inv, status: 'sent', sentAt: new Date().toISOString() }
            : inv
        )
      );
    } catch (error) {
      console.error('Failed to resend invitation:', error);
    }
  };

  const getAccessLevelDetails = (level: string) => {
    return ACCESS_LEVELS.find(al => al.value === level) || ACCESS_LEVELS[0];
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'sent': return 'primary';
      case 'pending': return 'warning';
      case 'accepted': return 'success';
      case 'expired': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'sent': return '📧';
      case 'pending': return '⏳';
      case 'accepted': return '✅';
      case 'expired': return '❌';
      default: return '📋';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          🏛️ Executive Stakeholder Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Board-Level Access Management • Executive Onboarding
        </Typography>
      </Box>

      {/* Invitation Form */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <PersonAddIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">
              Invite New Stakeholder
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            🎯 Add new executive-level access to the Command Center
          </Typography>

          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Stakeholder Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={invitationForm.firstName}
                    onChange={(e) => handleFormChange('firstName', e.target.value)}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={invitationForm.lastName}
                    onChange={(e) => handleFormChange('lastName', e.target.value)}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Executive Title"
                    value={invitationForm.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    error={!!errors.title}
                    helperText={errors.title}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small" error={!!errors.department}>
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={invitationForm.department}
                      label="Department"
                      onChange={(e) => handleFormChange('department', e.target.value)}
                    >
                      {DEPARTMENTS.map(dept => (
                        <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={invitationForm.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Access Configuration */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Access Level Assignment
              </Typography>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Access Level</InputLabel>
                <Select
                  value={invitationForm.accessLevel}
                  label="Access Level"
                  onChange={(e) => handleFormChange('accessLevel', e.target.value)}
                >
                  {ACCESS_LEVELS.map(level => (
                    <MenuItem key={level.value} value={level.value}>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {level.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {level.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="subtitle2" gutterBottom>
                Domain Access Permissions
              </Typography>
              <Box sx={{ mb: 2 }}>
                {DOMAIN_OPTIONS.map(domain => (
                  <FormControlLabel
                    key={domain.id}
                    control={
                      <Checkbox
                        checked={invitationForm.domainAccess.includes(domain.id)}
                        onChange={(e) => handleDomainAccessChange(domain.id, e.target.checked)}
                        size="small"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {domain.icon}
                        </Typography>
                        <Typography variant="body2">
                          {domain.name}
                        </Typography>
                      </Box>
                    }
                  />
                ))}
              </Box>
              {errors.domainAccess && (
                <Typography variant="caption" color="error">
                  {errors.domainAccess}
                </Typography>
              )}
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleSendInvitation}
              disabled={loading}
            >
              📧 Send Invitation
            </Button>
            <Button
              variant="outlined"
              startIcon={<GroupsIcon />}
              onClick={() => setBulkInviteOpen(true)}
            >
              📋 Bulk Invite
            </Button>
            <Button
              variant="outlined"
              startIcon={<ViewIcon />}
              onClick={() => setPreviewOpen(true)}
            >
              👀 Preview
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">
                Pending Invitations
              </Typography>
            </Box>
            <IconButton onClick={fetchPendingInvitations} size="small">
              <RefreshIcon />
            </IconButton>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Sent</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingInvitations.map((invitation) => (
                  <TableRow key={invitation.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                          {invitation.firstName.charAt(0)}{invitation.lastName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {invitation.firstName} {invitation.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {invitation.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {invitation.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getAccessLevelDetails(invitation.accessLevel).label}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${getStatusIcon(invitation.status)} ${invitation.status}`}
                        size="small"
                        color={getStatusColor(invitation.status) as any}
                        variant="outlined"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="caption" color="text.secondary">
                        {invitation.sentAt ? new Date(invitation.sentAt).toLocaleDateString() : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        {invitation.status === 'pending' && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleResendInvitation(invitation.id!)}
                          >
                            Resend
                          </Button>
                        )}
                        {invitation.status === 'accepted' && (
                          <Button size="small" variant="outlined" startIcon={<EditIcon />}>
                            Manage
                          </Button>
                        )}
                        {invitation.status === 'sent' && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleResendInvitation(invitation.id!)}
                          >
                            Resend
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button variant="outlined" startIcon={<GroupsIcon />}>
              👥 Stakeholder Directory
            </Button>
            <Button variant="outlined" startIcon={<SecurityIcon />}>
              📊 Access Audit
            </Button>
            <Button variant="outlined" startIcon={<AdminIcon />}>
              ⚙️ Permissions
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ViewIcon sx={{ mr: 1 }} />
            Invitation Preview
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            This is how the invitation email will appear to the recipient.
          </Alert>
          {/* Email preview content would go here */}
          <Typography variant="body2">
            Email preview functionality will be implemented here showing the exact invitation
            email template with personalized content.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button variant="contained" onClick={handleSendInvitation}>
            Send Invitation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StakeholderInvitationSystem;