# Answer Architect API

A sophisticated AI system that refines user prompts internally before generating responses, providing enhanced AI interactions through intelligent prompt engineering.

## Features

- **Intelligent Prompt Refinement**: Automatically enhances user prompts for better AI responses
- **Rate Limiting**: Built-in protection against API abuse
- **Analytics**: Track usage and performance metrics
- **Mock Mode**: Test without consuming API credits
- **Health Monitoring**: Built-in health checks and status endpoints

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

## License

MIT License - see LICENSE file for details 