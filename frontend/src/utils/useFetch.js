import { useState, useEffect } from 'react'; // Asegúrate de importar useState y useEffect
import axiosInstance from '../api/axiosInstance';

const useFetch = (url) => {
  const [data, setData] = useState(null);  // Aquí se utiliza useState
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(url);
        setData(response.data);  // Actualiza el estado con los datos obtenidos
      } catch (err) {
        setError('Error al cargar los datos');  // Maneja el error en la solicitud
      } finally {
        setLoading(false);  // Siempre cambia el estado de loading a false
      }
    };

    fetchData();
  }, [url]);  // Reejecuta la solicitud cuando la URL cambie

  return { data, loading, error };  // Devuelve los estados para que se puedan usar en el componente
};

export default useFetch;