/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SentimentDataPoint {
  date: string;
  sentiment: number; // -1 to 1
  label: string;
}

export interface WordCloudItem {
  text: string;
  value: number;
}

export interface SentimentReport {
  trend: SentimentDataPoint[];
  wordCloud: {
    praises: WordCloudItem[];
    complaints: WordCloudItem[];
  };
  executiveSummary: string;
}

export interface AnalysisResponse {
  report?: SentimentReport;
  error?: string;
}
