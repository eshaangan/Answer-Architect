import React, { useState, useEffect } from 'react';
import { PromptForm } from './components/PromptForm';
import { ResponseDisplay } from './components/ResponseDisplay';
import { StatusIndicator } from './components/StatusIndicator';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { PromptResponse, DebugPromptResponse } from './types/api';

function App() {
  const [response, setResponse] = useState<PromptResponse | DebugPromptResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleResponse = (newResponse: PromptResponse | DebugPromptResponse) => {
    setResponse(newResponse);
    setError('');
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setResponse(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-black">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="animate-slideIn">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AnswerArchitect
              </h1>
              <p className="text-gray-600 mt-1 font-medium">AI-powered prompt refinement and response generation</p>
            </div>
            <div className="flex items-center justify-center space-x-4 animate-slideIn">
              <StatusIndicator />
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {darkMode ? '🌞 Light' : '🌙 Dark'}
              </button>
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="px-4 py-2 text-sm bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
              >
                {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {showAnalytics && (
        <div className="mb-8 animate-fadeIn">
          <AnalyticsDashboard />
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Description */}
          <div className="text-center animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              How it works
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 card-hover">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse-gentle">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg">1. Enter Your Prompt</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Type your question or request in natural language</p>
                </div>
                
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 card-hover">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse-gentle">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg">2. AI Refinement</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Our AI refines your prompt for optimal results</p>
                </div>
                
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 card-hover">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse-gentle">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg">3. Get Response</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Receive a high-quality, refined response</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="animate-fadeIn">
            <PromptForm
              onResponse={handleResponse}
              onError={handleError}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="w-full max-w-4xl mx-auto animate-slideIn">
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4 shadow-lg">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Typing indicator while waiting for response */}
          {isLoading && !response && (
            <div className="animate-fadeIn">
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="ml-2 text-gray-500 italic">Assistant is typing...</span>
              </div>
            </div>
          )}

          {/* Response Display */}
          <div className="animate-fadeIn">
            <ResponseDisplay response={response} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p className="font-medium">AnswerArchitect - Enhancing AI interactions through intelligent prompt refinement</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
