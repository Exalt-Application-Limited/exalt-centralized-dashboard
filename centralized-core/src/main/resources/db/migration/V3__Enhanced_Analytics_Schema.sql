-- Migration to add tables for enhanced domain analytics

-- Create cross_domain_insights table for storing cross-domain correlations and insights
CREATE TABLE cross_domain_insights (
    id BIGSERIAL PRIMARY KEY,
    insight_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    source_domains TEXT[] NOT NULL,  -- Array of domain names
    related_metrics TEXT[],          -- Array of metric names
    status VARCHAR(50) DEFAULT 'ACTIVE',
    actionable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create correlation_results table for storing detailed correlation data
CREATE TABLE correlation_results (
    id BIGSERIAL PRIMARY KEY,
    insight_id BIGINT REFERENCES cross_domain_insights(id),
    entity_name VARCHAR(100) NOT NULL,
    score DOUBLE PRECISION NOT NULL,
    total_value DOUBLE PRECISION,
    component_one_percent DOUBLE PRECISION,
    component_two_percent DOUBLE PRECISION,
    component_three_percent DOUBLE PRECISION,
    correlation_strength VARCHAR(50),
    timestamp TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create trend_data table for storing time-series trend information
CREATE TABLE trend_data (
    id BIGSERIAL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    source_domain VARCHAR(50) NOT NULL,
    trend_direction VARCHAR(50) NOT NULL,
    trend_value DOUBLE PRECISION NOT NULL,
    significance DOUBLE PRECISION,
    period_start TIMESTAMP NOT NULL,
    period_end TIMESTAMP NOT NULL,
    data_points JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create enhanced_analytics_config table for configuration settings
CREATE TABLE enhanced_analytics_config (
    id BIGSERIAL PRIMARY KEY,
    domain VARCHAR(50) NOT NULL,
    config_key VARCHAR(100) NOT NULL,
    config_value TEXT NOT NULL,
    data_type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT domain_config_unique UNIQUE (domain, config_key)
);

-- Create indexes for improved query performance
CREATE INDEX idx_insights_type ON cross_domain_insights(insight_type);
CREATE INDEX idx_insights_severity ON cross_domain_insights(severity);
CREATE INDEX idx_insights_timestamp ON cross_domain_insights(timestamp);
CREATE INDEX idx_insights_status ON cross_domain_insights(status);

CREATE INDEX idx_correlation_insight_id ON correlation_results(insight_id);
CREATE INDEX idx_correlation_entity_name ON correlation_results(entity_name);
CREATE INDEX idx_correlation_score ON correlation_results(score);

CREATE INDEX idx_trend_metric_name ON trend_data(metric_name);
CREATE INDEX idx_trend_entity_id ON trend_data(entity_id);
CREATE INDEX idx_trend_source_domain ON trend_data(source_domain);
CREATE INDEX idx_trend_direction ON trend_data(trend_direction);
CREATE INDEX idx_trend_period ON trend_data(period_start, period_end);

-- Define data type constants
DO $$
DECLARE
    double_type CONSTANT TEXT := 'DOUBLE';
    integer_type CONSTANT TEXT := 'INTEGER';
BEGIN
    -- Insert default configuration settings
    INSERT INTO enhanced_analytics_config 
        (domain, config_key, config_value, data_type, description)
    VALUES 
        ('ALL', 'correlation_threshold', '0.7', double_type, 'Minimum correlation coefficient to consider as significant'),
        ('ALL', 'trend_significance_threshold', '0.6', double_type, 'Minimum trend significance to consider'),
        ('ALL', 'default_analysis_period_days', '30', integer_type, 'Default period in days for historical trend analysis'),
        ('SOCIAL_COMMERCE', 'product_trend_threshold', '0.8', double_type, 'Threshold for trending product detection'),
        ('WAREHOUSING', 'inventory_alert_threshold', '20.0', double_type, 'Low inventory percentage threshold for alerts'),
        ('COURIER_SERVICES', 'delivery_performance_threshold', '85.0', double_type, 'Minimum acceptable on-time delivery percentage');
END $$;
