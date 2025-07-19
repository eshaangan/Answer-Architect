# Answer Architect API

A sophisticated AI system that refines user prompts internally before generating responses, providing enhanced AI interactions through intelligent prompt engineering.

## Features

- **Intelligent Prompt Refinement**: Automatically enhances user prompts for better AI responses
- **Rate Limiting**: Built-in protection against API abuse
- **Analytics**: Track usage and performance metrics
- **Mock Mode**: Test without consuming API credits
- **Health Monitoring**: Built-in health checks and status endpoints

## Future Features 🚀

### 🔐 Authentication & User Management
- **User Registration & Login**: Secure user accounts with email/password authentication
- **OAuth Integration**: Sign in with Google, GitHub, or other providers
- **Role-Based Access**: Different permission levels (Free, Pro, Enterprise)
- **API Key Management**: Generate and manage personal API keys
- **Two-Factor Authentication**: Enhanced security with 2FA support

### 💬 Chat & Conversation Features
- **Chat History**: Persistent conversation threads and message history
- **Conversation Management**: Save, organize, and search past conversations
- **Real-time Chat**: WebSocket support for live chat interactions
- **Shared Conversations**: Share conversations with team members or publicly
- **Conversation Templates**: Pre-built conversation starters and prompts

### 🎨 Enhanced AI Capabilities
- **Multi-Modal Support**: Image, audio, and document processing
- **Model Comparison**: Side-by-side comparison of different AI models
- **Prompt Library**: Curated collection of effective prompts
- **Prompt Versioning**: Track and manage prompt improvements over time
- **Batch Processing**: Process multiple prompts simultaneously

### 📊 Advanced Analytics & Insights
- **Usage Analytics**: Detailed insights into API usage patterns
- **Cost Tracking**: Monitor and optimize API costs
- **Performance Metrics**: Response time and quality analytics
- **User Behavior Analysis**: Understand how users interact with the system
- **A/B Testing**: Test different prompt strategies
- **Custom Dashboards**: Personalized analytics views

### 🔒 Enterprise Features
- **Single Sign-On (SSO)**: Integration with enterprise identity providers
- **Audit Logging**: Comprehensive audit trails for compliance
- **Data Residency**: Control over data storage locations

### 🤖 AI Model Management
- **Model Performance Tracking**: Monitor and compare model performance
- **Automatic Model Selection**: Choose the best model for each task
- **Model Cost Optimization**: Balance performance and cost

### 📈 Scalability & Performance
- **Auto-scaling**: Automatic resource scaling based on demand
- **Load Balancing**: Distribute traffic across multiple servers
- **Caching Layer**: Intelligent caching for improved performance
- **Database Optimization**: Advanced database indexing and query optimization

## Quick Start

### Prerequisites

- Python 3.8+
- OpenAI API key
- PostgreSQL (optional, for analytics)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/eshaangan/answer-architect.git
   cd answer-architect
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment**
   ```bash
   cp env.example .env
   # Edit .env with your OpenAI API key
   ```

4. **Run the application**
   ```bash
   python start.py
   ```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- **Interactive Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## Configuration

### Environment Variables

Create a `.env` file with:

```env
OPENAI_API_KEY=your_openai_api_key_here
MODEL_NAME=gpt-4o-mini
MOCK_MODE=false
RATE_LIMIT_PER_MINUTE=60
DATABASE_URL=postgresql://username:password@localhost:5432/answer_architect
```

### Database Setup (Optional)

For analytics features:

```sql
-- Run init.sql in your PostgreSQL database
psql -d your_database -f init.sql
```

## Usage

### Basic Prompt

```bash
curl -X POST "http://localhost:8000/prompt" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain quantum computing"}'
```

### With Authentication

```bash
curl -X POST "http://localhost:8000/prompt" \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain quantum computing"}'
```

## Development

### Running Tests

```bash
python test_api.py
```

### Project Structure

```
answer-architect/
├── app/
│   ├── main.py          # FastAPI application
│   ├── gpt_service.py   # GPT interaction logic
│   ├── config.py        # Configuration management
│   └── analytics.py     # Analytics tracking
├── frontend/            # React frontend
├── start.py            # Startup script
├── requirements.txt    # Python dependencies
└── README.md          # This file
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Roadmap

- [ ] User authentication system
- [ ] Chat history and conversation management
- [ ] Real-time chat with WebSocket support
- [ ] Mobile application development
- [ ] Enterprise features and SSO integration
- [ ] Advanced analytics and reporting
- [ ] Multi-modal AI support
- [ ] Custom model fine-tuning

## License

MIT License - see LICENSE file for details 