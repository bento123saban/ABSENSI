// Import ApexSearchEngine yang sudah kita buat di Langkah 1
import { ApexSearchEngine } from './bendhard16.js';

const searchEngine = new ApexSearchEngine();

// Mendengarkan pesan/instruksi dari Main Thread (UI)
self.onmessage = async (event) => {
    const { action, payload } = event.data;

    try {
        switch (action) {
            case 'SEED_INDEX':
                // payload: { documents: [...], fields: [...] }
                const { documents, fields } = payload;
                console.time('[Worker] Indexing Time');
                
                documents.forEach(doc => {
                    // Pastikan dokumen memiliki ID unik (bisa dari keyPath IndexedDB)
                    const id = doc.id || doc.itemId; 
                    searchEngine.indexDocument(id, doc, fields);
                });
                
                console.timeEnd('[Worker] Indexing Time');
                self.postMessage({ action: 'SEED_SUCCESS', payload: { totalIndexed: documents.length } });
                break;

            case 'EXECUTE_SEARCH':
                // payload: { query: 'keyword' }
                const startTime = performance.now();
                const results = searchEngine.search(payload.query);
                const duration = performance.now() - startTime;

                self.postMessage({ 
                    action: 'SEARCH_SUCCESS', 
                    payload: { results, duration, query: payload.query } 
                });
                break;

            case 'CLEAR_INDEX':
                searchEngine.invertedIndex.clear();
                searchEngine.documentStore.clear();
                self.postMessage({ action: 'CLEAR_SUCCESS' });
                break;

            default:
                throw new Error(`Action [${action}] tidak dikenali oleh Worker.`);
        }
    } catch (error) {
        self.postMessage({ action: 'ERROR', payload: error.message });
    }
};