#!/bin/bash

# Configuration
REPO_URL="https://github.com/sparkpixeldev/rgc.git"
BRANCH="main"

echo "========================================"
echo "    RGC Site - Sync to GitHub"
echo "========================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
fi

# Configure remote
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null)
if [ "$CURRENT_REMOTE" != "$REPO_URL" ]; then
    echo "Configuring remote origin..."
    if git remote | grep -q "^origin$"; then
        git remote set-url origin "$REPO_URL"
    else
        git remote add origin "$REPO_URL"
    fi
fi

# Fetch latest from remote
echo "Fetching latest changes from GitHub..."
git fetch origin

# Check if current branch is set to track remote
CURRENT_BRANCH=$(git branch --show-current)
if [ -z "$CURRENT_BRANCH" ]; then
    # If no branch (fresh init), create main
    git checkout -b "$BRANCH"
fi

# If we have no commits locally but remote has history, reset to match remote
# This assumes we want to apply local changes ON TOP of remote history
if ! git rev-parse HEAD >/dev/null 2>&1; then
    echo "Aligning local history with remote..."
    git reset --mixed "origin/$BRANCH"
fi

# Ensure upstream is set
git branch --set-upstream-to="origin/$BRANCH" "$BRANCH" >/dev/null 2>&1

echo "----------------------------------------"
echo "Status:"
git status -s
echo "----------------------------------------"

# Add all changes
git add -A

# Check for changes to commit
if git diff-index --quiet HEAD --; then
    echo "No local changes to commit."
else
    # Commit
    echo "Enter commit message (or press Enter for 'Update site'):"
    read -r MSG
    if [ -z "$MSG" ]; then
        MSG="Update site"
    fi
    git commit -m "$MSG"
fi

echo "Pushing to GitHub..."
git push origin "$BRANCH"

echo "========================================"
echo "    Sync Complete!"
echo "========================================"
