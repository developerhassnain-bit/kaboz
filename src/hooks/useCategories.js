import { useState, useEffect } from "react";
import axios from "axios";

// Reads the backend URL the same way ShopContext does
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(backendUrl + "/api/category/list");
        if (response.data.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading };
};

export default useCategories;