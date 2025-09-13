# API Examples and Test Files

This directory contains sample requests, test files, and documentation examples for the TLD Challenges API.

## Files Overview

### API Request Examples
- **`submission_request_example.json`** - Basic JSON request format for creating submissions
- **`complete_submission_api_example.json`** - Comprehensive API documentation with request/response examples and error handling
- **`frontend_submission_example.js`** - JavaScript/TypeScript function for frontend submission requests

### Testing Scripts
- **`curl_submission_example.sh`** - Command-line curl script for testing submissions
- **`test_request.ps1`** - PowerShell script for testing API requests
- **`test_rate_limit.bat`** - Batch file for testing rate limiting functionality

### Test Data
- **`test_submission.json`** - Sample JSON payload for testing submission creation

## Field Requirements

### Required Fields for Submissions:
- `runner` (string) - Player/runner name
- `challenge` (number) - Challenge ID from database
- `video_url` (string) - YouTube/Twitch video URL
- `result` (string) - Run time (e.g., "02:15:30")

### Optional Fields:
- `note` (string) - Description or notes about the run
- `runner_url` (string) - Runner's profile URL (Twitch, YouTube, etc.)

## Usage

1. **Replace `YOUR_API_TOKEN_HERE`** with your actual API token
2. **Update challenge IDs** to match your database
3. **Customize sample data** as needed for testing

## Notes

- Rate limiting is disabled in development mode (`DISABLE_RATE_LIMIT=true` in `.env`)
- All submissions are created as drafts and require admin approval to be published
- Test files are designed for the development environment