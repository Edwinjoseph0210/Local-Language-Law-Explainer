# Local Language Law Explainer

An AI-powered tool to simplify complex legal texts into easy-to-understand summaries in regional Indian languages, with optional voice output.

## Features
- Accepts raw legal text (paste or upload)
- Summarizes using OpenAI/GPT (via LangChain)
- Translates to Hindi, Malayalam, Tamil, etc. (Google Cloud Translation)
- Optional voice output (gTTS)
- Simple frontend with Indian language font support

## Backend (FastAPI)

### Setup
1. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set environment variables:
   - `OPENAI_API_KEY` (for OpenAI)
   - `GOOGLE_APPLICATION_CREDENTIALS` (path to your Google Cloud service account JSON)
4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

## Frontend (React)

### Setup
1. Go to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Usage
- Access the frontend at `http://localhost:3000`
- Backend runs at `http://localhost:8000`

## Notes
- Ensure your OpenAI and Google Cloud credentials are set up correctly.
- For TTS, supported language codes: `hi` (Hindi), `ml` (Malayalam), `ta` (Tamil), etc.

---

MIT License