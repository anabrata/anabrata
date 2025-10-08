# Milk Tracker — Daily Purchase Tracking App

A lightweight, offline-first web application for tracking daily milk purchases with automatic monthly cost calculations.

## Features

- **Calendar View**: Interactive monthly calendar with visual day status
- **Daily Toggle**: Click any day to mark as "bought" or "skipped"
- **Custom Pricing**: Adjustable price per day (default ₹25)
- **Auto-Calculate**: Real-time monthly total calculation
- **History**: Browse and edit past months
- **Export/Import**: CSV export for individual months, JSON for full history
- **Offline-Ready**: All data stored locally in browser
- **Accessible**: Full keyboard navigation and screen reader support
- **Responsive**: Works on mobile, tablet, and desktop

## Quick Start

1. **Run locally**: Simply open `index.html` in any modern browser
2. **No server required**: Works completely offline once loaded
3. **No installation**: Just HTML, CSS, and vanilla JavaScript

## Usage

### Tracking Milk Purchases

- **Bought (default)**: Days with green background count toward monthly total
- **Skipped**: Click a day to mark as skipped (shows red X, grayed out)
- **Toggle**: Click again to switch back to "bought"

### Changing Price

- Use the price input in the header to change the daily rate
- Changes apply to the entire month
- Total updates automatically

### Navigation

- **Arrows**: Navigate between months
- **Dropdown**: Jump to any month/year
- **History**: View all tracked months

### Data Management

- **Clear Month**: Mark all days as skipped
- **Undo**: Revert last 10 actions
- **Export CSV**: Download current month as spreadsheet
- **Export JSON**: Download complete history
- **Import JSON**: Restore or merge data from backup

## Data Storage

**Storage Key**: `milk_tracker_history_v1`

**Structure**:
