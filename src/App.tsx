import { Route, Routes } from "react-router-dom";
import { SaltProvider, BorderLayout, BorderItem } from "@salt-ds/core";
import Header from "./header/Header";
import { routes } from "./routes";

function App() {
  return (
    <SaltProvider>
      <BorderLayout style={{height: '100vh'}}>
        <BorderItem position="center" style={{flex: 1,height: '100vh', width: '100%'}} >
          <Routes>
            {routes.map((r) => (
              <Route key={r.name} path={r.path} element={r.element} />
            ))}
          </Routes>
        </BorderItem>
        <BorderItem sticky={true} position="south" style={{bottom: 0, left: 0, right: 0}}>
          <Header />
        </BorderItem>
      </BorderLayout>
    </SaltProvider>
  );
}

export default App;
