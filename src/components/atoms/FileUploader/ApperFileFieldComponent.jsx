import { useState, useEffect, useRef, useMemo } from 'react';

const ApperFileFieldComponent = ({ elementId, config }) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  
  const mountedRef = useRef(false);
  const elementIdRef = useRef(elementId);
  const existingFilesRef = useRef([]);

  // Update elementId ref when it changes
  useEffect(() => {
    elementIdRef.current = elementId;
  }, [elementId]);

  // Memoize existingFiles to prevent unnecessary re-renders
  const memoizedExistingFiles = useMemo(() => {
    if (!config.existingFiles || !Array.isArray(config.existingFiles)) {
      return [];
    }
    
    // Deep equality check - if same length and first file has same ID, assume same files
    const current = config.existingFiles;
    const previous = existingFilesRef.current;
    
    if (current.length !== previous.length) {
      return current;
    }
    
    if (current.length === 0) {
      return [];
    }
    
    // Check if first file has different ID (indicates different files)
    const currentFirstId = current[0]?.Id || current[0]?.id;
    const previousFirstId = previous[0]?.Id || previous[0]?.id;
    
    if (currentFirstId !== previousFirstId) {
      return current;
    }
    
    return previous; // Return previous to avoid unnecessary updates
  }, [config.existingFiles]);

  // Initial Mount Effect
  useEffect(() => {
    let mounted = true;

    const initializeSDK = async () => {
      try {
        // Initialize ApperSDK with retry logic
        let attempts = 0;
        const maxAttempts = 50;
        
        while (attempts < maxAttempts && !window.ApperSDK) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (!window.ApperSDK) {
          throw new Error('ApperSDK not loaded. Please ensure the SDK script is included before this component.');
        }

        const { ApperFileUploader } = window.ApperSDK;
        
        if (!mounted) return;

        elementIdRef.current = `file-uploader-${elementId}`;
        
        await ApperFileUploader.FileField.mount(elementIdRef.current, {
          ...config,
          existingFiles: memoizedExistingFiles
        });

        mountedRef.current = true;
        existingFilesRef.current = memoizedExistingFiles;
        setIsReady(true);

      } catch (err) {
        console.error('Failed to initialize ApperFileFieldComponent:', err);
        if (mounted) {
          setError(err.message);
        }
      }
    };

    initializeSDK();

    // Cleanup
    return () => {
      mounted = false;
      if (mountedRef.current && window.ApperSDK) {
        try {
          const { ApperFileUploader } = window.ApperSDK;
          ApperFileUploader.FileField.unmount(elementIdRef.current);
        } catch (err) {
          console.error('Error during unmount:', err);
        }
      }
      mountedRef.current = false;
      setIsReady(false);
      setError(null);
    };
  }, [elementId, config.fieldKey, config.tableName]);

  // File Update Effect
  useEffect(() => {
    if (!isReady || !window.ApperSDK || !config.fieldKey) return;

    const updateFiles = async () => {
      try {
        // Deep equality check with JSON.stringify
        const currentFiles = JSON.stringify(memoizedExistingFiles);
        const previousFiles = JSON.stringify(existingFilesRef.current);
        
        if (currentFiles === previousFiles) return;

        const { ApperFileUploader } = window.ApperSDK;
        
        // Format detection and conversion
        let filesToUpdate = memoizedExistingFiles;
        
        if (filesToUpdate.length > 0 && filesToUpdate[0].Id !== undefined) {
          // Convert from API format to UI format
          filesToUpdate = ApperFileUploader.toUIFormat(filesToUpdate);
        }

        if (filesToUpdate.length > 0) {
          await ApperFileUploader.FileField.updateFiles(config.fieldKey, filesToUpdate);
        } else {
          await ApperFileUploader.FileField.clearField(config.fieldKey);
        }

        existingFilesRef.current = memoizedExistingFiles;

      } catch (err) {
        console.error('Error updating files:', err);
        setError(err.message);
      }
    };

    updateFiles();
  }, [memoizedExistingFiles, isReady, config.fieldKey]);

  // Error UI
  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-600 text-sm">File upload error: {error}</p>
      </div>
    );
  }

  return (
    <div className="file-uploader-container">
      {/* Main container with unique ID */}
      <div id={`file-uploader-${elementId}`} className="min-h-[100px]">
        {/* Loading UI */}
        {!isReady && (
          <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <svg className="animate-spin h-6 w-6 text-gray-400 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm text-gray-500">Loading file uploader...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApperFileFieldComponent;