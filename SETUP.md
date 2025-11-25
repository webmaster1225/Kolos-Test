# Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- Airtable account (free tier works)
- (Optional) Retell AI account for audio calls

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Airtable Setup

1. Go to [Airtable](https://airtable.com) and create a new base
2. Create a table named **"Members"**
3. Add these fields:
   - `Name` - Single line text
   - `Role` - Single line text  
   - `Industries` - Multiple select (or Multiple record links)
   - `Regions` - Multiple select (or Multiple record links)
   - `Goals` - Long text
   - `CheckSize` - Single line text
   - `CapitalRole` - Single line text
   - `CreatedAt` - Date (with time)

4. Get your credentials:
   - **API Key**: Go to https://airtable.com/account → Personal access tokens
   - **Base ID**: Open your base → Help → API documentation → Base ID

### 3. Environment Variables

Create `.env.local` file:

```env
AIRTABLE_API_KEY=patxxxxxxxxxxxxx
AIRTABLE_BASE_ID=appxxxxxxxxxxxxx
AIRTABLE_TABLE_NAME=Members
```

### 4. (Optional) Retell AI Setup

1. Sign up at [Retell AI](https://retell.ai)
2. Create an agent
3. Configure the agent to ask these questions:
   - What is your name?
   - What is your role or position?
   - What industries are you interested in?
   - What regions are you targeting?
   - What are your investment goals?
   - What is your target check size?
   - What capital role are you seeking?
4. Set webhook URL: `https://your-domain.com/api/webhook/retell`
5. Add to `.env.local`:
```env
RETELL_API_KEY=your_retell_api_key
RETELL_AGENT_ID=your_agent_id
NEXT_PUBLIC_RETELL_AGENT_ID=your_agent_id
```

### 5. Run the App

```bash
npm run dev
```

Visit http://localhost:3000

### 6. Test the Flow

**Option A: Test Flow (No Audio)**
1. Go to http://localhost:3000/test
2. Fill out the form
3. Submit
4. View dashboard

**Option B: Audio Call (Requires Retell)**
1. Go to http://localhost:3000/call
2. Click "Start Call"
3. Answer questions
4. View dashboard after call ends

## Troubleshooting

**"No member data found"**
- Make sure you've submitted data via /test or completed an audio call
- Check Airtable to verify data was saved

**Airtable errors**
- Verify API key has access to your base
- Check field names match exactly (case-sensitive)
- Ensure table name is "Members"

**Retell not working**
- Verify NEXT_PUBLIC_RETELL_AGENT_ID is set
- Check browser console for errors
- Ensure webhook URL is publicly accessible (use ngrok for local testing)

## Local Testing with Webhooks

For local Retell webhook testing, use ngrok:

```bash
ngrok http 3000
```

Then use the ngrok URL in Retell webhook configuration:
`https://your-ngrok-url.ngrok.io/api/webhook/retell`

