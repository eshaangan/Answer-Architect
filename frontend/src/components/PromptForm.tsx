import React, { useState } from 'react';
import { apiService } from '../services/api';
import { PromptResponse, DebugPromptResponse } from '../types/api';

interface PromptFormProps {
  onResponse: (response: PromptResponse | DebugPromptResponse) => void;
  onError: (error: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const PromptForm: React.FC<PromptFormProps> = ({
  onResponse,
  onError,
  isLoading,
  setIsLoading,
}) => {
  const [prompt, setPrompt] = useState('');
  const [debugMode, setDebugMode] = useState(false);
  const [responseStyle, setResponseStyle] = useState('balanced');
  const [skipRefinement, setSkipRefinement] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const responseStyles = [
    { value: 'concise', label: 'Concise', description: 'Brief and to-the-point' },
    { value: 'detailed', label: 'Detailed', description: 'Comprehensive and thorough' },
    { value: 'casual', label: 'Casual', description: 'Friendly and conversational' },
    { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
    { value: 'educational', label: 'Educational', description: 'Informative with examples' },
    { value: 'balanced', label: 'Balanced', description: 'Well-rounded approach' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      onError('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    
    try {
      // Add style preference and refinement setting to the prompt
      const styledPrompt = {
        text: prompt,
        style: responseStyle,
        skip_refinement: skipRefinement
      };

      const response = debugMode 
        ? await apiService.submitPromptDebug(styledPrompt)
        : await apiService.submitPrompt(styledPrompt);
      
      onResponse(response);
      setHasSubmitted(true);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setPrompt('');
    setResponseStyle('balanced');
    setSkipRefinement(false);
    onError('');
  };

  const examplePrompts = [
    "Explain machine learning",
    "How does blockchain work?",
    "What is quantum computing?",
    "Describe neural networks"
  ];

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main prompt input - takes up 3 columns */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="prompt" className="block text-sm font-semibold text-gray-700">
                Enter your prompt
              </label>
            </div>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => {
                // Enforce character limit
                if (e.target.value.length <= 5000) {
                  setPrompt(e.target.value);
                }
              }}
              placeholder="Type your question or request here..."
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-300 input-focus bg-white/70 backdrop-blur-sm shadow-sm ${
                prompt.length >= 5000 
                  ? 'border-red-300 bg-red-50/70' 
                  : prompt.length > 4500 
                    ? 'border-orange-300 bg-orange-50/70' 
                    : 'border-gray-300'
              }`}
              rows={4}
              disabled={isLoading}
            />
            {/* Character count */}
            <div className="flex justify-between items-center mt-2">
              <div className="text-xs text-gray-500">
                <span className={`font-medium ${
                  prompt.length >= 5000 ? 'text-red-600' : 
                  prompt.length > 4500 ? 'text-orange-600' : 
                  'text-gray-600'
                }`}>
                  {prompt.length}
                </span>
                <span className="text-gray-400"> / 5000 characters</span>
              </div>
              {prompt.length >= 5000 ? (
                <div className="text-xs text-red-600 font-medium flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Character limit reached
                </div>
              ) : prompt.length > 4500 && (
                <div className="text-xs text-orange-600 font-medium">
                  {prompt.length > 4800 ? 'Character limit almost reached' : 'Approaching character limit'}
                </div>
              )}
            </div>
          </div>

          {/* Response style dropdown - takes up 1 column */}
          <div className="lg:col-span-1">
            <label htmlFor="response-style" className="block text-sm font-semibold text-gray-700 mb-2">
              Response Style
            </label>
            <select
              id="response-style"
              value={responseStyle}
              onChange={(e) => setResponseStyle(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-sm"
            >
              {responseStyles.map((style) => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
            
            {/* Style description */}
            <p className="mt-1 text-xs text-gray-500 font-medium">
              {responseStyles.find(s => s.value === responseStyle)?.description}
            </p>

            {/* Debug mode checkbox - moved here from bottom */}
            <div className="flex items-center mt-3">
              <input
                id="debug-mode"
                type="checkbox"
                checked={debugMode}
                onChange={(e) => setDebugMode(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors"
                disabled={isLoading}
              />
              <label htmlFor="debug-mode" className="ml-2 block text-sm text-gray-700 font-medium">
                Show prompt refinement
              </label>
            </div>

            {/* Skip refinement checkbox - moved here from prompt input area */}
            <div className="flex items-center mt-2">
              <input
                id="skip-refinement"
                type="checkbox"
                checked={skipRefinement}
                onChange={(e) => setSkipRefinement(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors"
                disabled={isLoading}
              />
              <label htmlFor="skip-refinement" className="ml-2 block text-sm text-gray-700 font-medium">
                Skip refinement
              </label>
            </div>
          </div>
        </div>
          
        {/* Example prompts */}
        {!hasSubmitted && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2 font-medium">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleExampleClick(example)}
                  disabled={isLoading}
                  className="px-3 py-1 text-sm bg-gradient-to-r from-gray-100 to-gray-200 hover:from-indigo-100 hover:to-indigo-200 text-gray-700 hover:text-indigo-700 rounded-full transition-all duration-300 disabled:opacity-50 transform hover:scale-105 shadow-sm hover:shadow-md"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading || !prompt.trim()}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium hover:bg-gray-100 rounded-lg"
            >
              Clear
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl btn-gradient"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}; 