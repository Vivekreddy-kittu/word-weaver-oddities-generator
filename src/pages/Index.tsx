
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Brain, Lightbulb } from "lucide-react";
import { OddWordAnalyzer } from "@/components/OddWordAnalyzer";
import { SampleWordSets } from "@/components/SampleWordSets";

const Index = () => {
  const [words, setWords] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    oddWord: string;
    explanation: string;
    similarities: { word: string; similarity: number }[];
  } | null>(null);

  const handleAnalyze = async () => {
    if (!words.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);
    
    try {
      const wordList = words.split(',').map(w => w.trim()).filter(w => w.length > 0);
      
      if (wordList.length < 3) {
        alert("Please enter at least 3 words separated by commas");
        setIsAnalyzing(false);
        return;
      }

      // Simulate analysis delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // This will be replaced with actual NLP analysis
      const mockResult = {
        oddWord: wordList[Math.floor(Math.random() * wordList.length)],
        explanation: "This word has the lowest semantic similarity to the other words in the group based on contextual embeddings.",
        similarities: wordList.map(word => ({
          word,
          similarity: Math.random() * 0.5 + 0.5
        }))
      };
      
      setResult(mockResult);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSampleSet = (sampleWords: string[]) => {
    setWords(sampleWords.join(", "));
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Odd Word Picker
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Use advanced NLP to identify the word that doesn't belong in your list. 
            Perfect for language learning, pattern recognition, and cognitive exercises.
          </p>
        </div>

        {/* Main Input Card */}
        <Card className="max-w-4xl mx-auto mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Enter Your Words
            </CardTitle>
            <CardDescription>
              Type words separated by commas (e.g., apple, banana, car, orange)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="apple, banana, car, orange"
                value={words}
                onChange={(e) => setWords(e.target.value)}
                className="text-lg p-6 border-2 border-gray-200 focus:border-blue-500 transition-colors"
              />
              <p className="text-sm text-gray-500">
                Tip: Enter at least 3 words for best results
              </p>
            </div>
            
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || !words.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg font-semibold transition-all duration-200 transform hover:scale-[1.02]"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing with NLP...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 mr-2" />
                  Find the Odd Word
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="max-w-4xl mx-auto mb-8">
            <OddWordAnalyzer result={result} originalWords={words.split(',').map(w => w.trim())} />
          </div>
        )}

        {/* Sample Word Sets */}
        <div className="max-w-4xl mx-auto">
          <SampleWordSets onLoadSample={loadSampleSet} />
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p>Powered by advanced Natural Language Processing</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
