#!/bin/bash

# ============================================================================
# Materialized Views Refresh Script
# ============================================================================
#
# Purpose: Refresh all materialized views for dashboard performance
# Execution time: 3-5 minutes for 200K participants
# Recommended schedule: Every 2-4 hours via cron
#
# Cron setup:
# crontab -e
# Add line: 0 */3 * * * /path/to/backend-quran-js/scripts/refresh-materialized-views.sh
#
# ============================================================================

# Configuration - Update these values for your environment
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-quran_assessment}"
DB_USER="${DB_USER:-postgres}"

# Optional: Use .env file for database credentials
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

if [ -f "$PROJECT_ROOT/.env" ]; then
    export $(grep -v '^#' "$PROJECT_ROOT/.env" | xargs)
fi

# Log file
LOG_FILE="$PROJECT_ROOT/logs/materialized-views-refresh.log"
mkdir -p "$(dirname "$LOG_FILE")"

# ============================================================================
# Functions
# ============================================================================

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

refresh_view() {
    local view_name=$1
    local start_time=$(date +%s)

    log_message "Refreshing $view_name..."

    # Use CONCURRENTLY to avoid blocking reads
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
        -c "REFRESH MATERIALIZED VIEW CONCURRENTLY $view_name;" \
        2>&1 | tee -a "$LOG_FILE"

    local exit_code=${PIPESTATUS[0]}
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    if [ $exit_code -eq 0 ]; then
        log_message "✓ $view_name refreshed successfully in ${duration}s"
        return 0
    else
        log_message "✗ Failed to refresh $view_name (exit code: $exit_code)"
        return 1
    fi
}

# ============================================================================
# Main Execution
# ============================================================================

log_message "========================================"
log_message "Starting materialized views refresh"
log_message "Database: $DB_NAME@$DB_HOST:$DB_PORT"
log_message "========================================"

# Check if database is accessible
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
    -c "SELECT 1;" > /dev/null 2>&1

if [ $? -ne 0 ]; then
    log_message "✗ ERROR: Cannot connect to database"
    log_message "Please check database credentials and connection"
    exit 1
fi

log_message "✓ Database connection successful"

# Refresh all materialized views
total_start=$(date +%s)
failed_views=0

refresh_view "mv_dashboard_statistics" || ((failed_views++))
refresh_view "mv_scores_by_province" || ((failed_views++))
refresh_view "mv_scores_by_education" || ((failed_views++))

total_end=$(date +%s)
total_duration=$((total_end - total_start))

# Summary
log_message "========================================"
log_message "Refresh completed in ${total_duration}s"

if [ $failed_views -eq 0 ]; then
    log_message "✓ All views refreshed successfully"
    log_message "========================================"
    exit 0
else
    log_message "✗ $failed_views view(s) failed to refresh"
    log_message "Check log for details: $LOG_FILE"
    log_message "========================================"
    exit 1
fi
