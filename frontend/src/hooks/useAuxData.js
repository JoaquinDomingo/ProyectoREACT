import { useState, useEffect } from 'react';
import api from '../context/api';

export const useAuxData = () => {
    const [categorias, setCategorias] = useState([]);
    const [plataformas, setPlataformas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resCat, resPlat] = await Promise.all([
                    api.get('/games/categorias'),
                    api.get('/games/plataforma')
                ]);
                setCategorias(resCat.data);
                setPlataformas(resPlat.data);
            } catch (error) {
                console.error("Error fetching aux data:", error);
            }
        };
        fetchData();
    }, []);

    return { categorias, plataformas };
};
