import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  AlertTitle,
  Button,
  IconButton,
  Badge,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Collapse,
  Divider,
  Grid,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Avatar,
  AvatarGroup,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Notifications as NotificationsIcon,
  NotificationsActive as ActiveNotificationsIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  MonetizationOn as MoneyIcon,
  Group as GroupIcon,
  Assignment as AssignmentIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Phone as PhoneIcon,
  Escalation as EscalationIcon,
  AccessTime as TimeIcon,
  CheckBox as CheckBoxIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

interface ExecutiveAlert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low' | 'success';
  category: 'financial' | 'operational' | 'security' | 'customer' | 'strategic' | 'technical';
  title: string;
  description: string;
  impact: string;
  recommendation?: string;
  actionRequired: boolean;
  responseTimeframe?: string;
  estimatedCost?: number;
  potentialRevenue?: number;
  affectedDomains: string[];
  stakeholders: string[];
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'acknowledged' | 'in_progress' | 'resolved' | 'escalated';
  priority: number;
  businessImpact: 'low' | 'medium' | 'high' | 'critical';
  automationAvailable?: boolean;
  escalationLevel: number;
  relatedAlerts?: string[];
  actionButtons?: AlertAction[];
}

interface AlertAction {
  id: string;
  label: string;
  type: 'approve' | 'escalate' | 'investigate' | 'resolve' | 'schedule';
  requiresConfirmation: boolean;
  estimatedCost?: number;
  impact?: string;
}

interface ExecutiveAlertSystemProps {
  alertFilter?: string[];
  autoRefresh?: boolean;
  compactMode?: boolean;
}

const ALERT_CATEGORIES = [
  { id: 'financial', name: 'Financial', icon: '💰', color: '#52C41A' },
  { id: 'operational', name: 'Operational', icon: '⚙️', color: '#1890FF' },
  { id: 'security', name: 'Security', icon: '🔐', color: '#FF4D4F' },
  { id: 'customer', name: 'Customer', icon: '👥', color: '#722ED1' },
  { id: 'strategic', name: 'Strategic', icon: '🎯', color: '#FA8C16' },
  { id: 'technical', name: 'Technical', icon: '🔧', color: '#13C2C2' },
];

const DOMAIN_MAPPING = {
  'social-commerce': { name: 'Social Commerce', icon: '🏢' },
  'warehousing': { name: 'Warehousing', icon: '🏭' },
  'courier-services': { name: 'Courier Services', icon: '🚚' },
  'haulage-logistics': { name: 'Haulage Logistics', icon: '🚛' },
  'shared-infrastructure': { name: 'Infrastructure', icon: '⚙️' },
};

const ExecutiveAlertSystem: React.FC<ExecutiveAlertSystemProps> = ({
  alertFilter = [],
  autoRefresh = true,
  compactMode = false,
}) => {
  const [alerts, setAlerts] = useState<ExecutiveAlert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<ExecutiveAlert[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<ExecutiveAlert | null>(null);
  const [selectedAction, setSelectedAction] = useState<AlertAction | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchAlerts();
    
    if (autoRefresh) {
      const interval = setInterval(fetchAlerts, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  useEffect(() => {
    filterAlerts();
  }, [alerts, selectedCategory, selectedPriority, alertFilter]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const mockAlerts: ExecutiveAlert[] = [
        {
          id: 'alert-001',
          type: 'critical',
          category: 'operational',
          title: 'Courier Services capacity at 97%',
          description: '30% growth in demand requires immediate scaling',
          impact: 'Customer delivery delays and potential revenue loss',
          recommendation: 'Authorize $2.1M fleet expansion',
          actionRequired: true,
          responseTimeframe: '24 hours',
          estimatedCost: 2100000,
          potentialRevenue: 8500000,
          affectedDomains: ['courier-services'],
          stakeholders: ['COO', 'CFO', 'Courier Director'],
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          status: 'active',
          priority: 1,
          businessImpact: 'critical',
          automationAvailable: false,
          escalationLevel: 3,
          actionButtons: [
            {
              id: 'approve-expansion',
              label: '🚀 Approve Expansion',
              type: 'approve',
              requiresConfirmation: true,
              estimatedCost: 2100000,
              impact: 'Immediate capacity increase, 6-week implementation',
            },
            {
              id: 'escalate-board',
              label: '👥 Escalate to Board',
              type: 'escalate',
              requiresConfirmation: true,
            },
          ],
        },
        {
          id: 'alert-002',
          type: 'high',
          category: 'strategic',
          title: 'EU market expansion accelerating',
          description: '42% revenue growth potential identified',
          impact: 'Significant market opportunity requiring strategic investment',
          recommendation: 'Board decision required for $5.2M investment',
          actionRequired: true,
          responseTimeframe: 'Next board meeting',
          estimatedCost: 5200000,
          potentialRevenue: 15600000,
          affectedDomains: ['social-commerce', 'warehousing'],
          stakeholders: ['CEO', 'CFO', 'VP International'],
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          priority: 2,
          businessImpact: 'high',
          automationAvailable: false,
          escalationLevel: 2,
          actionButtons: [
            {
              id: 'add-board-agenda',
              label: '📋 Add to Board Agenda',
              type: 'schedule',
              requiresConfirmation: false,
            },
            {
              id: 'request-analysis',
              label: '📊 Request Analysis',
              type: 'investigate',
              requiresConfirmation: false,
            },
          ],
        },
        {
          id: 'alert-003',
          type: 'success',
          category: 'financial',
          title: 'Haulage Logistics exceeding Q4 targets',
          description: '28% above projected revenue with 15% margin improvement',
          impact: 'Positive variance contributing $2.1M additional revenue',
          actionRequired: false,
          affectedDomains: ['haulage-logistics'],
          stakeholders: ['CFO', 'Haulage Director'],
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          priority: 5,
          businessImpact: 'medium',
          escalationLevel: 0,
        },
        {
          id: 'alert-004',
          type: 'medium',
          category: 'security',
          title: 'Security compliance audit scheduled',
          description: 'Annual SOC2 Type II audit commencing December 15',
          impact: 'Compliance verification for enterprise customers',
          recommendation: 'Ensure all documentation updated',
          actionRequired: true,
          responseTimeframe: '2 weeks',
          affectedDomains: ['shared-infrastructure'],
          stakeholders: ['CTO', 'Security Officer', 'Compliance Team'],
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'in_progress',
          priority: 3,
          businessImpact: 'medium',
          automationAvailable: true,
          escalationLevel: 1,
        },
        {
          id: 'alert-005',
          type: 'success',
          category: 'customer',
          title: 'Customer satisfaction at all-time high',
          description: 'NPS score reached 74, CSAT 4.8/5.0 across all domains',
          impact: 'Strong customer loyalty driving retention and referrals',
          actionRequired: false,
          affectedDomains: ['social-commerce', 'warehousing', 'courier-services'],
          stakeholders: ['CCO', 'VP Customer Success'],
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          priority: 4,
          businessImpact: 'low',
          escalationLevel: 0,
        },
      ];

      setAlerts(mockAlerts);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAlerts = () => {
    let filtered = [...alerts];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(alert => alert.category === selectedCategory);
    }

    if (selectedPriority !== 'all') {
      filtered = filtered.filter(alert => {
        switch (selectedPriority) {
          case 'critical': return alert.type === 'critical';
          case 'high': return alert.type === 'high';
          case 'medium': return alert.type === 'medium';
          case 'low': return alert.type === 'low';
          default: return true;
        }
      });
    }

    if (alertFilter.length > 0) {
      filtered = filtered.filter(alert =>
        alert.affectedDomains.some(domain => alertFilter.includes(domain))
      );
    }

    // Sort by priority and creation time
    filtered.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredAlerts(filtered);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <ErrorIcon />;
      case 'high': return <WarningIcon />;
      case 'medium': return <InfoIcon />;
      case 'low': return <InfoIcon />;
      case 'success': return <SuccessIcon />;
      default: return <InfoIcon />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'info';
      case 'success': return 'success';
      default: return 'info';
    }
  };

  const getCategoryInfo = (category: string) => {
    return ALERT_CATEGORIES.find(cat => cat.id === category) || ALERT_CATEGORIES[0];
  };

  const toggleAlertExpansion = (alertId: string) => {
    const newExpanded = new Set(expandedAlerts);
    if (newExpanded.has(alertId)) {
      newExpanded.delete(alertId);
    } else {
      newExpanded.add(alertId);
    }
    setExpandedAlerts(newExpanded);
  };

  const handleActionClick = (alert: ExecutiveAlert, action: AlertAction) => {
    setSelectedAlert(alert);
    setSelectedAction(action);
    if (action.requiresConfirmation) {
      setActionDialogOpen(true);
    } else {
      executeAction(alert, action);
    }
  };

  const executeAction = async (alert: ExecutiveAlert, action: AlertAction) => {
    try {
      console.log('Executing action:', action.id, 'for alert:', alert.id);
      // Implementation would call appropriate API endpoints
      
      // Update alert status based on action
      const updatedAlerts = alerts.map(a => {
        if (a.id === alert.id) {
          return {
            ...a,
            status: action.type === 'resolve' ? 'resolved' : 'in_progress',
            updatedAt: new Date().toISOString(),
          };
        }
        return a;
      });
      
      setAlerts(updatedAlerts);
      setActionDialogOpen(false);
    } catch (error) {
      console.error('Failed to execute action:', error);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    const updatedAlerts = alerts.map(alert => {
      if (alert.id === alertId) {
        return {
          ...alert,
          status: 'acknowledged' as const,
          updatedAt: new Date().toISOString(),
        };
      }
      return alert;
    });
    
    setAlerts(updatedAlerts);
  };

  const getCriticalAlertsCount = () => {
    return filteredAlerts.filter(alert => 
      alert.type === 'critical' && alert.status === 'active'
    ).length;
  };

  const getActiveAlertsCount = () => {
    return filteredAlerts.filter(alert => 
      ['active', 'in_progress'].includes(alert.status)
    ).length;
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Badge badgeContent={getCriticalAlertsCount()} color="error">
            <ActiveNotificationsIcon sx={{ mr: 1, color: 'primary.main' }} />
          </Badge>
          <Typography variant="h6" sx={{ ml: 1 }}>
            Executive Alert Center
          </Typography>
          <Chip
            label={`${getActiveAlertsCount()} Active`}
            size="small"
            color="primary"
            sx={{ ml: 2 }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary">
          Last updated: {formatDistanceToNow(lastUpdated, { addSuffix: true })}
        </Typography>
      </Box>

      {/* Filters */}
      {!compactMode && (
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {ALERT_CATEGORIES.map(category => (
                <MenuItem key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={selectedPriority}
              label="Priority"
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <MenuItem value="all">All Priorities</MenuItem>
              <MenuItem value="critical">🔴 Critical</MenuItem>
              <MenuItem value="high">🟡 High</MenuItem>
              <MenuItem value="medium">🔵 Medium</MenuItem>
              <MenuItem value="low">⚪ Low</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Critical Alerts Summary */}
      {getCriticalAlertsCount() > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>🚨 Critical Alerts Requiring Immediate Attention</AlertTitle>
          {getCriticalAlertsCount()} critical alerts need executive review and action within specified timeframes.
        </Alert>
      )}

      {/* Alerts List */}
      <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
        {filteredAlerts.map((alert, index) => {
          const categoryInfo = getCategoryInfo(alert.category);
          const isExpanded = expandedAlerts.has(alert.id);
          
          return (
            <React.Fragment key={alert.id}>
              <ListItem
                sx={{
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  bgcolor: alert.type === 'critical' ? 'error.light' : 'transparent',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                {/* Alert Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getAlertIcon(alert.type)}
                  </ListItemIcon>
                  
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body1" fontWeight={500}>
                        {alert.title}
                      </Typography>
                      <Chip
                        label={`${categoryInfo.icon} ${categoryInfo.name}`}
                        size="small"
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                      {alert.actionRequired && (
                        <Chip
                          label="Action Required"
                          size="small"
                          color="warning"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary">
                      {alert.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                      </Typography>
                      
                      {alert.affectedDomains.map(domain => (
                        <Chip
                          key={domain}
                          label={`${DOMAIN_MAPPING[domain as keyof typeof DOMAIN_MAPPING]?.icon} ${DOMAIN_MAPPING[domain as keyof typeof DOMAIN_MAPPING]?.name}`}
                          size="small"
                          variant="outlined"
                          sx={{ height: 18, fontSize: '0.65rem' }}
                        />
                      ))}
                      
                      {alert.responseTimeframe && (
                        <Chip
                          icon={<TimeIcon />}
                          label={alert.responseTimeframe}
                          size="small"
                          color="warning"
                          variant="outlined"
                          sx={{ height: 18, fontSize: '0.65rem' }}
                        />
                      )}
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {alert.status === 'active' && (
                      <Button
                        size="small"
                        onClick={() => acknowledgeAlert(alert.id)}
                        startIcon={<CheckBoxIcon />}
                      >
                        Acknowledge
                      </Button>
                    )}
                    
                    <IconButton
                      onClick={() => toggleAlertExpansion(alert.id)}
                      size="small"
                    >
                      {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>
                </Box>

                {/* Expanded Content */}
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>
                          Impact & Recommendations
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Business Impact:</strong> {alert.impact}
                        </Typography>
                        {alert.recommendation && (
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Recommendation:</strong> {alert.recommendation}
                          </Typography>
                        )}
                        
                        {(alert.estimatedCost || alert.potentialRevenue) && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Financial Impact
                            </Typography>
                            {alert.estimatedCost && (
                              <Typography variant="body2" color="error.main">
                                💰 Estimated Cost: ${alert.estimatedCost.toLocaleString()}
                              </Typography>
                            )}
                            {alert.potentialRevenue && (
                              <Typography variant="body2" color="success.main">
                                📈 Potential Revenue: ${alert.potentialRevenue.toLocaleString()}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>
                          Stakeholders
                        </Typography>
                        <AvatarGroup max={4} sx={{ mb: 2 }}>
                          {alert.stakeholders.map((stakeholder, idx) => (
                            <Tooltip key={stakeholder} title={stakeholder}>
                              <Avatar sx={{ width: 32, height: 32 }}>
                                {stakeholder.split(' ').map(word => word.charAt(0)).join('')}
                              </Avatar>
                            </Tooltip>
                          ))}
                        </AvatarGroup>
                        
                        {alert.actionButtons && alert.actionButtons.length > 0 && (
                          <Box>
                            <Typography variant="subtitle2" gutterBottom>
                              Available Actions
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {alert.actionButtons.map(action => (
                                <Button
                                  key={action.id}
                                  size="small"
                                  variant={action.type === 'approve' ? 'contained' : 'outlined'}
                                  color={action.type === 'approve' ? 'primary' : 'inherit'}
                                  onClick={() => handleActionClick(alert, action)}
                                >
                                  {action.label}
                                </Button>
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                </Collapse>
              </ListItem>
              
              {index < filteredAlerts.length - 1 && <Divider />}
            </React.Fragment>
          );
        })}
      </List>

      {filteredAlerts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <SuccessIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No Active Alerts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All systems operating normally. Great work!
          </Typography>
        </Box>
      )}

      {/* Action Confirmation Dialog */}
      <Dialog
        open={actionDialogOpen}
        onClose={() => setActionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Confirm Executive Action
        </DialogTitle>
        <DialogContent>
          {selectedAlert && selectedAction && (
            <Box>
              <Alert severity="warning" sx={{ mb: 2 }}>
                This action requires executive approval and cannot be undone.
              </Alert>
              
              <Typography variant="body1" gutterBottom>
                <strong>Action:</strong> {selectedAction.label}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Alert:</strong> {selectedAlert.title}
              </Typography>
              
              {selectedAction.estimatedCost && (
                <Typography variant="body1" gutterBottom>
                  <strong>Estimated Cost:</strong> ${selectedAction.estimatedCost.toLocaleString()}
                </Typography>
              )}
              
              {selectedAction.impact && (
                <Typography variant="body1" gutterBottom>
                  <strong>Expected Impact:</strong> {selectedAction.impact}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={() => selectedAlert && selectedAction && executeAction(selectedAlert, selectedAction)}
            color="primary"
          >
            Confirm Action
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExecutiveAlertSystem;