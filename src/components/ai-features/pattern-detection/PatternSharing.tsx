import React, { useState } from 'react';
import { 
  ShareIcon, 
  UserGroupIcon, 
  GlobeAltIcon, 
  EyeIcon, 
  LinkIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
  XMarkIcon,
  CheckIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { Pattern } from './types';

interface PatternSharingProps {
  pattern: Pattern;
  onMakePublic: (patternId: string, isPublic: boolean) => Promise<void>;
  onShareWithTeam: (patternId: string, emails: string[]) => Promise<void>;
  onExportPattern: (pattern: Pattern, format: 'json' | 'yaml') => Promise<string>;
  onImportPattern: (patternData: string) => Promise<void>;
  className?: string;
}

/**
 * Component for sharing patterns with team members or publicly
 * Provides options for exporting, importing, and visibility settings
 */
const PatternSharing: React.FC<PatternSharingProps> = ({
  pattern,
  onMakePublic,
  onShareWithTeam,
  onExportPattern,
  onImportPattern,
  className = '',
}) => {
  const [isPublic, setIsPublic] = useState(false);
  const [teamEmails, setTeamEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);
  const [isSharingWithTeam, setIsSharingWithTeam] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'yaml'>('json');
  const [isExporting, setIsExporting] = useState(false);
  const [exportData, setExportData] = useState<string | null>(null);
  const [importData, setImportData] = useState('');
  const [showImportForm, setShowImportForm] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);
  
  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Add email to team sharing list
  const addEmail = () => {
    if (!newEmail.trim()) {
      return;
    }
    
    if (!isValidEmail(newEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    if (teamEmails.includes(newEmail)) {
      setEmailError('This email has already been added');
      return;
    }
    
    setTeamEmails([...teamEmails, newEmail]);
    setNewEmail('');
    setEmailError('');
  };
  
  // Remove email from team sharing list
  const removeEmail = (email: string) => {
    setTeamEmails(teamEmails.filter((e) => e !== email));
  };
  
  // Handle public/private toggle
  const handleVisibilityChange = async () => {
    setIsUpdatingVisibility(true);
    try {
      await onMakePublic(pattern.id, !isPublic);
      setIsPublic(!isPublic);
      
      // Generate a share URL if making public
      if (!isPublic) {
        setShareUrl(`https://app.example.com/patterns/shared/${pattern.id}`);
      } else {
        setShareUrl('');
      }
    } catch (error) {
      console.error('Error updating pattern visibility:', error);
    } finally {
      setIsUpdatingVisibility(false);
    }
  };
  
  // Share pattern with team members
  const handleShareWithTeam = async () => {
    if (teamEmails.length === 0) {
      setEmailError('Please add at least one email address');
      return;
    }
    
    setIsSharingWithTeam(true);
    try {
      await onShareWithTeam(pattern.id, teamEmails);
      // Success, could clear emails or show notification
    } catch (error) {
      console.error('Error sharing with team:', error);
    } finally {
      setIsSharingWithTeam(false);
    }
  };
  
  // Export pattern
  const handleExport = async () => {
    setIsExporting(true);
    setExportData(null);
    
    try {
      const data = await onExportPattern(pattern, exportFormat);
      setExportData(data);
    } catch (error) {
      console.error('Error exporting pattern:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  // Import pattern
  const handleImport = async () => {
    if (!importData.trim()) {
      return;
    }
    
    setIsImporting(true);
    try {
      await onImportPattern(importData);
      setImportData('');
      setShowImportForm(false);
    } catch (error) {
      console.error('Error importing pattern:', error);
    } finally {
      setIsImporting(false);
    }
  };
  
  // Copy share URL to clipboard
  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShowCopiedNotification(true);
      setTimeout(() => setShowCopiedNotification(false), 2000);
    });
  };
  
  // Create a downloadable file from export data
  const downloadExportFile = () => {
    if (!exportData) return;
    
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pattern-${pattern.id}.${exportFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`bg-white rounded-lg border shadow-sm dark:bg-gray-800 dark:border-gray-700 ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
          <ShareIcon className="h-5 w-5 inline mr-2 text-gray-500 dark:text-gray-400" />
          Share Pattern
        </h3>
        
        <div className="space-y-6">
          {/* Public/Private Toggle */}
          <div className="bg-gray-50 p-4 rounded-md dark:bg-gray-750">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="make-public"
                  type="checkbox"
                  checked={isPublic}
                  onChange={handleVisibilityChange}
                  disabled={isUpdatingVisibility}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50 dark:border-gray-600"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="make-public" className="font-medium text-gray-700 dark:text-gray-300">
                  Make pattern public
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Public patterns are visible to all users and can be discovered in the pattern library.
                </p>
              </div>
            </div>
            
            {isPublic && shareUrl && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Share URL
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <div className="relative flex items-stretch flex-grow">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="block w-full rounded-none rounded-l-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <LinkIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={copyShareUrl}
                    className="relative inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-500"
                  >
                    {showCopiedNotification ? (
                      <CheckIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
                    ) : (
                      <DocumentDuplicateIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {showCopiedNotification && (
                  <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                    URL copied to clipboard!
                  </p>
                )}
              </div>
            )}
          </div>
          
          {/* Team Sharing Section */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <UserGroupIcon className="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400" />
              Share with Team
            </h4>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="team-email" className="sr-only">
                  Email address
                </label>
                <div>
                  <div className="flex rounded-md shadow-sm">
                    <input
                      type="email"
                      id="team-email"
                      value={newEmail}
                      onChange={(e) => {
                        setNewEmail(e.target.value);
                        if (emailError) setEmailError('');
                      }}
                      placeholder="Enter email address"
                      className={`block w-full rounded-l-md sm:text-sm ${
                        emailError
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:border-red-400'
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600'
                      } dark:bg-gray-700 dark:text-white`}
                    />
                    <button
                      type="button"
                      onClick={addEmail}
                      className="relative inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-500"
                    >
                      Add
                    </button>
                  </div>
                  {emailError && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{emailError}</p>
                  )}
                </div>
              </div>
              
              {teamEmails.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Recipients
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {teamEmails.map((email) => (
                      <div
                        key={email}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      >
                        <span className="truncate max-w-xs">{email}</span>
                        <button
                          type="button"
                          onClick={() => removeEmail(email)}
                          className="ml-1.5 h-4 w-4 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleShareWithTeam}
                  disabled={teamEmails.length === 0 || isSharingWithTeam}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-700 dark:hover:bg-primary-600"
                >
                  {isSharingWithTeam ? (
                    <>
                      <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Sharing...
                    </>
                  ) : (
                    <>Share Pattern</>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Export/Import Section */}
          <div className="border-t border-gray-200 pt-5 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Export and Import
            </h4>
            
            <div className="space-y-4">
              {/* Export Options */}
              <div className="bg-gray-50 p-4 rounded-md dark:bg-gray-750">
                <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Export Pattern
                </h5>
                
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex items-center">
                    <input
                      id="format-json"
                      type="radio"
                      name="export-format"
                      value="json"
                      checked={exportFormat === 'json'}
                      onChange={() => setExportFormat('json')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                    />
                    <label htmlFor="format-json" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      JSON
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="format-yaml"
                      type="radio"
                      name="export-format"
                      value="yaml"
                      checked={exportFormat === 'yaml'}
                      onChange={() => setExportFormat('yaml')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                    />
                    <label htmlFor="format-yaml" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      YAML
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleExport}
                    disabled={isExporting}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    {isExporting ? (
                      <>
                        <ArrowPathIcon className="animate-spin -ml-1 mr-1 h-3 w-3" />
                        Exporting...
                      </>
                    ) : (
                      <>Generate {exportFormat.toUpperCase()}</>
                    )}
                  </button>
                  
                  {exportData && (
                    <button
                      type="button"
                      onClick={downloadExportFile}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600"
                    >
                      <ArrowDownTrayIcon className="-ml-1 mr-1 h-3 w-3" />
                      Download
                    </button>
                  )}
                </div>
                
                {exportData && (
                  <div className="mt-3">
                    <div className="relative">
                      <pre className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 p-2 text-xs font-mono text-gray-800 max-h-40 overflow-y-auto dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                        {exportData}
                      </pre>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(exportData)}
                        className="absolute top-2 right-2 p-1 rounded-md bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-600 hover:text-gray-800 dark:bg-gray-800 dark:bg-opacity-80 dark:hover:bg-opacity-100 dark:text-gray-400 dark:hover:text-gray-200"
                        title="Copy to clipboard"
                      >
                        <DocumentDuplicateIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Import Options */}
              <div>
                {!showImportForm ? (
                  <button
                    type="button"
                    onClick={() => setShowImportForm(true)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    Import Pattern
                  </button>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md dark:bg-gray-750">
                    <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Import Pattern
                    </h5>
                    
                    <textarea
                      rows={5}
                      value={importData}
                      onChange={(e) => setImportData(e.target.value)}
                      placeholder="Paste pattern data in JSON or YAML format"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    
                    <div className="mt-3 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowImportForm(false);
                          setImportData('');
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleImport}
                        disabled={!importData.trim() || isImporting}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-700 dark:hover:bg-primary-600"
                      >
                        {isImporting ? (
                          <>
                            <ArrowPathIcon className="animate-spin -ml-1 mr-1 h-3 w-3" />
                            Importing...
                          </>
                        ) : (
                          <>Import</>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternSharing;
