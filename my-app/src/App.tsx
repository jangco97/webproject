import { Routes, Route, Outlet } from "react-router-dom";

import styled from "styled-components";
import Navigation from "./components/NavigationComponents/Navigation";
import MainPage from "./pages/MainPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import "./App.css";
const Layout = () => {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
};
function App() {
  console.log(process.env.API_URL);
  return (
    <Container>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route index path="/signup" element={<SignupPage />} />
          <Route index path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </Container>
  );
}

export default App;
const Container = styled.div`
  padding: 90px 10rem 0 10rem;
  box-sizing: border-box;
`;
