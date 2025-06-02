
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle2, Target } from "lucide-react";

interface OddWordAnalyzerProps {
  result: {
    oddWord: string;
    explanation: string;
    similarities: { word: string; similarity: number }[];
  };
  originalWords: string[];
}

export const OddWordAnalyzer = ({ result, originalWords }: OddWordAnalyzerProps) => {
  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Target className="w-6 h-6 text-red-500" />
          Analysis Results
        </CardTitle>
        <CardDescription>
          NLP-powered semantic analysis of your word set
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Odd Word Highlight */}
        <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border-l-4 border-red-400">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h3 className="text-xl font-semibold text-red-700">Odd Word Detected</h3>
          </div>
          <div className="text-3xl font-bold text-red-600 mb-2">
            "{result.oddWord}"
          </div>
          <p className="text-gray-700 leading-relaxed">{result.explanation}</p>
        </div>

        {/* Word Analysis */}
        <div>
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Semantic Similarity Scores
          </h4>
          <div className="grid gap-3">
            {result.similarities
              .sort((a, b) => b.similarity - a.similarity)
              .map((item, index) => (
                <div key={item.word} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${item.word === result.oddWord ? 'text-red-600' : 'text-gray-700'}`}>
                        {item.word}
                        {item.word === result.oddWord && (
                          <Badge variant="destructive" className="ml-2">Odd Word</Badge>
                        )}
                      </span>
                      <span className="text-sm text-gray-500">
                        {(item.similarity * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={item.similarity * 100} 
                      className={`h-2 ${item.word === result.oddWord ? 'opacity-60' : ''}`}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Word Grid Display */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Your Word Set</h4>
          <div className="flex flex-wrap gap-3">
            {originalWords.map((word) => (
              <Badge
                key={word}
                variant={word === result.oddWord ? "destructive" : "secondary"}
                className={`px-4 py-2 text-sm font-medium ${
                  word === result.oddWord 
                    ? 'bg-red-100 text-red-700 border-red-300 animate-pulse' 
                    : 'bg-green-100 text-green-700 border-green-300'
                }`}
              >
                {word}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
