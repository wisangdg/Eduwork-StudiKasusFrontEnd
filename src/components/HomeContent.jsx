import React, { useState, useEffect } from "react";
import HomeTitle from "./main/HomeTitle";
import Tags from "./main/Tags";
import MenuItems from "./main/MenuItems";
import Loading from "../pages/Loading";
import Footer from "./Footer";
import { useLocation } from "react-router";

export default function HomeContent({ searchKeyword, selectedCategory }) {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [location.pathname]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="homecontent">
          <HomeTitle />
          <Tags />
          <MenuItems
            searchKeyword={searchKeyword}
            selectedCategory={selectedCategory}
          />
          <Footer />
        </div>
      )}
    </>
  );
}
