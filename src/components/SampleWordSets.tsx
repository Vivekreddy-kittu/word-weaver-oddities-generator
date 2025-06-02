
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Zap } from "lucide-react";

interface SampleWordSetsProps {
  onLoadSample: (words: string[]) => void;
}

export const SampleWordSets = ({ onLoadSample }: SampleWordSetsProps) => {
  const sampleSets = [
    {
      title: "Fruits & Transport",
      words: ["apple", "banana", "car", "orange"],
      description: "Mix of fruits with one vehicle"
    },
    {
      title: "Animals & Food",
      words: ["dog", "cat", "pizza", "bird"],
      description: "Animals with one food item"
    },
    {
      title: "Colors & Emotions",
      words: ["red", "blue", "happy", "green"],
      description: "Colors with one emotion"
    },
    {
      title: "Sports & Instruments",
      words: ["football", "tennis", "piano", "basketball"],
      description: "Sports with one musical instrument"
    },
    {
      title: "Technology",
      words: ["computer", "smartphone", "tablet", "pencil"],
      description: "Digital devices with one analog tool"
    },
    {
      title: "Weather & Clothing",
      words: ["sunny", "rainy", "shirt", "cloudy"],
      description: "Weather conditions with one clothing item"
    }
  ];

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" />
          Try Sample Word Sets
        </CardTitle>
        <CardDescription>
          Click any example below to test the odd word detection
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleSets.map((set, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
              onClick={() => onLoadSample(set.words)}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {set.title}
                </h4>
                <Zap className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-gray-600 mb-3">{set.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {set.words.map((word, wordIndex) => (
                  <span
                    key={wordIndex}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium"
                  >
                    {word}
                  </span>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onLoadSample(set.words);
                }}
              >
                Try this set
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
