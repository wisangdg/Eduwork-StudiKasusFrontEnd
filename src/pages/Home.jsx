import React from "react";
import HomeContent from "../components/HomeContent";
import Header from "../components/Header";
import { useState } from "react";

export default function Home({
  searchKeyword,
  handleSearchChange,
  categories,
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (category) => {
    console.log("Category selected in App:", category);
    setSelectedCategory(category._id === "all" ? null : category); // If 'Semua' is selected, set to null to show all products
  };
  return (
    <div>
      <Header
        handleSearchChange={handleSearchChange}
        categories={categories}
        onSelectCategory={handleCategorySelect}
      />
      <HomeContent
        searchKeyword={searchKeyword}
        selectedCategory={selectedCategory}
      />
    </div>
  );
}
