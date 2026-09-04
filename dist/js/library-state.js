(() => {
  function createState({ defaults = {}, queryKeys = {} } = {}) {
    const params = new URLSearchParams(window.location.search);
    let state = { ...defaults };
    for (const [key, queryKey] of Object.entries(queryKeys)) {
      if (params.has(queryKey)) state[key] = params.get(queryKey) || defaults[key];
    }
    const listeners = new Set();

    function syncUrl() {
      const url = new URL(window.location.href);
      for (const [key, queryKey] of Object.entries(queryKeys)) {
        const value = state[key];
        if (value === undefined || value === null || value === '' || value === 'all') url.searchParams.delete(queryKey);
        else url.searchParams.set(queryKey, value);
      }
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    }

    return {
      get(key) { return state[key]; },
      set(patch, { sync = true } = {}) {
        state = { ...state, ...patch };
        if (sync) syncUrl();
        listeners.forEach(listener => listener(state));
      },
      reset(keys = Object.keys(defaults)) {
        this.set(Object.fromEntries(keys.map(key => [key, defaults[key]])));
      },
      subscribe(listener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
      }
    };
  }

  window.PersonaLibraryState = { create: createState, createState };
})();
