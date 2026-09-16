import { useState, useEffect } from 'react';
import { settingsApi } from '../api/services';

let cache = null;
let inflight = null;

export default function useSiteSettings() {
  const [settings, setSettings] = useState(cache);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) {
      setSettings(cache);
      setLoading(false);
      return;
    }
    if (!inflight) {
      inflight = settingsApi.get().then((res) => {
        cache = res.data.settings;
        return cache;
      });
    }
    inflight
      .then((data) => setSettings(data))
      .catch(() => setSettings(null))
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}
