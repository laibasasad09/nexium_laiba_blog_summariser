"use client";

import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";


export default function HomePage() {
  const [url, setUrl] = useState("");
  const [fullText, setFullText] = useState("");
  const [summary, setSummary] = useState("");
  const [translated, setTranslated] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarise = async () => {
    setLoading(true);
    try {
      const scrapeRes = await fetch("/api/scrape", {
        method: "POST",
        body: JSON.stringify({ url }),
      }).then((res) => res.json());

      if (!scrapeRes.success) throw new Error("Scraping failed");
      setFullText(scrapeRes.text);

      const summariseRes = await fetch("/api/summarise", {
        method: "POST",
        body: JSON.stringify({ text: scrapeRes.text }),
      }).then((res) => res.json());

      setSummary(summariseRes.summary);

      const translateRes = await fetch("/api/translate", {
        method: "POST",
        body: JSON.stringify({ summary: summariseRes.summary }),
      }).then((res) => res.json());

      setTranslated(translateRes.translated);
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    await fetch("/api/save", {
      method: "POST",
      body: JSON.stringify({ summary, fullText }),
    });
    alert("✅ Summary saved!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black text-white p-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-400">
          Blog Summariser
        </h1>
        <p className="text-gray-300 mb-8">
          Paste a blog URL to scrape, summarise and translate it to Urdu.
        </p>

        <div className="flex gap-4 mt-10 justify-center">
          <Input
            placeholder="Enter blog URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="max-w-lg bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500"
          />
          <Button
            onClick={handleSummarise}
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg"
          >
            {loading ? "Processing..." : "Summarise"}
          </Button>
        </div>

        {summary && (
          <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border border-purple-500 text-left p-4 shadow-xl rounded-2xl mt-8">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                 Summary:
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-100">{summary}</p>
              <h3 className="text-lg font-semibold mt-4 text-purple-300">
                 Urdu Translation:
              </h3>
              <p className="text-gray-200">{translated}</p>

              {/* Save and Copy buttons */}
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-blue-400 to-teal-500 text-white hover:from-green-500 hover:to-teal-600"
                >
                  Save
                </Button>

                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${summary}\n\n${translated}`
                    );
                    alert("📋 Copied to clipboard!");
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700"
                >
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
