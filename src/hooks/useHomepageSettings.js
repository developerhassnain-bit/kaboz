import { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const useHomepageSettings = () => {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${backendUrl}/api/homepage/settings`);
        if (!cancelled && response.data.success) {
          setSettings(response.data.settings || null);
        }
      } catch (error) {
        console.log(error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { settings, isLoading };
};

export default useHomepageSettings;
