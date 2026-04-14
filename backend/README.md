# Wira Backend

FastAPI backend with Claude AI matching and Supabase database.

## Setup

1. Install dependencies:
   pip install -r requirements.txt

2. Copy `.env.example` to `.env` and fill in your keys:
   - ANTHROPIC_API_KEY — from console.anthropic.com
   - SUPABASE_URL — from supabase.com project settings
   - SUPABASE_SERVICE_KEY — service_role key (not anon key)
   - JWT_SECRET — from Supabase > Settings > API > JWT Secret

3. Run the database schema in Supabase SQL editor:
   Copy and paste supabase_schema.sql

4. Start the server:
   uvicorn main:app --reload --port 8000

API docs available at: http://localhost:8000/docs

## Deploy to Railway

1. Connect this repo to Railway
2. Set root directory to /backend
3. Add all environment variables
4. Deploy — Railway auto-detects Python and runs uvicorn
