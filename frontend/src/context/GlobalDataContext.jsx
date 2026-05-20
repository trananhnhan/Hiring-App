import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const GlobalDataContext = createContext({});

export const GlobalDataProvider = ({ children }) => {
  const [provinces, setProvinces] = useState([]);
  const [careerFields, setCareerFields] = useState([]);
  const [isMetadataLoading, setIsMetadataLoading] = useState(true);

  const fetchGlobalMetadata = async () => {
    try {
      setIsMetadataLoading(true);
      const [provinceRes, careerFieldRes] = await Promise.all([
        api.get('/provinces'),
        api.get('/career-fields')
      ]);

      setProvinces(provinceRes.data);
      setCareerFields(careerFieldRes.data);
    } catch (error) {
      console.error("Lỗi nạp bộ nhớ đệm hệ thống:", error);
    } finally {
      setIsMetadataLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalMetadata();
  }, []);

  return (
    <GlobalDataContext.Provider value={{ provinces, careerFields, isMetadataLoading, refreshMetadata: fetchGlobalMetadata }}>
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = () => useContext(GlobalDataContext);