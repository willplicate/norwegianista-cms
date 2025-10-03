'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function GenerateArticlePage() {
  const searchParams = useSearchParams();
  const preselectedShipId = searchParams.get('ship');

  const [ships, setShips] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [styleGuides, setStyleGuides] = useState<any[]>([]);

  const [selectedShip, setSelectedShip] = useState(preselectedShipId || '');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedStyleGuide, setSelectedStyleGuide] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [shipsRes, topicsRes, guidesRes] = await Promise.all([
          fetch('/api/ships'),
          fetch('/api/topics'),
          fetch('/api/style-guides'),
        ]);

        if (shipsRes.ok) setShips(await shipsRes.json());
        if (topicsRes.ok) setTopics(await topicsRes.json());
        if (guidesRes.ok) {
          const guides = await guidesRes.json();
          setStyleGuides(guides);
          const defaultGuide = guides.find((g: any) => g.is_default);
          if (defaultGuide) setSelectedStyleGuide(defaultGuide.id);
        }
      } catch (err) {
        console.error('Error loading data:', err);
      }
    }
    loadData();
  }, []);

  async function handleGenerate() {
    if (!selectedShip || !selectedTopic) {
      setError('Please select both a ship and topic');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedContent('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipId: selectedShip,
          topicId: selectedTopic,
          styleGuideId: selectedStyleGuide || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate article');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let content = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        content += chunk;
        setGeneratedContent(content);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate article');
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSaveDraft() {
    if (!generatedContent) return;

    try {
      // Extract title from content (first line or heading)
      const titleMatch = generatedContent.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : generatedContent.split('\n')[0].substring(0, 100);

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ship_id: selectedShip,
          topic_id: selectedTopic,
          title,
          slug,
          content: generatedContent,
          excerpt: generatedContent.substring(0, 160),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save article');
      }

      const article = await response.json();
      window.location.href = `/admin/articles/${article.id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save draft');
    }
  }

  return (
    <div className="px-4 sm:px-0">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Generate Article
      </h1>

      <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="ship"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Ship
            </label>
            <select
              id="ship"
              value={selectedShip}
              onChange={(e) => setSelectedShip(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Choose a ship...</option>
              {ships.map((ship) => (
                <option key={ship.id} value={ship.id}>
                  {ship.name} ({ship.cruise_line})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Topic
            </label>
            <select
              id="topic"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Choose a topic...</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="styleGuide"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Style Guide (Optional)
            </label>
            <select
              id="styleGuide"
              value={selectedStyleGuide}
              onChange={(e) => setSelectedStyleGuide(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Use default...</option>
              {styleGuides.map((guide) => (
                <option key={guide.id} value={guide.id}>
                  {guide.name} {guide.is_default ? '(Default)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !selectedShip || !selectedTopic}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating...
              </>
            ) : (
              'Generate Article'
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
      </div>

      {generatedContent && (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Generated Article
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleSaveDraft}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Draft
              </button>
            </div>
          </div>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">
              {generatedContent}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
