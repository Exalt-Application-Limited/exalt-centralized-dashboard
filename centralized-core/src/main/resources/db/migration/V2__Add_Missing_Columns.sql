-- Migration to add missing columns to dashboard_kpis table

-- Add domain and source_domain columns to dashboard_kpis table
ALTER TABLE dashboard_kpis ADD COLUMN IF NOT EXISTS domain VARCHAR(100);
ALTER TABLE dashboard_kpis ADD COLUMN IF NOT EXISTS source_domain VARCHAR(50);

-- Create an index on the new source_domain column
CREATE INDEX IF NOT EXISTS idx_kpis_source_domain ON dashboard_kpis(source_domain);

-- Add metadata column to dashboard_metrics for storing JSON data
ALTER TABLE dashboard_metrics ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Update existing records with default values if needed
-- Using more efficient patterns to avoid full table scans
UPDATE dashboard_kpis 
SET source_domain = 'SOCIAL_COMMERCE' 
WHERE source_domain IS NULL AND (domain = 'social' OR domain LIKE 'social%' OR domain LIKE 'ecommerce%' OR domain LIKE 'commerce%');

UPDATE dashboard_kpis 
SET source_domain = 'WAREHOUSING' 
WHERE source_domain IS NULL AND (domain = 'warehouse' OR domain LIKE 'warehouse%' OR domain LIKE 'inventory%' OR domain LIKE 'stock%');

UPDATE dashboard_kpis 
SET source_domain = 'COURIER_SERVICES' 
WHERE source_domain IS NULL AND (domain = 'courier' OR domain LIKE 'courier%' OR domain LIKE 'delivery%' OR domain LIKE 'shipping%');
