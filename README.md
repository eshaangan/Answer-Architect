# GPT Wrapper API

A sophisticated GPT wrapper system that refines user prompts internally before generating responses, providing enhanced AI interactions through intelligent prompt engineering.

## 🚀 Features

### Core Functionality
- **Two-Stage Processing**: User input → GPT refinement → Final GPT response
- **Intelligent Prompt Refinement**: Automatically improves vague or informal prompts
- **Clean API**: Returns only final answers to users (debug mode available)
- **Multiple Model Support**: Configurable GPT models for different stages

### Production Features
- **Authentication**: Bearer token security
- **Rate Limiting**: Configurable per-minute limits with IP tracking
- **Database Logging**: PostgreSQL with graceful file fallback
- **Performance Monitoring**: Request timing and analytics
- **Health Monitoring**: Real-time API status and uptime tracking
- **Mock Mode**: Testing without OpenAI API consumption

### User Interface
- **Modern React Frontend**: Clean, responsive design with Tailwind CSS
- **Real-time Status**: API health monitoring
- **Debug Mode**: Toggle to view prompt refinement process
- **Analytics Dashboard**: Usage statistics and performance metrics
- **Example Prompts**: Quick-start suggestions
- **Performance Metrics**: Response timing display
- **Response Styles**: Choose from concise, detailed, casual, professional, educational, or balanced tones

## 🏗️ Architecture

```
User Input → Prompt Refinement (GPT) → Final Response (GPT) → User
                     ↓
            Logging & Analytics Database
```

## 📦 Installation

### Quick Start (Development)
```bash
# Clone and setup
git clone <repository>
cd gpt-wrapper

# Backend setup
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Frontend setup
cd frontend
npm install
cd ..

# Configure environment
cp env.example .env
# Edit .env with your OpenAI API key and settings

# Start development servers
python start.py  # Backend on :8000
cd frontend && npm start  # Frontend on :3000
```

## ⚙️ Configuration

### Environment Variables
```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Database (Optional - uses file logging if not provided)
DATABASE_URL=postgresql://username:password@localhost:5432/gpt_wrapper

# Security
API_SECRET_KEY=your_secret_key_here

# Rate Limiting
RATE_LIMIT_PER_MINUTE=10

# Model Configuration
DEFAULT_MODEL=gpt-4o-mini
REFINEMENT_MODEL=gpt-4o-mini

# Development/Testing
MOCK_MODE=false
```

## 🔌 API Endpoints

### Main Endpoints
- `POST /prompt` - Submit prompt, get refined response
- `POST /prompt/debug` - Debug mode with full pipeline visibility
- `GET /health` - Health check with uptime
- `GET /analytics/stats` - Usage analytics (requires auth)

### Authentication
All endpoints require Bearer token authentication:
```bash
curl -H "Authorization: Bearer your_secret_key_here" \
     -H "Content-Type: application/json" \
     -d '{"text": "explain machine learning", "style": "concise"}' \
     http://localhost:8000/prompt
```

## 📊 Analytics & Monitoring

### Available Metrics
- Total requests processed
- Requests in last 24 hours
- Unique users (by IP)
- Model usage statistics
- System uptime
- Response timing (refinement + generation)

### Performance Tracking
- Processing time breakdown
- Mock vs live mode indicators
- Real-time health status
- Database connection status

## 🛠️ Development

### Project Structure
```
├── app/                    # Backend FastAPI application
│   ├── main.py            # API endpoints and routing
│   ├── gpt_service.py     # OpenAI integration with timing
│   ├── config.py          # Environment configuration
│   ├── database.py        # PostgreSQL logging with fallback
│   ├── auth.py            # Bearer token authentication
│   ├── rate_limiter.py    # IP-based rate limiting
│   └── models.py          # Pydantic request/response models
├── frontend/              # React TypeScript frontend
│   ├── src/components/    # React components
│   ├── src/services/      # API service layer
│   └── src/types/         # TypeScript interfaces
├── requirements.txt      # Python dependencies
```

### Running Tests
```bash
# Backend tests
python -m pytest

# Frontend tests
cd frontend && npm test
```

### Mock Mode
Enable mock mode for development without consuming OpenAI credits:
```bash
# In .env file
MOCK_MODE=true
```

Mock mode provides realistic responses with simulated processing times.

## 🚀 Deployment Options

### Manual Deployment
```bash
# Backend
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Frontend
cd frontend && npm run build && npm run serve
```

### Cloud Deployment
- AWS ECS/Fargate ready
- Google Cloud Run compatible
- Heroku deployment supported
- Kubernetes manifests available

## 📈 Monitoring & Observability

### Health Checks
- `/health` endpoint with uptime
- Database connection status
- OpenAI API connectivity
- Real-time frontend status indicator

### Logging
- Structured JSON logging
- Request/response tracking
- Error monitoring
- Performance metrics

## 🔒 Security

### Authentication
- Bearer token authentication
- Configurable API keys
- IP-based rate limiting
- Request validation

### Best Practices
- Environment variable configuration
- Secure database connections
- CORS configuration
- Input sanitization

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check the documentation
- Review the API docs at `/docs` 