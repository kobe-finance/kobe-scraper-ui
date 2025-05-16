import { openDB, IDBPDatabase } from 'idb';

// Database structure and versions
const DB_NAME = 'kobe-scraper-ui-offline';
const DB_VERSION = 1;

interface OfflineDB {
  'pending-requests': {
    key: string;
    value: {
      url: string;
      method: string;
      body?: any;
      headers?: Record<string, string>;
      timestamp: number;
      retryCount: number;
    };
  };
  'cached-data': {
    key: string;
    value: {
      data: any;
      timestamp: number;
      expires?: number;
    };
  };
  'app-state': {
    key: string;
    value: any;
  };
}

/**
 * OfflineManager class for handling offline functionality
 * Manages caching, offline data persistence, and request queuing
 */
class OfflineManager {
  private db: IDBPDatabase<OfflineDB> | null = null;
  private isOnline: boolean = navigator.onLine;
  private syncInProgress: boolean = false;
  private initialized: boolean = false;
  private networkListenersSet: boolean = false;
  
  /**
   * Initialize the OfflineManager database and network listeners
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    // Open the IndexedDB database
    this.db = await openDB<OfflineDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains('pending-requests')) {
          db.createObjectStore('pending-requests', { keyPath: 'key' });
        }
        
        if (!db.objectStoreNames.contains('cached-data')) {
          db.createObjectStore('cached-data', { keyPath: 'key' });
        }
        
        if (!db.objectStoreNames.contains('app-state')) {
          db.createObjectStore('app-state', { keyPath: 'key' });
        }
      },
    });
    
    // Set up network status listeners if not already set
    if (!this.networkListenersSet) {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
      this.networkListenersSet = true;
    }
    
    this.isOnline = navigator.onLine;
    this.initialized = true;
    
    // Attempt to sync if online
    if (this.isOnline) {
      this.syncPendingRequests();
    }
  }
  
  /**
   * Clean up the OfflineManager
   */
  destroy(): void {
    if (this.networkListenersSet) {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
      this.networkListenersSet = false;
    }
    
    if (this.db) {
      this.db.close();
      this.db = null;
    }
    
    this.initialized = false;
  }
  
  /**
   * Handle online event
   */
  private handleOnline = (): void => {
    this.isOnline = true;
    this.syncPendingRequests();
    
    // Dispatch event for the application to respond to
    window.dispatchEvent(new CustomEvent('app-online'));
  };
  
  /**
   * Handle offline event
   */
  private handleOffline = (): void => {
    this.isOnline = false;
    
    // Dispatch event for the application to respond to
    window.dispatchEvent(new CustomEvent('app-offline'));
  };
  
  /**
   * Check if the application is online
   */
  isNetworkOnline(): boolean {
    return this.isOnline;
  }
  
  /**
   * Queue a request to be sent when online
   */
  async queueRequest(
    url: string, 
    method: string, 
    body?: any, 
    headers?: Record<string, string>
  ): Promise<string> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    if (!this.db) {
      throw new Error('Offline database not initialized');
    }
    
    const key = `${method}-${url}-${Date.now()}`;
    
    await this.db.add('pending-requests', {
      key,
      value: {
        url,
        method,
        body,
        headers,
        timestamp: Date.now(),
        retryCount: 0
      }
    });
    
    // Try to sync immediately if online
    if (this.isOnline) {
      this.syncPendingRequests();
    }
    
    return key;
  }
  
  /**
   * Sync pending requests when online
   */
  async syncPendingRequests(): Promise<void> {
    if (!this.initialized || !this.db || !this.isOnline || this.syncInProgress) {
      return;
    }
    
    this.syncInProgress = true;
    
    try {
      const pendingRequests = await this.db.getAll('pending-requests');
      
      for (const request of pendingRequests) {
        try {
          const { url, method, body, headers } = request.value;
          
          // Make the request
          const response = await fetch(url, {
            method,
            headers: headers || {
              'Content-Type': 'application/json'
            },
            body: body ? JSON.stringify(body) : undefined
          });
          
          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }
          
          // Request succeeded, remove from queue
          await this.db.delete('pending-requests', request.key);
          
          // Dispatch success event
          window.dispatchEvent(new CustomEvent('request-synced', {
            detail: { key: request.key, success: true }
          }));
        } catch (error) {
          // Increment retry count
          request.value.retryCount++;
          
          // If fewer than 5 retry attempts, keep in the queue for later
          if (request.value.retryCount < 5) {
            await this.db.put('pending-requests', request);
          } else {
            // Too many failed attempts, remove from queue
            await this.db.delete('pending-requests', request.key);
            
            // Dispatch failure event
            window.dispatchEvent(new CustomEvent('request-sync-failed', {
              detail: { key: request.key, error }
            }));
          }
        }
      }
    } finally {
      this.syncInProgress = false;
    }
  }
  
  /**
   * Cache API response data for offline use
   */
  async cacheData(
    key: string, 
    data: any, 
    expiresInMs?: number
  ): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    if (!this.db) {
      throw new Error('Offline database not initialized');
    }
    
    const timestamp = Date.now();
    const expires = expiresInMs ? timestamp + expiresInMs : undefined;
    
    await this.db.put('cached-data', {
      key,
      value: {
        data,
        timestamp,
        expires
      }
    });
  }
  
  /**
   * Get cached data if available and not expired
   */
  async getCachedData(key: string): Promise<any | null> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    if (!this.db) {
      throw new Error('Offline database not initialized');
    }
    
    try {
      const cached = await this.db.get('cached-data', key);
      
      if (!cached) {
        return null;
      }
      
      // Check if the data has expired
      if (cached.value.expires && cached.value.expires < Date.now()) {
        await this.db.delete('cached-data', key);
        return null;
      }
      
      return cached.value.data;
    } catch (error) {
      console.error('Error retrieving cached data:', error);
      return null;
    }
  }
  
  /**
   * Save application state for offline use
   */
  async saveAppState(key: string, state: any): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    if (!this.db) {
      throw new Error('Offline database not initialized');
    }
    
    await this.db.put('app-state', {
      key,
      value: state
    });
  }
  
  /**
   * Load saved application state
   */
  async loadAppState(key: string): Promise<any | null> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    if (!this.db) {
      throw new Error('Offline database not initialized');
    }
    
    try {
      const state = await this.db.get('app-state', key);
      return state ? state.value : null;
    } catch (error) {
      console.error('Error loading app state:', error);
      return null;
    }
  }
  
  /**
   * Clear all cached data
   */
  async clearCache(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    if (!this.db) {
      throw new Error('Offline database not initialized');
    }
    
    await this.db.clear('cached-data');
  }
  
  /**
   * Get the count of pending requests
   */
  async getPendingRequestCount(): Promise<number> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    if (!this.db) {
      throw new Error('Offline database not initialized');
    }
    
    return await this.db.count('pending-requests');
  }
}

// Create a singleton instance
const offlineManager = new OfflineManager();

export default offlineManager;
