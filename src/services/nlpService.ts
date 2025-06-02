
import { pipeline, Pipeline } from '@huggingface/transformers';

class NLPService {
  private featureExtractor: Pipeline | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    console.log('Initializing NLP model...');
    
    try {
      // Use a lightweight embedding model that works well in browsers
      this.featureExtractor = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2',
        { 
          progress_callback: (progress: any) => {
            console.log('Model loading progress:', progress);
          }
        }
      );
      this.isInitialized = true;
      console.log('NLP model initialized successfully');
    } catch (error) {
      console.error('Failed to initialize NLP model:', error);
      throw error;
    }
  }

  async getWordEmbeddings(words: string[]) {
    if (!this.featureExtractor) {
      throw new Error('NLP service not initialized');
    }

    const embeddings = [];
    
    for (const word of words) {
      const embedding = await this.featureExtractor(word, {
        pooling: 'mean',
        normalize: true,
      });
      embeddings.push(embedding.data);
    }
    
    return embeddings;
  }

  cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  async findOddWord(words: string[]) {
    console.log('Processing words:', words);
    
    if (words.length < 3) {
      throw new Error('Need at least 3 words to find odd one out');
    }

    // Get embeddings for all words
    const embeddings = await this.getWordEmbeddings(words);
    console.log('Generated embeddings for', words.length, 'words');

    // Calculate similarity matrix
    const similarities: { word: string; avgSimilarity: number }[] = [];
    
    for (let i = 0; i < words.length; i++) {
      let totalSimilarity = 0;
      let comparisons = 0;
      
      for (let j = 0; j < words.length; j++) {
        if (i !== j) {
          const similarity = this.cosineSimilarity(embeddings[i], embeddings[j]);
          totalSimilarity += similarity;
          comparisons++;
        }
      }
      
      const avgSimilarity = totalSimilarity / comparisons;
      similarities.push({
        word: words[i],
        avgSimilarity: avgSimilarity
      });
    }

    // Sort by similarity (lowest first = most different = odd word)
    similarities.sort((a, b) => a.avgSimilarity - b.avgSimilarity);
    
    const oddWord = similarities[0].word;
    const oddWordSimilarity = similarities[0].avgSimilarity;
    
    console.log('Similarity analysis:', similarities);
    
    // Generate explanation
    const otherWords = words.filter(w => w !== oddWord);
    const explanation = this.generateExplanation(oddWord, otherWords, oddWordSimilarity);
    
    return {
      oddWord,
      explanation,
      similarities: similarities.map(s => ({
        word: s.word,
        similarity: s.avgSimilarity
      }))
    };
  }

  private generateExplanation(oddWord: string, otherWords: string[], similarity: number): string {
    const similarityPercent = (similarity * 100).toFixed(1);
    
    if (similarity < 0.3) {
      return `"${oddWord}" has very low semantic similarity (${similarityPercent}%) to the other words. It belongs to a completely different category than ${otherWords.slice(0, -1).join(', ')} and ${otherWords.slice(-1)[0]}.`;
    } else if (similarity < 0.5) {
      return `"${oddWord}" shows moderate semantic distance (${similarityPercent}% similarity) from the group. While ${otherWords.join(', ')} share common semantic features, "${oddWord}" represents a different concept.`;
    } else {
      return `"${oddWord}" has the lowest average similarity (${similarityPercent}%) compared to other words in the set. The embedding analysis reveals subtle but significant semantic differences.`;
    }
  }
}

// Create singleton instance
export const nlpService = new NLPService();
