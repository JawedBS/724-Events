import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    try {
      const response = await fetch("/events.json");

      if (!response.ok) {
        throw new Error(`Erreur de chargement ! Statut : ${response.status}`);
      }

      const jsonData = await response.json();
      console.log("JSON récupéré :", jsonData); // Debugging
      return jsonData;
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
      return null;
    }
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const getData = useCallback(async () => {
    try {
      const fetchedData = await api.loadData();
      console.log("Données réellement chargées :", fetchedData);

      if (!fetchedData) {
        throw new Error("Les données sont nulles ou absentes !");
      }

      setData(fetchedData);
    } catch (err) {
      console.error("Erreur de chargement des données :", err);
      setError(err);
    }
  }, []);

  useEffect(() => {
    if (data) return;
    getData();
  }, [data, getData]);

  // Utilise useMemo pour éviter que le contexte ne change à chaque rendu
  const contextValue = useMemo(() => ({ data, error }), [data, error]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataContext;
