from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import os
import tempfile
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from google.cloud import translate_v2 as translate
from gtts import gTTS
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class SummarizeRequest(BaseModel):
    text: str

class TranslateRequest(BaseModel):
    text: str
    target_language: str

class TTSRequest(BaseModel):
    text: str
    language: str

# Summarization endpoint
@app.post("/summarize")
def summarize(request: SummarizeRequest):
    prompt = PromptTemplate(
        input_variables=["text"],
        template="""
        Simplify the following legal text into plain, easy-to-understand language for the general public:
        {text}
        """
    )
    llm = OpenAI()
    summary = llm(prompt.format(text=request.text))
    return {"summary": summary.strip()}

# Translation endpoint
@app.post("/translate")
def translate_text(request: TranslateRequest):
    client = translate.Client()
    result = client.translate(request.text, target_language=request.target_language)
    return {"translated_text": result["translatedText"]}

# TTS endpoint
@app.post("/tts")
def text_to_speech(request: TTSRequest):
    tts = gTTS(text=request.text, lang=request.language)
    temp_dir = tempfile.gettempdir()
    filename = f"tts_{uuid.uuid4().hex}.mp3"
    filepath = os.path.join(temp_dir, filename)
    tts.save(filepath)
    return FileResponse(filepath, media_type="audio/mpeg", filename=filename)

# File upload endpoint
@app.post("/upload")
def upload_file(file: UploadFile = File(...)):
    content = file.file.read().decode("utf-8")
    return {"text": content} 