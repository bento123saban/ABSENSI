export async function processQueue() {
    const queue = await getAllFromDB(); // Ambil semua dari IndexedDB
    
    for (const task of queue) {
        try {
            // Fetch mandiri, bypass interseptor
            const response = await fetch(task.url, {
                method: task.method,
                headers: { ...task.options.headers, 'X-Background-Sync': 'true' },
                body: JSON.stringify(task.data)
            });

            if (response.ok) {
                await removeFromDB(task.id);
                // Beri tahu UI kalau satu tugas beres
                new BroadcastChannel('apex_sync_channel').postMessage({ 
                    type: 'TASK_SUCCESS', 
                    id: task.id 
                });
            } else {
                throw new Error("Server error");
            }
        } catch (err) {
            console.error("Gagal sinkron, akan dicoba nanti oleh OS");
            throw err; // Lempar error biar OS tahu harus retry
        }
    }
}