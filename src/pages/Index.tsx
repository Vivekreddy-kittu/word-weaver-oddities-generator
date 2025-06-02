
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Brain, Lightbulb, Cpu } from "lucide-react";
import { OddWordAnalyzer } from "@/components/OddWordAnalyzer";
import { SampleWordSets } from "@/components/SampleWordSets";
import { nlpService } from "@/services/nlpService";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [words, setWords] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [result, setResult] = useState<{
    oddWord: string;
    explanation: string;
    similarities: { word: string; similarity: number }[];
  } | null>(null);
  
  const { toast } = useToast();

  const initializeModel = async () => {
    if (isModelReady) return;
    
    setIsInitializing(true);
    try {
      await nlpService.initialize();
      setIsModelReady(true);
      toast({
        title: "NLP Model Ready!",
        description: "The AI model has been loaded and is ready for analysis.",
      });
    } catch (error) {
      console.error('Model initialization failed:', error);
      toast({
        title: "Model Loading Failed",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!words.trim()) return;
    
    const wordList = words.split(',').map(w => w.trim().toLowerCase()).filter(w => w.length > 0);
    
    if (wordList.length < 3) {
      toast({
        title: "Need More Words",
        description: "Please enter at least 3 words separated by commas",
        variant: "destructive",
      });
      return;
    }

    // Remove duplicates
    const uniqueWords = [...new Set(wordList)];
    if (uniqueWords.length !== wordList.length) {
      toast({
        title: "Duplicate Words Found",
        description: "Removed duplicate words for analysis",
      });
    }

    if (uniqueWords.length < 3) {
      toast({
        title: "Need More Unique Words",
        description: "Please enter at least 3 different words",
        variant: "destructive",
      });
      return;
    }

    if (!isModelReady) {
      await initializeModel();
    }
    
    setIsAnalyzing(true);
    setResult(null);
    
    try {
      console.log('Starting NLP analysis for words:', uniqueWords);
      const analysisResult = await nlpService.findOddWord(uniqueWords);
      setResult(analysisResult);
      
      toast({
        title: "Analysis Complete!",
        description: `Found "${analysisResult.oddWord}" as the odd word out.`,
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error processing your words. Please try again.",
        variant: "destructive",
      });
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
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            Use advanced NLP with tokenization and word embeddings to identify the word that doesn't belong. 
            Perfect for language learning, pattern recognition, and cognitive exercises.
          </p>
          
          {/* Model Status */}
          <div className="flex items-center justify-center gap-2 text-sm">
            <Cpu className="w-4 h-4" />
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              isModelReady 
                ? 'bg-green-100 text-green-700' 
                : 'bg-orange-100 text-orange-700'
            }`}>
              {isModelReady ? 'NLP Model Ready' : 'Model will load on first use'}
            </span>
          </div>
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
                Tip: Enter at least 3 words for best results. The AI will analyze semantic similarities using word embeddings.
              </p>
            </div>
            
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || isInitializing || !words.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg font-semibold transition-all duration-200 transform hover:scale-[1.02]"
            >
              {isInitializing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Loading NLP Model...
                </>
              ) : isAnalyzing ? (
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
          <p>Powered by Hugging Face Transformers • Real NLP with Word Embeddings</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
