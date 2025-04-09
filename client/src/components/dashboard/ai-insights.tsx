import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface AIInsight {
  id: number;
  type: "prediction" | "suggestion";
  message: string;
  siteId: number;
}

export default function AIInsights() {
  const { data: insights, isLoading, error, refetch } = useQuery<AIInsight[]>({
    queryKey: ['/api/ai-insights'],
    refetchInterval: 60000, // Auto refresh every minute
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">AI-Powered Insights</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="animate-pulse p-5 border border-gray-200 rounded-lg">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-4/5"></div>
            </div>
            <div className="animate-pulse p-5 border border-gray-200 rounded-lg">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !insights) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">AI-Powered Insights</h3>
        </div>
        <div className="p-5">
          <p className="text-danger-500">
            {error ? `Error loading insights: ${(error as Error).message}` : 'No insights available'}
          </p>
        </div>
      </div>
    );
  }

  // Get a prediction and a suggestion if available
  const prediction = insights.find(insight => insight.type === "prediction");
  const suggestion = insights.find(insight => insight.type === "suggestion");

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">AI-Powered Insights</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            title="Refresh insights"
          >
            <span className="material-icons">refresh</span>
          </Button>
        </div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {prediction && (
            <div className="p-5 border border-warning-200 bg-warning-50 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="material-icons text-warning-500">insights</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-medium text-gray-900">Performance Prediction</h4>
                  <p className="mt-1 text-sm text-gray-600">{prediction.message}</p>
                  <div className="mt-3">
                    <Button variant="outline" size="sm" className="bg-warning-100 text-warning-700 border-warning-200 hover:bg-warning-200 hover:text-warning-800">
                      <span className="w-4 h-4 mr-1">👁️</span>
                      Monitor Closely
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {suggestion && (
            <div className="p-5 border border-primary-200 bg-primary-50 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="material-icons text-primary-500">build</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-medium text-gray-900">Suggested Fix</h4>
                  <p className="mt-1 text-sm text-gray-600">{suggestion.message}</p>
                  <div className="mt-3">
                    <Button variant="outline" size="sm" className="bg-primary-100 text-primary-700 border-primary-200 hover:bg-primary-200 hover:text-primary-800">
                      <span className="w-4 h-4 mr-1">📋</span>
                      Create Task
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!prediction && !suggestion && (
            <div className="col-span-2 p-5 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-center">
                <span className="material-icons text-gray-400 mr-2">lightbulb</span>
                <p className="text-gray-500">No AI insights available at the moment</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
