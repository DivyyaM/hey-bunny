import React, { useEffect, useState } from 'react';

interface AnalyticsSummary {
  [date: string]: {
    login: number;
    caption_generated: number;
    post_published: number;
  };
}

export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState<AnalyticsSummary>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics-summary')
      .then(res => res.json())
      .then(data => {
        setSummary(data.summary || {});
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">📊 Analytics Dashboard</h1>
      <p className="mb-4 text-gray-400">See daily logins, caption generations, and post publishes for the last 30 days.</p>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full text-left border border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-800">
            <tr>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Logins</th>
              <th className="py-2 px-4">Captions Generated</th>
              <th className="py-2 px-4">Posts Published</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(summary).sort((a, b) => b[0].localeCompare(a[0])).map(([date, counts]) => (
              <tr key={date} className="border-t border-gray-700">
                <td className="py-2 px-4">{date}</td>
                <td className="py-2 px-4">{counts.login}</td>
                <td className="py-2 px-4">{counts.caption_generated}</td>
                <td className="py-2 px-4">{counts.post_published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 