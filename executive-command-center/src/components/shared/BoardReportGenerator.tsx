import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  Description as ReportIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  Preview as PreviewIcon,
  Share as ShareIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  MonetizationOn as MoneyIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Analytics as AnalyticsIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Slideshow as PowerPointIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';

import { apiService } from '../../services/apiService';

interface ReportSection {
  id: string;
  name: string;
  description: string;
  type: 'executive_summary' | 'financial' | 'operational' | 'strategic' | 'risk' | 'customer' | 'compliance';
  required: boolean;
  enabled: boolean;
  customizable: boolean;
  dataSource: string;
  estimatedPages: number;
}

interface ReportConfig {
  id?: string;
  title: string;
  description: string;
  reportType: 'quarterly' | 'monthly' | 'annual' | 'custom';
  period: {
    startDate: Date;
    endDate: Date;
  };
  sections: ReportSection[];
  recipients: string[];
  format: 'pdf' | 'excel' | 'powerpoint' | 'all';
  template: 'standard' | 'executive' | 'detailed' | 'summary';
  scheduledDelivery?: {
    enabled: boolean;
    frequency: 'weekly' | 'monthly' | 'quarterly';
    dayOfWeek?: number;
    dayOfMonth?: number;
    time: string;
  };
  customizations: {
    includeCoverPage: boolean;
    includeExecutiveSummary: boolean;
    includeAppendices: boolean;
    confidentialityLevel: 'public' | 'internal' | 'confidential' | 'restricted';
    branding: boolean;
  };
  createdAt?: string;
  lastGenerated?: string;
  status: 'draft' | 'scheduled' | 'generating' | 'completed' | 'failed';
}

interface BoardReportGeneratorProps {
  onReportGenerated?: (config: ReportConfig) => void;
  presetConfig?: Partial<ReportConfig>;
}

const DEFAULT_SECTIONS: ReportSection[] = [
  {
    id: 'executive_summary',
    name: 'Executive Summary',
    description: 'High-level overview of business performance and key decisions',
    type: 'executive_summary',
    required: true,
    enabled: true,
    customizable: false,
    dataSource: 'dashboard_metrics',
    estimatedPages: 2,
  },
  {
    id: 'financial_performance',
    name: 'Financial Performance',
    description: 'Revenue, profitability, cash flow, and financial KPIs',
    type: 'financial',
    required: true,
    enabled: true,
    customizable: true,
    dataSource: 'financial_analytics',
    estimatedPages: 4,
  },
  {
    id: 'operational_metrics',
    name: 'Operational Metrics',
    description: 'Domain performance, efficiency metrics, and operational KPIs',
    type: 'operational',
    required: false,
    enabled: true,
    customizable: true,
    dataSource: 'operational_dashboard',
    estimatedPages: 6,
  },
  {
    id: 'strategic_initiatives',
    name: 'Strategic Initiatives',
    description: 'Progress on strategic projects and investment ROI',
    type: 'strategic',
    required: false,
    enabled: true,
    customizable: true,
    dataSource: 'strategic_planning',
    estimatedPages: 3,
  },
  {
    id: 'risk_assessment',
    name: 'Risk Assessment',
    description: 'Risk analysis, mitigation strategies, and compliance status',
    type: 'risk',
    required: true,
    enabled: true,
    customizable: true,
    dataSource: 'risk_management',
    estimatedPages: 2,
  },
  {
    id: 'customer_insights',
    name: 'Customer Insights',
    description: 'Customer satisfaction, retention, and experience metrics',
    type: 'customer',
    required: false,
    enabled: false,
    customizable: true,
    dataSource: 'customer_analytics',
    estimatedPages: 3,
  },
  {
    id: 'compliance_report',
    name: 'Compliance Report',
    description: 'Regulatory compliance status and audit findings',
    type: 'compliance',
    required: false,
    enabled: false,
    customizable: true,
    dataSource: 'compliance_system',
    estimatedPages: 2,
  },
];

const REPORT_TEMPLATES = [
  { id: 'standard', name: 'Standard Board Report', description: 'Comprehensive quarterly board presentation' },
  { id: 'executive', name: 'Executive Summary', description: 'High-level overview for busy executives' },
  { id: 'detailed', name: 'Detailed Analysis', description: 'In-depth analysis with supporting data' },
  { id: 'summary', name: 'Performance Summary', description: 'Key metrics and performance indicators' },
];

const STAKEHOLDER_GROUPS = [
  { id: 'board', name: 'Board of Directors', emails: ['board@exalt.com'] },
  { id: 'c_level', name: 'C-Level Executives', emails: ['ceo@exalt.com', 'cfo@exalt.com', 'cto@exalt.com'] },
  { id: 'investors', name: 'Investors & Advisors', emails: ['investors@exalt.com'] },
  { id: 'audit_committee', name: 'Audit Committee', emails: ['audit@exalt.com'] },
];

const BoardReportGenerator: React.FC<BoardReportGeneratorProps> = ({
  onReportGenerated,
  presetConfig,
}) => {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    title: 'Q4 2024 Board Report',
    description: 'Quarterly board report with comprehensive business performance analysis',
    reportType: 'quarterly',
    period: {
      startDate: new Date(2024, 9, 1), // Q4 start
      endDate: new Date(2024, 11, 31), // Q4 end
    },
    sections: DEFAULT_SECTIONS.map(section => ({ ...section })),
    recipients: [],
    format: 'pdf',
    template: 'standard',
    customizations: {
      includeCoverPage: true,
      includeExecutiveSummary: true,
      includeAppendices: true,
      confidentialityLevel: 'confidential',
      branding: true,
    },
    status: 'draft',
  });

  const [activeStep, setActiveStep] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [savedReports, setSavedReports] = useState<ReportConfig[]>([]);
  const [scheduledReports, setScheduledReports] = useState<ReportConfig[]>([]);

  useEffect(() => {
    if (presetConfig) {
      setReportConfig(prev => ({ ...prev, ...presetConfig }));
    }
    fetchSavedReports();
  }, [presetConfig]);

  const fetchSavedReports = async () => {
    try {
      // Mock data - replace with actual API call
      const mockReports: ReportConfig[] = [
        {
          id: 'report-001',
          title: 'Q3 2024 Board Report',
          description: 'Quarterly board report for Q3 2024',
          reportType: 'quarterly',
          period: {
            startDate: new Date(2024, 6, 1),
            endDate: new Date(2024, 8, 30),
          },
          sections: DEFAULT_SECTIONS.filter(s => s.enabled),
          recipients: ['board@exalt.com'],
          format: 'pdf',
          template: 'standard',
          customizations: {
            includeCoverPage: true,
            includeExecutiveSummary: true,
            includeAppendices: true,
            confidentialityLevel: 'confidential',
            branding: true,
          },
          createdAt: '2024-10-01T10:00:00Z',
          lastGenerated: '2024-10-01T14:30:00Z',
          status: 'completed',
        },
      ];
      
      setSavedReports(mockReports);
    } catch (error) {
      console.error('Failed to fetch saved reports:', error);
    }
  };

  const handleSectionToggle = (sectionId: string, enabled: boolean) => {
    setReportConfig(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, enabled } : section
      ),
    }));
  };

  const handleRecipientGroupToggle = (groupId: string, checked: boolean) => {
    const group = STAKEHOLDER_GROUPS.find(g => g.id === groupId);
    if (!group) return;

    setReportConfig(prev => {
      const newRecipients = checked
        ? [...prev.recipients, ...group.emails]
        : prev.recipients.filter(email => !group.emails.includes(email));
      
      return { ...prev, recipients: [...new Set(newRecipients)] };
    });
  };

  const handleConfigChange = (field: keyof ReportConfig, value: any) => {
    setReportConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleCustomizationChange = (field: string, value: any) => {
    setReportConfig(prev => ({
      ...prev,
      customizations: { ...prev.customizations, [field]: value },
    }));
  };

  const validateConfig = (): boolean => {
    if (!reportConfig.title.trim()) return false;
    if (reportConfig.recipients.length === 0) return false;
    if (reportConfig.sections.filter(s => s.enabled).length === 0) return false;
    return true;
  };

  const generateReport = async () => {
    if (!validateConfig()) {
      alert('Please complete all required fields');
      return;
    }

    setGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate report generation progress
      const steps = [
        'Collecting financial data...',
        'Analyzing operational metrics...',
        'Generating charts and visualizations...',
        'Compiling executive summary...',
        'Creating report document...',
        'Finalizing and formatting...',
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setGenerationProgress(((i + 1) / steps.length) * 100);
      }

      // Mock API call to generate report
      const generatedReport: ReportConfig = {
        ...reportConfig,
        id: `report-${Date.now()}`,
        createdAt: new Date().toISOString(),
        lastGenerated: new Date().toISOString(),
        status: 'completed',
      };

      setSavedReports(prev => [generatedReport, ...prev]);

      if (onReportGenerated) {
        onReportGenerated(generatedReport);
      }

      alert('Report generated successfully!');
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
      setGenerationProgress(0);
    }
  };

  const scheduleReport = async () => {
    try {
      const scheduledReport: ReportConfig = {
        ...reportConfig,
        id: `scheduled-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'scheduled',
      };

      setScheduledReports(prev => [scheduledReport, ...prev]);
      alert('Report scheduled successfully!');
    } catch (error) {
      console.error('Failed to schedule report:', error);
    }
  };

  const downloadReport = async (reportId: string) => {
    try {
      // Mock download implementation
      console.log('Downloading report:', reportId);
      alert('Report download started. You will receive an email when ready.');
    } catch (error) {
      console.error('Failed to download report:', error);
    }
  };

  const emailReport = async (reportId: string) => {
    try {
      // Mock email implementation
      console.log('Emailing report:', reportId);
      alert('Report sent via email to configured recipients.');
    } catch (error) {
      console.error('Failed to email report:', error);
    }
  };

  const getTotalEstimatedPages = () => {
    return reportConfig.sections
      .filter(section => section.enabled)
      .reduce((total, section) => total + section.estimatedPages, 0);
  };

  const steps = [
    'Configure Report',
    'Select Sections',
    'Choose Recipients',
    'Customize Output',
    'Generate & Deliver',
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          📋 Board Report Generator
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Automated board report generation with executive-level insights
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Configuration Panel */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Stepper activeStep={activeStep} orientation="vertical">
                {/* Step 1: Configure Report */}
                <Step>
                  <StepLabel>Configure Report</StepLabel>
                  <StepContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Report Title"
                          value={reportConfig.title}
                          onChange={(e) => handleConfigChange('title', e.target.value)}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Report Type</InputLabel>
                          <Select
                            value={reportConfig.reportType}
                            label="Report Type"
                            onChange={(e) => handleConfigChange('reportType', e.target.value)}
                          >
                            <MenuItem value="quarterly">Quarterly Report</MenuItem>
                            <MenuItem value="monthly">Monthly Report</MenuItem>
                            <MenuItem value="annual">Annual Report</MenuItem>
                            <MenuItem value="custom">Custom Period</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DatePicker
                          label="Start Date"
                          value={reportConfig.period.startDate}
                          onChange={(date) => handleConfigChange('period', {
                            ...reportConfig.period,
                            startDate: date || new Date(),
                          })}
                          slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DatePicker
                          label="End Date"
                          value={reportConfig.period.endDate}
                          onChange={(date) => handleConfigChange('period', {
                            ...reportConfig.period,
                            endDate: date || new Date(),
                          })}
                          slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Description"
                          multiline
                          rows={3}
                          value={reportConfig.description}
                          onChange={(e) => handleConfigChange('description', e.target.value)}
                          margin="normal"
                        />
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(1)}
                        sx={{ mr: 1 }}
                      >
                        Next
                      </Button>
                    </Box>
                  </StepContent>
                </Step>

                {/* Step 2: Select Sections */}
                <Step>
                  <StepLabel>Select Report Sections</StepLabel>
                  <StepContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Choose the sections to include in your board report. Estimated total: {getTotalEstimatedPages()} pages.
                    </Typography>
                    
                    <FormGroup>
                      {reportConfig.sections.map((section) => (
                        <FormControlLabel
                          key={section.id}
                          control={
                            <Checkbox
                              checked={section.enabled}
                              onChange={(e) => handleSectionToggle(section.id, e.target.checked)}
                              disabled={section.required}
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {section.name} {section.required && <Chip label="Required" size="small" />}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {section.description} ({section.estimatedPages} pages)
                              </Typography>
                            </Box>
                          }
                        />
                      ))}
                    </FormGroup>
                    
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(2)}
                        sx={{ mr: 1 }}
                      >
                        Next
                      </Button>
                      <Button onClick={() => setActiveStep(0)}>
                        Back
                      </Button>
                    </Box>
                  </StepContent>
                </Step>

                {/* Step 3: Choose Recipients */}
                <Step>
                  <StepLabel>Choose Recipients</StepLabel>
                  <StepContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Select stakeholder groups to receive this report.
                    </Typography>
                    
                    <FormGroup>
                      {STAKEHOLDER_GROUPS.map((group) => (
                        <FormControlLabel
                          key={group.id}
                          control={
                            <Checkbox
                              checked={group.emails.some(email => reportConfig.recipients.includes(email))}
                              onChange={(e) => handleRecipientGroupToggle(group.id, e.target.checked)}
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {group.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {group.emails.join(', ')}
                              </Typography>
                            </Box>
                          }
                        />
                      ))}
                    </FormGroup>
                    
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(3)}
                        sx={{ mr: 1 }}
                        disabled={reportConfig.recipients.length === 0}
                      >
                        Next
                      </Button>
                      <Button onClick={() => setActiveStep(1)}>
                        Back
                      </Button>
                    </Box>
                  </StepContent>
                </Step>

                {/* Step 4: Customize Output */}
                <Step>
                  <StepLabel>Customize Output</StepLabel>
                  <StepContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Report Format</InputLabel>
                          <Select
                            value={reportConfig.format}
                            label="Report Format"
                            onChange={(e) => handleConfigChange('format', e.target.value)}
                          >
                            <MenuItem value="pdf">📄 PDF Document</MenuItem>
                            <MenuItem value="excel">📊 Excel Workbook</MenuItem>
                            <MenuItem value="powerpoint">📋 PowerPoint Presentation</MenuItem>
                            <MenuItem value="all">📁 All Formats</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Template</InputLabel>
                          <Select
                            value={reportConfig.template}
                            label="Template"
                            onChange={(e) => handleConfigChange('template', e.target.value)}
                          >
                            {REPORT_TEMPLATES.map(template => (
                              <MenuItem key={template.id} value={template.id}>
                                {template.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom>
                          Additional Options
                        </Typography>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={reportConfig.customizations.includeCoverPage}
                                onChange={(e) => handleCustomizationChange('includeCoverPage', e.target.checked)}
                              />
                            }
                            label="Include Cover Page"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={reportConfig.customizations.includeAppendices}
                                onChange={(e) => handleCustomizationChange('includeAppendices', e.target.checked)}
                              />
                            }
                            label="Include Appendices"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={reportConfig.customizations.branding}
                                onChange={(e) => handleCustomizationChange('branding', e.target.checked)}
                              />
                            }
                            label="Apply Company Branding"
                          />
                        </FormGroup>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(4)}
                        sx={{ mr: 1 }}
                      >
                        Next
                      </Button>
                      <Button onClick={() => setActiveStep(2)}>
                        Back
                      </Button>
                    </Box>
                  </StepContent>
                </Step>

                {/* Step 5: Generate & Deliver */}
                <Step>
                  <StepLabel>Generate & Deliver</StepLabel>
                  <StepContent>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Review your configuration and generate the board report. The process typically takes 2-5 minutes.
                    </Alert>
                    
                    {generating && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          Generating report... {Math.round(generationProgress)}%
                        </Typography>
                        <LinearProgress variant="determinate" value={generationProgress} />
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        startIcon={<ReportIcon />}
                        onClick={generateReport}
                        disabled={generating}
                      >
                        Generate Report
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<ScheduleIcon />}
                        onClick={scheduleReport}
                        disabled={generating}
                      >
                        Schedule Report
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<PreviewIcon />}
                        onClick={() => setPreviewOpen(true)}
                        disabled={generating}
                      >
                        Preview
                      </Button>
                      <Button onClick={() => setActiveStep(3)}>
                        Back
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              </Stepper>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Recent Reports */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Reports
              </Typography>
              <List dense>
                {savedReports.slice(0, 3).map((report) => (
                  <ListItem key={report.id} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <ReportIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={report.title}
                      secondary={report.lastGenerated ? format(new Date(report.lastGenerated), 'MMM dd, yyyy') : 'Draft'}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        size="small"
                        onClick={() => downloadReport(report.id!)}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Report Summary */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Report Summary
              </Typography>
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Period"
                    secondary={`${format(reportConfig.period.startDate, 'MMM dd')} - ${format(reportConfig.period.endDate, 'MMM dd, yyyy')}`}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Sections"
                    secondary={`${reportConfig.sections.filter(s => s.enabled).length} sections, ~${getTotalEstimatedPages()} pages`}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Recipients"
                    secondary={`${reportConfig.recipients.length} recipients`}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Format"
                    secondary={reportConfig.format.toUpperCase()}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Report Preview
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            This preview shows the structure and content outline of your board report.
          </Alert>
          <Typography variant="body2">
            Report preview functionality will show the table of contents, section summaries,
            and sample pages from the generated report.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button variant="contained" onClick={generateReport}>
            Generate Full Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BoardReportGenerator;