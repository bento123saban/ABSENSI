import { ApexDB } from '../bendhard16.min.js';
import { processQueue } from './sync-engine.js';

const syncChannel = new BroadcastChannel('apex_sync_channel');

// 1. Install & Activate (Langsung claim client agar SW segera pegang kontrol)
self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(clients.claim());
});

// 2. Listener BroadcastChannel (Komunikasi dengan UI)
syncChannel.onmessage = async (event) => {
    if (event.data.type === 'QUEUE_REQUEST') {
        console.log("[SW] Menerima tugas baru");
        await saveToIndexedDB(event.data.payload);
        // Daftarkan sync ke OS
        await self.registration.sync.register('apex-sync-task');
    }
};

// 3. Background Sync (Panggilan dari OS)
self.addEventListener('sync', (event) => {
    if (event.tag === 'apex-sync-task') {
        event.waitUntil(processQueue());
    }
});