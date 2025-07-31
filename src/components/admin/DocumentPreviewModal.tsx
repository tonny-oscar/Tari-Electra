'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

interface DocumentPreviewModalProps {
  documentUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentPreviewModal({
  documentUrl,
  isOpen,
  onClose,
}: DocumentPreviewModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Document Preview</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(documentUrl, '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
          
          <div className="flex-1 relative min-h-0 bg-muted rounded-lg overflow-hidden">
            {documentUrl.endsWith('.pdf') ? (
              <iframe
                src={`${documentUrl}#toolbar=0`}
                className="w-full h-full"
                onLoad={() => setIsLoading(false)}
              />
            ) : /\.(jpe?g|png|gif|webp)$/i.test(documentUrl) ? (
              <div className="flex items-center justify-center h-full p-4">
                <img
                  src={documentUrl}
                  alt="Document preview"
                  className="max-w-full max-h-full object-contain"
                  onLoad={() => setIsLoading(false)}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">This document type cannot be previewed</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(documentUrl, '_blank')}
                    className="mt-4"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download File
                  </Button>
                </div>
              </div>
            )}
            
            {isLoading && documentUrl.endsWith('.pdf') && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
