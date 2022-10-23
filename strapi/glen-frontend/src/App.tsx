 import './App.css';
import { useCallback, useState, default as React } from 'react';
import { default as axios } from 'axios';

// Default port for Strapi. Configure as needed.
const API_ROOT = 'http://localhost:1337/api';
// Routes. Comes from our Strapi config.
const ROUTES = {
  LAW_SOC: '/law-soc',
}
const LOCALES = {
  BANGLA: 'bn-BD',
}

// Strapi wraps each model in a "data". Inside which, the things we care about
// are in "attributes".
interface StrapiModelResponse<T> {
  data: {
    attributes: T
  }
}

// Let's be real, the response can have missing fields.
interface LawSocView {
  title: string | null;
  subtitle: string | null;
}

// Missing data in Strapi is returned as null.
type NonNullProps<T> = {[key in keyof T]: NonNullable<T[key]>;};

function dropNulls<T>(partial: T): Partial<NonNullProps<T>> {
  const filtered = Array.from(Object.entries(partial))
    .filter(([, val]) => val !== null);
  // Too lazy to figure this out.
  return Object.fromEntries(filtered) as any;
}

function App() {
  const [title, setTitle] = useState('Placeholder');
  const [subtitle, setSubtitle] = useState('Also a placeholder');

  function updateState(defaultData: NonNullProps<LawSocView>, localizedData?: LawSocView) {
    const overlaidData = {
      ...defaultData,
      ...(localizedData ? dropNulls(localizedData) : {}),
    };
    const {
      title: newTitle,
      subtitle: newSubtitle
    } = overlaidData;

    setTitle(newTitle);
    setSubtitle(newSubtitle);
  }

  const getDefaultBackendData = useCallback(async () => {
    const response = await axios
      .get<StrapiModelResponse<NonNullProps<LawSocView>>>(API_ROOT + ROUTES.LAW_SOC);
    updateState(response.data.data.attributes);
  }, []);

  const getBanglaBackendData = useCallback(async () => {
    const defaultPromise = axios
      .get<StrapiModelResponse<NonNullProps<LawSocView>>>(API_ROOT + ROUTES.LAW_SOC);
    const banglaPromise = axios
      .get<StrapiModelResponse<LawSocView>>(
        API_ROOT + ROUTES.LAW_SOC,
        { params: { locale: LOCALES.BANGLA } }
    );
    const [defaultResponse, banglaResponse] = await Promise.all([defaultPromise, banglaPromise])
    updateState(
      defaultResponse.data.data.attributes,
      banglaResponse.data.data.attributes
    );
  }, []);

  return (
    <div className="App">
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <button onClick={getDefaultBackendData}>Get default backend data!!</button>
      <button onClick={getBanglaBackendData}>Get Bangla backend data!!</button>
    </div>
  );
}

export default App;
