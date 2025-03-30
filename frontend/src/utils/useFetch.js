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
        console.log('Datos obtenidos:', response.data); // Verifica los datos recibidos
        setData(response.data);
      } catch (err) {
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);  // Reejecuta la solicitud cuando la URL cambie

  return { data, loading, error };  // Devuelve los estados para que se puedan usar en el componente
};

export default useFetch;