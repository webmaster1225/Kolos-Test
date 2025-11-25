# Kolos AI Assistant

A complete system for AI-powered audio conversations that collect member information and generate personalized investment signals.

## Overview

This application provides:
1. **AI Audio Assistant** - Interactive voice conversation using Retell AI that asks 6-10 questions about role, industries, regions, goals, etc.
2. **Data Storage** - Structured data storage in Airtable
3. **Member Dashboard** - Beautiful dashboard displaying member profiles with name, role, tags, goals, etc.
4. **Kolos Signals** - AI-generated investment opportunities (2-3 signals per member) with relevance scoring

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Audio AI**: Retell AI
- **Database**: Airtable
- **Deployment**: Vercel (recommended)

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd KolosTest
npm install
```

### 2. Configure Airtable

1. Create an Airtable base
2. Create a table named "Members" with the following fields:
   - `Name` (Single line text)
   - `Role` (Single line text)
   - `Industries` (Multiple select or Multiple record links)
   - `Regions` (Multiple select or Multiple record links)
   - `Goals` (Long text)
   - `CheckSize` (Single line text)
   - `CapitalRole` (Single line text)
   - `CreatedAt` (Date)

3. Get your Airtable API key from [Airtable Account](https://airtable.com/account)
4. Get your Base ID from the Airtable API documentation

### 3. Configure Retell AI (Optional - for audio calls)

1. Sign up at [Retell AI](https://retell.ai)
2. Create an agent with a conversation flow that asks 6-10 questions
3. Configure the webhook URL to point to: `https://your-domain.com/api/webhook/retell`
4. Get your API key and Agent ID

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Airtable Configuration
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_airtable_base_id_here
AIRTABLE_TABLE_NAME=Members

# Retell AI Configuration (Optional)
RETELL_API_KEY=your_retell_api_key_here
RETELL_AGENT_ID=your_retell_agent_id_here
NEXT_PUBLIC_RETELL_AGENT_ID=your_retell_agent_id_here
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Data Flow

### Audio Call Flow (Retell AI)
1. User clicks "Start Audio Call" on the home page
2. Retell AI widget initializes and starts a conversation
3. AI asks 6-10 questions about:
   - Name
   - Role/Position
   - Industries of interest
   - Target regions
   - Investment goals
   - Check size
   - Preferred capital role
4. When conversation ends, Retell sends webhook to `/api/webhook/retell`
5. Webhook extracts structured data from transcript
6. Data is saved to Airtable
7. Signals are generated based on member data
8. User is redirected to dashboard

### Test Flow (No Audio Required)
1. User clicks "Test Flow" on the home page
2. User fills out a form with member information
3. Data is submitted to `/api/test/save-member`
4. Data is saved to Airtable
5. Signals are generated
6. User is redirected to dashboard

### Dashboard Flow
1. Dashboard loads and fetches the most recent member from Airtable
2. Member profile is displayed with all collected information
3. Signals are generated on-demand using the member's data
4. 2-3 signals are displayed with:
   - Date, type, headline
   - Check size focus, capital role
   - Why it fits, what to pitch
   - Next steps
   - Relevance scores (R/O/A) and overall score

## Signals Generation

Signals are currently generated using simple rule-based logic in `lib/airtable.ts`. The system:
- Analyzes member's industries, regions, goals, and check size
- Generates 2-3 relevant opportunities
- Scores each signal on:
  - **R** (Relevance): 1-5
  - **O** (Opportunity Window): 1-5
  - **A** (Actionability): 1-5
- Calculates overall score (average of R, O, A)

**Future Enhancement**: Replace rule-based logic with AI API call (OpenAI, Anthropic, etc.) for more sophisticated signal generation.

## Project Structure

```
KolosTest/
├── app/
│   ├── api/
│   │   ├── members/          # GET member data
│   │   ├── signals/           # GET generated signals
│   │   ├── test/
│   │   │   └── save-member/  # POST test member data
│   │   └── webhook/
│   │       └── retell/       # POST Retell webhook handler
│   ├── call/                 # Audio call page
│   ├── dashboard/            # Member dashboard
│   ├── test/                 # Test flow page
│   ├── layout.tsx
│   ├── page.tsx              # Home page
│   └── globals.css
├── lib/
│   └── airtable.ts           # Airtable integration & signal generation
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## API Endpoints

### `GET /api/members`
Get all members or a specific member by ID.

**Query Parameters:**
- `id` (optional): Member ID

### `GET /api/signals?memberId={id}`
Generate signals for a specific member.

**Query Parameters:**
- `memberId` (required): Member ID

### `POST /api/test/save-member`
Save test member data (for testing without Retell).

**Body:**
```json
{
  "name": "John Doe",
  "role": "Real Estate Developer",
  "industries": ["Real Estate", "Technology"],
  "regions": ["North America"],
  "goals": "Build commercial real estate portfolio",
  "checkSize": "$5M",
  "capitalRole": "Co-GP"
}
```

### `POST /api/webhook/retell`
Webhook endpoint for Retell AI to send conversation data.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## Testing

1. **Test Flow**: Use `/test` page to submit member data without audio
2. **Audio Flow**: Use `/call` page with Retell AI configured
3. **Dashboard**: View results at `/dashboard`

## Future Enhancements

- [ ] Replace rule-based signal generation with AI API
- [ ] Add more sophisticated transcript parsing
- [ ] Implement user authentication
- [ ] Add multiple member profiles
- [ ] Enhance signal generation with real-time data
- [ ] Add email notifications for new signals
- [ ] Implement signal filtering and sorting

## Troubleshooting

### Airtable Errors
- Verify API key and Base ID are correct
- Ensure table name matches `AIRTABLE_TABLE_NAME` (default: "Members")
- Check that all required fields exist in Airtable

### Retell AI Not Working
- Verify `NEXT_PUBLIC_RETELL_AGENT_ID` is set
- Check Retell webhook configuration
- Ensure webhook URL is publicly accessible

### Signals Not Generating
- Verify member data exists in Airtable
- Check that member has industries/regions filled
- Review browser console for errors

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

