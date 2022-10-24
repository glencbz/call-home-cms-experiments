 import './App.css';
import { useCallback, useState, default as React } from 'react';
import { default as axios } from 'axios';

// Default port for Strapi. Configure as needed.
const BACKEND_HOST = 'http://localhost:1337';
const API_ROOT = `${BACKEND_HOST}/api`;

// Routes. Comes from our Strapi config.
const ROUTES = {
  LAW_SOC: '/law-soc',
}
const LOCALES = {
  BANGLA: 'bn-BD',
}

// In production, all of this nonsense of unwrapping Strapi responses,
// flattening them, non-nulling, falling back to default would be hidden from
// the view layer.

// Strapi wraps each model in a "data". Inside which, the things we care about
// are in "attributes".
interface StrapiModelResponse<T> {
  data: {
    attributes: T
  }
}

// If there is a model, but it is missing, e.g. a missing Media field.
interface StrapiModelNullResponse {
  data: null;
}

interface StrapiMedia {
  alternativeText: string;
  caption: string;
  url: string;
  // There are many more, but I doubt we care about the rest.
}

interface LawSocView {
  title: string | null;
  subtitle: string | null;
  logo: StrapiModelResponse<StrapiMedia> | StrapiModelNullResponse;
}

// Missing data in Strapi is returned as null.
type NonNullProps<T> = {[key in keyof T]: NonNullable<T[key]>;};

function dropNulls<T>(partial: T): Partial<NonNullProps<T>> {
  const filtered = Array.from(Object.entries(partial as any))
    .filter(([, val]) => val !== null);
  // Too lazy to figure this out.
  return Object.fromEntries(filtered) as any;
}

interface FlatLawSocView {
  title: string | null;
  subtitle: string | null;
  logo: StrapiMedia | null;
}

function flattenLawSocView(unflat: LawSocView): FlatLawSocView {
  const {
    title,
    subtitle,
    logo: unflatLogo
  } = unflat
  return {
    title,
    subtitle,
    logo: unflatLogo.data?.attributes || null,
  };
}

function App() {
  const [title, setTitle] = useState('Placeholder');
  const [subtitle, setSubtitle] = useState('Also a placeholder');
  const [logoUrl, setLogoUrl] = useState<string>();

  function updateState(defaultData: NonNullProps<LawSocView>, localizedData?: LawSocView) {
    const overlaidData = {
      // This cast can be avoided by good type inference.
      ...flattenLawSocView(defaultData) as NonNullProps<FlatLawSocView>,
      ...(localizedData ? dropNulls(flattenLawSocView(localizedData)) : {}),
    };
    const {
      title: newTitle,
      subtitle: newSubtitle,
      logo: newLogoResponse,
    } = overlaidData;

    setTitle(newTitle);
    setSubtitle(newSubtitle);
    setLogoUrl(newLogoResponse.url);
  }

  const getDefaultBackendData = useCallback(async () => {
    const response = await axios
      .get<StrapiModelResponse<NonNullProps<LawSocView>>>(
        API_ROOT + ROUTES.LAW_SOC,
        // Strapi omits some data by default, e.g. for media.
        // This param tells Strapi to populate all fields 1 level deep
        { params: { populate: '*' } });
    updateState(response.data.data.attributes);
  }, []);

  const getBanglaBackendData = useCallback(async () => {
    const defaultPromise = axios
      .get<StrapiModelResponse<NonNullProps<LawSocView>>>(
        API_ROOT + ROUTES.LAW_SOC,
        { params: { populate: '*' } });
    const banglaPromise = axios
      .get<StrapiModelResponse<LawSocView>>(
        API_ROOT + ROUTES.LAW_SOC,
        { params: { populate: '*', locale: LOCALES.BANGLA } }
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
        {logoUrl ?
            <div style={{display: 'flex', justifyContent: 'center'}}>
            <img height="100" width="100" src={BACKEND_HOST + logoUrl}></img>
            </div> : null}
      <button onClick={getDefaultBackendData}>Get default backend data!!</button>
      <button onClick={getBanglaBackendData}>Get Bangla backend data!!</button>
    </div>
  );
}

export default App;
