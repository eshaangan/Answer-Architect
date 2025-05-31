#!/usr/bin/env python3
"""
Startup script for the GPT Wrapper API
"""

import os
import sys
import subprocess
from pathlib import Path

def check_env_file():
    """Check if .env file exists and create from template if not"""
    env_file = Path(".env")
    env_example = Path("env.example")
    
    if not env_file.exists() and env_example.exists():
        print("📝 Creating .env file from template...")
        env_file.write_text(env_example.read_text())
        print("⚠️  Please edit .env file with your OpenAI API key and other settings")
        return False
    elif not env_file.exists():
        print("❌ No .env file found. Please create one with your configuration.")
        return False
    
    return True

def check_dependencies():
    """Check if dependencies are installed"""
    try:
        import fastapi
        import openai
        import uvicorn
        return True
    except ImportError:
        print("📦 Installing dependencies...")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        return True

def main():
    """Main startup function"""
    print("🚀 Starting GPT Wrapper API")
    
    # Check environment
    if not check_env_file():
        return
    
    # Check dependencies
    check_dependencies()
    
    # Load environment variables
    try:
        from dotenv import load_dotenv
        load_dotenv()
    except ImportError:
        pass
    
    # Check for OpenAI API key
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ OPENAI_API_KEY not found in environment variables")
        print("Please set your OpenAI API key in the .env file")
        return
    
    print("✅ Environment configured")
    print("🌐 Starting server on http://localhost:8000")
    print("📚 API docs available at http://localhost:8000/docs")
    
    # Start the server
    try:
        import uvicorn
        uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped")

if __name__ == "__main__":
    main() 