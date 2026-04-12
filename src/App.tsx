import { RouterProvider } from "react-router";
import { Flowbite, ThemeModeScript } from 'flowbite-react';
import customTheme from './utils/theme/custom-theme';
import { AuthProvider } from './context/AuthContext';
import router from "./routes/Router";


function App() {

  return (
    <>
    <AuthProvider>
      <ThemeModeScript />
      <Flowbite theme={{ theme: customTheme }}>
        <RouterProvider router={router} />
      </Flowbite>
    </AuthProvider>
    </>
  );
}

export default App;
