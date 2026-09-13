import {
  Route,
  Routes,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Search from "./pages/Search";
import MovieDetails from "./pages/MovieDetails";
import Wishlist from "./pages/Wishlist";

import {
  MovieContextProvider,
} from "./context/MovieContext";

import {
  WishlistContextProvider,
} from "./context/WishlistContext";


const App = () => {

  return (

    <MovieContextProvider>

      <WishlistContextProvider>

        <div className="min-h-screen overflow-x-hidden bg-[#08070d] text-white">

          <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

            <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl" />

            <div className="absolute right-[-12rem] top-[35%] h-[32rem] w-[32rem] rounded-full bg-fuchsia-500/10 blur-3xl" />

            <div className="absolute bottom-[-12rem] left-[30%] h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

          </div>


          <Navbar />


          <main className="mx-auto min-h-[calc(100vh-80px)] max-w-7xl px-4 sm:px-6 lg:px-8">

            <Routes>

              <Route
                path="/"
                element={<Home />}
              />

              <Route
                path="/search"
                element={<Search />}
              />

              <Route
                path="/movie/:movieId"
                element={<MovieDetails />}
              />

              <Route
                path="/wishlist"
                element={<Wishlist />}
              />

              <Route
                path="*"
                element={<Home />}
              />

            </Routes>

          </main>


          <Footer />

        </div>

      </WishlistContextProvider>

    </MovieContextProvider>
  );
};


export default App;