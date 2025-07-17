import React, { useState, FormEvent } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { SearchResult, GroundingChunk } from '../../types';
import { SearchIcon } from '../icons/SearchIcon';
import { BrowserIcon } from '../icons/BrowserIcon';

interface BrowserAppProps {
  onClose: () => void;
}

export const BrowserApp: React.FC<BrowserAppProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setSearchResult(null);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const summary = response.text;
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      setSearchResult({ summary, sources });

    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNewSearch = () => {
    setSearchResult(null);
    setQuery('');
    setError(null);
  }

  const renderInitialView = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <BrowserIcon className="w-24 h-24 text-sky-500" />
        <h1 className="text-2xl font-bold text-gray-800 mt-4">Search the Web</h1>
        <p className="text-gray-500 mt-2 mb-8">Get AI-powered answers and sources.</p>
        <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask anything..."
                    className="w-full h-14 pl-12 pr-4 text-base bg-gray-100 border-2 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-full mt-4 hover:bg-blue-600 active:bg-blue-700 transition-colors disabled:bg-blue-300"
                disabled={isLoading || !query.trim()}
            >
                Search
            </button>
        </form>
    </div>
  );

  const renderLoadingView = () => (
     <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 mt-4">Searching...</p>
    </div>
  );

  const renderErrorView = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <h2 className="text-xl font-semibold text-red-500">Something went wrong</h2>
        <p className="text-gray-600 mt-2">{error}</p>
        <button
            onClick={handleNewSearch}
            className="mt-6 bg-blue-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-600 transition-colors"
        >
            Try Again
        </button>
    </div>
  );

  const renderResultView = () => (
    <div className="flex flex-col h-full">
        <header className="p-4 border-b border-gray-200">
            <p className="text-sm text-gray-500">Search results for:</p>
            <h1 className="text-lg font-semibold text-gray-800 truncate">{query}</h1>
            <button onClick={handleNewSearch} className="text-blue-500 font-semibold text-sm mt-2 hover:underline">
                &larr; New Search
            </button>
        </header>
        <div className="flex-grow overflow-y-auto p-4 prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{searchResult?.summary}</p>
            
            {searchResult!.sources.length > 0 && (
                <>
                    <h3 className="font-bold mt-8 mb-2 text-gray-800">Sources</h3>
                    <ul className="pl-0">
                        {searchResult!.sources.map((chunk: GroundingChunk, index: number) => (
                            <li key={index} className="list-none p-0 mb-3">
                                <a 
                                    href={chunk.web.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors no-underline"
                                >
                                    <span className="font-semibold text-blue-600 break-words">{chunk.web.title || new URL(chunk.web.uri).hostname}</span>
                                    <span className="text-xs text-gray-500 block break-words mt-1">{chunk.web.uri}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    </div>
  );

  return (
    <div className="bg-white w-full h-full flex flex-col">
        <main className="flex-grow">
            {isLoading ? renderLoadingView() : error ? renderErrorView() : searchResult ? renderResultView() : renderInitialView()}
        </main>
        <div className="sticky bottom-0 left-0 right-0 h-8 flex justify-center items-end pb-2 mt-auto bg-white/80 backdrop-blur-sm border-t border-gray-200">
            <button onClick={onClose} className="w-36 h-1.5 bg-gray-400/80 rounded-full hover:bg-gray-500 transition" aria-label="Go to Home Screen"></button>
        </div>
    </div>
  );
};
