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

interface LawSocView {
    title: string;
    subtitle: string;
}

function App() {
  const [title, setTitle] = useState('Placeholder');
  const [subtitle, setSubtitle] = useState('Also a placeholder');

  function updateState(data: LawSocView) {
    const {
      title: newTitle,
      subtitle: newSubtitle
    } = data;

    setTitle(newTitle);
    setSubtitle(newSubtitle);
  }

  const getDefaultBackendData = useCallback(async () => {
    const response = await axios
      .get<StrapiModelResponse<LawSocView>>(API_ROOT + ROUTES.LAW_SOC);
    updateState(response.data.data.attributes);
  }, []);

  const getBanglaBackendData = useCallback(async () => {
    const response = await axios
      .get<StrapiModelResponse<LawSocView>>(
        API_ROOT + ROUTES.LAW_SOC,
        { params: { locale: LOCALES.BANGLA } });
    updateState(response.data.data.attributes);
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
