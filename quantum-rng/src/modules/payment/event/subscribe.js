const eventWaitSubscribe = (setUser) => {
    const eventSource = new EventSource(`/backend/event/subscribe`);
    eventSource.onmessage = async (event) => {
      console.log('SSE res', event);
      // update this session
      const response = await fetch('/auth/patch_premium');
      setUser(await response.json());
    };

    // Handle errors
    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      eventSource.close(); // Reconnect if needed
    };
}
export default eventWaitSubscribe;