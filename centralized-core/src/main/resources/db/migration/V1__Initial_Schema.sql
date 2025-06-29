-- Initial Schema for Centralized Dashboard

-- Create dashboard_metrics table for storing raw metrics from all domains
CREATE TABLE dashboard_metrics (
    id BIGSERIAL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DOUBLE PRECISION NOT NULL,
    metric_unit VARCHAR(50),
    source_domain VARCHAR(50) NOT NULL,
    source_service VARCHAR(100),
    region VARCHAR(100),
    timestamp TIMESTAMP NOT NULL,
    data_point_type VARCHAR(50),
    tags VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create dashboard_kpis table for storing calculated KPIs
CREATE TABLE dashboard_kpis (
    id BIGSERIAL PRIMARY KEY,
    kpi_name VARCHAR(100) NOT NULL,
    kpi_value DOUBLE PRECISION NOT NULL,
    kpi_unit VARCHAR(50),
    target_value DOUBLE PRECISION,
    min_threshold DOUBLE PRECISION,
    max_threshold DOUBLE PRECISION,
    kpi_status VARCHAR(50),
    kpi_category VARCHAR(50) NOT NULL,
    calculation_formula VARCHAR(255),
    calculation_period VARCHAR(50),
    timestamp TIMESTAMP NOT NULL,
    region VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create dashboard_reports table for storing generated reports
CREATE TABLE dashboard_reports (
    id BIGSERIAL PRIMARY KEY,
    report_name VARCHAR(100) NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    report_format VARCHAR(50) NOT NULL,
    generated_by VARCHAR(100),
    generated_at TIMESTAMP NOT NULL,
    report_period_start TIMESTAMP,
    report_period_end TIMESTAMP,
    report_data TEXT,
    status VARCHAR(50) NOT NULL,
    file_path VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create domain_integration table for storing integration configurations
CREATE TABLE domain_integration (
    id BIGSERIAL PRIMARY KEY,
    domain_name VARCHAR(50) NOT NULL,
    api_endpoint VARCHAR(255) NOT NULL,
    auth_type VARCHAR(50) NOT NULL,
    auth_config JSONB,
    polling_interval INTEGER,
    status VARCHAR(50) NOT NULL,
    last_sync_time TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT domain_integration_unique UNIQUE (domain_name)
);

-- Create dashboard_alerts table for storing KPI alerts and notifications
CREATE TABLE dashboard_alerts (
    id BIGSERIAL PRIMARY KEY,
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    source_kpi_id BIGINT REFERENCES dashboard_kpis(id),
    source_metric_id BIGINT REFERENCES dashboard_metrics(id),
    threshold_value DOUBLE PRECISION,
    actual_value DOUBLE PRECISION,
    timestamp TIMESTAMP NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP,
    resolved_by VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create dashboard_users table for dashboard user preferences
CREATE TABLE dashboard_users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    preferences JSONB,
    last_login TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT username_unique UNIQUE (username),
    CONSTRAINT email_unique UNIQUE (email)
);

-- Create dashboard_widgets table for user dashboard configuration
CREATE TABLE dashboard_widgets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES dashboard_users(id),
    widget_type VARCHAR(50) NOT NULL,
    widget_name VARCHAR(100) NOT NULL,
    widget_config JSONB NOT NULL,
    position_x INTEGER NOT NULL,
    position_y INTEGER NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for improved query performance
CREATE INDEX idx_metrics_source_domain ON dashboard_metrics(source_domain);
CREATE INDEX idx_metrics_timestamp ON dashboard_metrics(timestamp);
CREATE INDEX idx_metrics_name_domain ON dashboard_metrics(metric_name, source_domain);
CREATE INDEX idx_metrics_region ON dashboard_metrics(region);

CREATE INDEX idx_kpis_name ON dashboard_kpis(kpi_name);
CREATE INDEX idx_kpis_category ON dashboard_kpis(kpi_category);
CREATE INDEX idx_kpis_status ON dashboard_kpis(kpi_status);
CREATE INDEX idx_kpis_timestamp ON dashboard_kpis(timestamp);
CREATE INDEX idx_kpis_region ON dashboard_kpis(region);

CREATE INDEX idx_reports_type ON dashboard_reports(report_type);
CREATE INDEX idx_reports_generated_at ON dashboard_reports(generated_at);
CREATE INDEX idx_reports_status ON dashboard_reports(status);

CREATE INDEX idx_alerts_timestamp ON dashboard_alerts(timestamp);
CREATE INDEX idx_alerts_resolved ON dashboard_alerts(resolved);
CREATE INDEX idx_alerts_severity ON dashboard_alerts(severity);