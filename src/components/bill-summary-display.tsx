'use client';

import { useState, useEffect } from 'react';
import type { Summary } from '@/types';
import { Loader2, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { summarizeText, getDemocraticPerspective, getRepublicanPerspective } from '@/ai/flows/summarize-text-flow';
import { formatDate } from '@/lib/utils';

// Helper function to strip HTML and clean text
const cleanTextForAI = (htmlText: string | null | undefined): string | null => {
  if (!htmlText || typeof htmlText !== 'string') {
    return null;
  }
  
  // Strip HTML tags
  const stripped = htmlText.replace(/<[^>]*>/g, ' ');
  
  // Clean up extra whitespace and decode HTML entities
  const cleaned = stripped
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  
  // Return null if the cleaned text is too short to be meaningful
  return cleaned.length > 20 ? cleaned : null;
};

export const SummaryDisplay = ({ summary, showPoliticalPerspectives = false }: { summary: Summary; showPoliticalPerspectives?: boolean }) => {
  const [aiSummary, setAiSummary] = useState('');
  const [democraticView, setDemocraticView] = useState('');
  const [republicanView, setRepublicanView] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const generateContent = async () => {
      if (!summary || !summary.text) {
        setAiSummary('No summary text available to analyze.');
        if (showPoliticalPerspectives) {
          setDemocraticView('No text available to analyze.');
          setRepublicanView('No text available to analyze.');
        }
        return;
      }

      const cleanedText = cleanTextForAI(summary.text);
      
      if (!cleanedText || cleanedText.length === 0 || cleanedText.trim().length === 0) {
        setAiSummary('No meaningful summary text available to analyze.');
        if (showPoliticalPerspectives) {
          setDemocraticView('No meaningful text available to analyze.');
          setRepublicanView('No meaningful text available to analyze.');
        }
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        
        if (typeof cleanedText === 'string' && cleanedText.trim().length > 20) {
          if (showPoliticalPerspectives) {
            // Generate summary and political perspectives
            const [summaryResult, democraticResult, republicanResult] = await Promise.all([
              summarizeText(cleanedText),
              getDemocraticPerspective(cleanedText),
              getRepublicanPerspective(cleanedText)
            ]);
            
            setAiSummary(summaryResult || 'Summary generation completed but no result returned.');
            setDemocraticView(democraticResult || 'Democratic perspective analysis completed but no result returned.');
            setRepublicanView(republicanResult || 'Republican perspective analysis completed but no result returned.');
          } else {
            // Generate only summary for older summaries
            const summaryResult = await summarizeText(cleanedText);
            setAiSummary(summaryResult || 'Summary generation completed but no result returned.');
          }
        } else {
          setAiSummary('Text too short for analysis.');
          if (showPoliticalPerspectives) {
            setDemocraticView('Text too short for analysis.');
            setRepublicanView('Text too short for analysis.');
          }
        }
      } catch (e) {
        console.error("Error generating content:", e);
        setError('Could not generate content.');
      } finally {
        setIsLoading(false);
      }
    };

    generateContent();
  }, [summary, showPoliticalPerspectives]);

  return (
    <div className="p-3 bg-secondary/50 rounded-md">
      <div className="font-semibold text-sm mb-2 flex justify-between items-center">
        <span>{summary.actionDesc} ({summary.versionCode})</span>
        <span className="text-xs text-muted-foreground font-normal">{formatDate(summary.updateDate)}</span>
      </div>
      
      {isLoading && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Generating analysis...</span>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!isLoading && !error && aiSummary && (
        <>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground italic flex items-center gap-1">
              <FileText className="h-3 w-3" />
              AI-generated overview:
            </p>
            <p className="prose prose-sm max-w-none text-muted-foreground mt-1">{aiSummary}</p>
          </div>

          {(democraticView || republicanView) && showPoliticalPerspectives && (
            <div className="mb-4 space-y-3">
              <p className="text-sm text-muted-foreground font-medium flex items-center gap-1">
                <Users className="h-3 w-3" />
                Political perspectives:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {democraticView && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border-l-4 border-blue-600">
                    <div className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-line">{democraticView}</div>
                  </div>
                )}
                
                {republicanView && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-md border-l-4 border-red-600">
                    <div className="text-sm text-red-800 dark:text-red-200 whitespace-pre-line">{republicanView}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="mt-4" disabled={!summary.text}>View original text</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[90vw] h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Original Text: {summary.actionDesc} ({summary.versionCode})</DialogTitle>
            <DialogDescription>
              Full original text for the summary from {formatDate(summary.updateDate)}.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-grow pr-6">
             <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: summary.text }} />
          </ScrollArea>
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="mt-4">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}