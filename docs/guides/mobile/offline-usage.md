# Offline Capabilities

The Kobe Scraper UI provides robust offline support, allowing you to continue working even when your internet connection is unavailable. This guide explains how the offline features work and how to get the most out of them.

## How Offline Mode Works

The application uses a combination of modern web technologies to provide offline support:

1. **IndexedDB**: Stores application data locally on your device
2. **Service Workers**: Handles caching of application assets and API responses
3. **Background Sync**: Queues changes made offline to be sent when connection is restored

## Automatic Switching

The application automatically detects when your device goes offline and enables offline mode:

1. An offline indicator appears at the bottom of the screen
2. Operations that require internet connectivity are queued
3. Read-only data that was previously accessed remains available

You don't need to manually enable or configure offline mode—it activates seamlessly when needed.

## Available Features Offline

The following features remain available when working offline:

### Jobs Management

- Viewing all previously loaded jobs
- Creating new jobs (synchronized when back online)
- Editing existing jobs (changes synchronized when back online)
- Canceling scheduled jobs

### Workflow Builder

- Viewing and editing previously loaded workflows
- Creating new workflows
- Adding, editing, and deleting nodes
- Rearranging connections between nodes

### Data Viewing

- Accessing previously loaded scraping results
- Viewing data visualizations that were previously generated
- Exporting data that was available before going offline

## Features Not Available Offline

Some features require an active internet connection:

- Running jobs manually
- Real-time monitoring of running jobs
- Accessing data that wasn't previously loaded
- Retrieving new results from completed jobs
- Accessing certain API-dependent functions

## Data Synchronization

When your connection is restored, the application automatically synchronizes your changes:

### Automatic Syncing

1. When your device reconnects to the internet, a notification appears
2. The application begins syncing your changes in the background
3. A progress indicator shows synchronization status
4. You're notified when synchronization is complete

### Conflict Resolution

If changes were made to the same data both offline and on the server, the application will:

1. Detect the conflict during synchronization
2. Present you with both versions of the data
3. Allow you to choose which version to keep or merge changes
4. Apply your resolution and complete synchronization

## Offline First Strategy

The application follows an "offline-first" design philosophy:

### Caching Strategy

1. **Read-Through Caching**: Data is cached as you browse the application
2. **Write-Back Caching**: Changes are immediately stored locally then synced
3. **Optimistic Updates**: UI updates immediately without waiting for server confirmation
4. **Background Prefetching**: Commonly used data is prefetched during idle time

### Data Prioritization

The application intelligently manages limited offline storage:

1. Most frequently accessed data is prioritized
2. Larger datasets may have summarized versions stored for offline access
3. Critical application functionality is always available offline

## Best Practices for Offline Usage

To get the most out of offline capabilities:

### Before Going Offline

1. **Browse Key Sections**: Visit important areas to ensure their data is cached
2. **Wait for Initial Load**: Allow the application to fully load before going offline
3. **Complete In-Progress Syncs**: Let any ongoing synchronization complete

### While Offline

1. **Check Synchronization Status**: The sync icon shows if changes are pending
2. **Be Mindful of Storage**: Avoid creating extremely large workflows or datasets
3. **Save Frequently**: Use the save button regularly to ensure local changes are stored

### After Reconnecting

1. **Allow Time for Sync**: Let the application complete synchronization
2. **Verify Important Changes**: Check that critical changes were properly synced
3. **Resolve Any Conflicts**: Address any synchronization conflicts promptly

## Troubleshooting Offline Mode

If you encounter issues with offline functionality:

### Sync Failures

If changes fail to synchronize when back online:

1. Check that you're fully connected to the internet
2. Try refreshing the application
3. Check for conflict resolution dialogs that may need your input
4. Use the "Force Sync" option in the Settings menu

### Missing Data

If expected data isn't available offline:

1. Check that you visited and loaded the data while online
2. Ensure your device has sufficient storage space
3. Try clearing the application cache and reloading while online

### Storage Limitations

If you receive storage limit warnings:

1. Use the "Storage Management" tool in Settings
2. Review and delete unnecessary cached data
3. Clear old or unused workflows and jobs

## Optimizing for Offline Usage

To ensure the best offline experience:

1. **Periodically Clean Cache**: Remove unused data through the Settings menu
2. **Use Compact Mode**: Enable "Data Saver" mode for more efficient caching
3. **Set Offline Preferences**: Configure which data should be prioritized for offline access
4. **Update Regularly**: Keep the application updated to benefit from offline improvements
