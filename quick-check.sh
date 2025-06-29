#!/bin/bash

echo "🚀 QUICK PRE-PUSH VALIDATION"
echo "============================"

ERRORS=0

# Quick YAML syntax check
echo "📄 Checking YAML syntax..."
for file in .github/workflows/*.yml .github/workflows/*.yaml; do
    if [ -f "$file" ]; then
        if ! python3 -c "import yaml; yaml.safe_load(open('$file'))" 2>/dev/null; then
            echo "❌ YAML Error in: $file"
            ((ERRORS++))
        else
            echo "✅ $file"
        fi
    fi
done

# Quick duplicate needs check
echo ""
echo "🔍 Checking for duplicate needs..."
for file in .github/workflows/*.yml .github/workflows/*.yaml; do
    if [ -f "$file" ]; then
        duplicates=$(grep -n "needs:" "$file" | uniq -d)
        if [ ! -z "$duplicates" ]; then
            echo "❌ Potential duplicate needs in: $file"
            echo "$duplicates"
            ((ERRORS++))
        fi
    fi
done

echo ""
if [ $ERRORS -eq 0 ]; then
    echo "🎉 All checks passed! Safe to push."
    exit 0
else
    echo "💥 Found $ERRORS issues. Please fix before pushing."
    echo "💡 Run './validate-workflows.sh' for detailed analysis."
    exit 1
fi