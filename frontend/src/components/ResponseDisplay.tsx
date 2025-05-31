import React, { useState } from 'react';
import { PromptResponse, DebugPromptResponse } from '../types/api';

interface ResponseDisplayProps {
  response: PromptResponse | DebugPromptResponse | null;
}

const isDebugResponse = (response: PromptResponse | DebugPromptResponse): response is DebugPromptResponse => {
  return 'raw_input' in response;
};

export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response }) => {
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});

  if (!response) return null;

  const formatTime = (ms?: number) => {
    if (!ms) return 'N/A';
    return `${ms.toFixed(0)}ms`;
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const CopyButton: React.FC<{ text: string; copyKey: string; className?: string }> = ({ text, copyKey, className = "" }) => (
    <button
      onClick={() => copyToClipboard(text, copyKey)}
      className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg transition-all duration-300 transform hover:scale-105 ${
        copiedStates[copyKey] 
          ? 'bg-green-100 text-green-700 copy-success' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800'
      } ${className}`}
      title="Copy to clipboard"
    >
      {copiedStates[copyKey] ? (
        <>
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );

  if (isDebugResponse(response)) {
    return (
      <div className="w-full max-w-4xl mx-auto animate-fadeIn">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20">
          <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Debug Response
              </h3>
              <CopyButton 
                text={`Raw Input: ${response.raw_input}\n\nRefined Prompt: ${response.refined_prompt}\n\nFinal Response: ${response.final_response}`} 
                copyKey="debug-all" 
                className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="bg-white/50 px-2 py-1 rounded-lg">Model: <span className="font-semibold text-gray-900">{response.model_used}</span></span>
              <span className="bg-white/50 px-2 py-1 rounded-lg">Total: <span className="font-semibold text-gray-900">{formatTime(response.processing_time_ms)}</span></span>
              <span className="bg-white/50 px-2 py-1 rounded-lg">Refinement: <span className="font-semibold text-gray-900">{formatTime(response.refinement_time_ms)}</span></span>
              <span className="bg-white/50 px-2 py-1 rounded-lg">Generation: <span className="font-semibold text-gray-900">{formatTime(response.generation_time_ms)}</span></span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Raw Input */}
            <div className="animate-slideIn">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-gray-700 flex items-center">
                  <span className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-500 rounded-full mr-2"></span>
                  1. Raw Input
                </h4>
                <CopyButton text={response.raw_input} copyKey="raw-input" />
              </div>
              <div className="bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-gray-800 whitespace-pre-wrap font-medium">{response.raw_input}</p>
              </div>
            </div>

            {/* Refined Prompt */}
            <div className="animate-slideIn">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-gray-700 flex items-center">
                  <span className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mr-2"></span>
                  2. Refined Prompt
                </h4>
                <CopyButton text={response.refined_prompt} copyKey="refined-prompt" />
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100/50 border border-yellow-200 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-gray-800 whitespace-pre-wrap font-medium">{response.refined_prompt}</p>
              </div>
            </div>

            {/* Final Response */}
            <div className="animate-slideIn">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-gray-700 flex items-center">
                  <span className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full mr-2"></span>
                  3. Final Response
                </h4>
                <CopyButton text={response.final_response} copyKey="final-response" />
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100/50 border border-green-200 rounded-xl p-4 backdrop-blur-sm">
                <div className="prose max-w-none">
                  <div className="text-gray-800 whitespace-pre-wrap font-medium leading-relaxed">{response.final_response}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular response
  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeIn">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20">
        <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Response
            </h3>
            <CopyButton 
              text={response.response} 
              copyKey="response" 
              className="bg-green-100 hover:bg-green-200 text-green-700"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="bg-white/50 px-2 py-1 rounded-lg">Model: <span className="font-semibold text-gray-900">{response.model_used}</span></span>
            <span className="bg-white/50 px-2 py-1 rounded-lg">Processing Time: <span className="font-semibold text-gray-900">{formatTime(response.processing_time_ms)}</span></span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="prose max-w-none">
            <div className="text-gray-800 whitespace-pre-wrap font-medium leading-relaxed">{response.response}</div>
          </div>
        </div>
      </div>
    </div>
  );
}; 