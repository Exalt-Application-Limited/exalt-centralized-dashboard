#!/bin/bash

echo "🔍 APPLYING JULE'S PROVEN METHODOLOGY TO CENTRALIZED-DASHBOARD"
echo "=============================================================="
echo ""

# Following Jule's exact approach that worked for shared-infrastructure & shared-libraries
echo "📋 Step 1: Workflow Analysis (Following proven approach)"

# Count workflows  
workflow_count=$(find . -name "*.yml" -path "*/.github/workflows/*" | wc -l)
echo "  📄 Total workflow files found: $workflow_count"

echo ""
echo "📋 Step 2: Critical Issue Detection"

CRITICAL_ISSUES=0
WARNINGS=0

# Check for missing job dependencies (most critical issue)
echo "  🔍 Checking for missing job dependencies..."
for workflow in $(find . -name "*.yml" -path "*/.github/workflows/*"); do
    # Check if build job needs test job that doesn't exist
    if grep -q "needs: test" "$workflow" && ! grep -q "^  test:" "$workflow"; then
        echo "    ❌ CRITICAL: Missing test job dependency in $(basename $(dirname $workflow))/$(basename $workflow)"
        ((CRITICAL_ISSUES++))
    fi
    
    # Check for non-existent job references
    if grep -q "needs:.*code-quality" "$workflow" && ! grep -q "^  code-quality:" "$workflow"; then
        echo "    ❌ CRITICAL: Missing code-quality job dependency in $(basename $(dirname $workflow))/$(basename $workflow)"
        ((CRITICAL_ISSUES++))
    fi
done

# Check for branch name issues (develop -> dev)
echo "  🌿 Checking branch references..."
develop_refs=$(find . -name "*.yml" -path "*/.github/workflows/*" -exec grep -l "develop" {} \; 2>/dev/null | wc -l)
if [ $develop_refs -gt 0 ]; then
    echo "    ⚠️  WARNING: $develop_refs files reference 'develop' branch (should be 'dev')"
    ((WARNINGS++))
    echo "    Files with 'develop' references:"
    find . -name "*.yml" -path "*/.github/workflows/*" -exec grep -l "develop" {} \; 2>/dev/null | head -5
fi

# Check for deprecated actions
echo "  📦 Checking for deprecated actions..."
deprecated_actions=$(find . -name "*.yml" -path "*/.github/workflows/*" -exec grep -l "actions/upload-artifact@v3\|actions/checkout@v3\|actions/setup-java@v3" {} \; 2>/dev/null | wc -l)
if [ $deprecated_actions -gt 0 ]; then
    echo "    ⚠️  WARNING: $deprecated_actions files use deprecated action versions"
    ((WARNINGS++))
fi

# Check YAML syntax
echo "  📄 Checking YAML syntax..."
syntax_errors=0
for workflow in $(find . -name "*.yml" -path "*/.github/workflows/*"); do
    if ! python3 -c "import yaml; yaml.safe_load(open('$workflow'))" 2>/dev/null; then
        echo "    ❌ CRITICAL: YAML syntax error in $(basename $(dirname $workflow))/$(basename $workflow)"
        ((CRITICAL_ISSUES++))
        ((syntax_errors++))
    fi
done

if [ $syntax_errors -eq 0 ]; then
    echo "    ✅ All workflow files have valid YAML syntax"
fi

# Check for UTF-8 BOM issues
echo "  🔤 Checking for UTF-8 BOM characters..."
bom_files=$(find . -name "*.yml" -path "*/.github/workflows/*" -exec file {} \; | grep -c "with BOM" || echo 0)
if [ $bom_files -gt 0 ]; then
    echo "    ⚠️  WARNING: $bom_files files contain UTF-8 BOM characters"
    ((WARNINGS++))
fi

echo ""
echo "📊 ANALYSIS RESULTS (Following Jule's format)"
echo "============================================="
echo "Workflows analyzed: $workflow_count"
echo "Critical issues found: $CRITICAL_ISSUES"  
echo "Warnings found: $WARNINGS"

if [ $CRITICAL_ISSUES -eq 0 ]; then
    echo ""
    echo "🎉 STATUS: GREEN ✅"
    echo "   Workflow files are structurally sound with correct syntax"
    echo "   Ready for GitHub Actions execution"
else
    echo ""
    echo "💥 STATUS: RED ❌"
    echo "   Critical fixes needed before workflows can run successfully"
fi

echo ""
echo "📋 Next Steps (Based on proven methodology):"
if [ $CRITICAL_ISSUES -eq 0 ]; then
    if [ $WARNINGS -gt 0 ]; then
        echo "1. Fix $WARNINGS warnings for optimization"
        echo "2. Test push to verify GREEN status"
    else
        echo "1. Repository is ready - no fixes needed"
        echo "2. Test push to verify GitHub Actions status"
    fi
else
    echo "1. Fix $CRITICAL_ISSUES critical issues"
    echo "2. Fix $WARNINGS warnings" 
    echo "3. Re-run analysis to confirm GREEN status"
fi