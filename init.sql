-- Initialize the Answer Architect database

CREATE TABLE IF NOT EXISTS prompt_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    raw_input TEXT NOT NULL,
    refined_prompt TEXT NOT NULL,
    final_output TEXT NOT NULL,
    user_ip VARCHAR(45),
    model_used VARCHAR(50)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_prompt_logs_timestamp ON prompt_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_prompt_logs_user_ip ON prompt_logs(user_ip);
CREATE INDEX IF NOT EXISTS idx_prompt_logs_model_used ON prompt_logs(model_used);

-- Grant permissions
GRANT ALL PRIVILEGES ON TABLE prompt_logs TO gpt_user;
GRANT USAGE, SELECT ON SEQUENCE prompt_logs_id_seq TO gpt_user; 