import React from "react";
import Logo from "./header/Logo";
import Kategori from "./header/Kategori";
import Search from "./header/Search";
import CartList from "./header/CartList.js";
import AccountIcon from "./header/AccountIcon.js";
import "../styles/main.css";

const categoryNameMap = {
  mainDish: "Utama",
  snacks: "Snacks",
  drinks: "Minuman",
  pastry: "Dessert",
  // Add other mappings here if needed
};

const Header = ({ handleSearchChange, categories, onSelectCategory }) => {
  console.log("Categories in Header:", categories);

  const handleSelect = (option) => {
    console.log("Selected Category in Header:", option);
    onSelectCategory(
      option._id === "all" ? option : { ...option, name: option.originalName }
    );
  };

  // Create a new array with 'Semua' as the first option followed by mapped categories
  const categoryOptions = [
    { _id: "all", name: "Semua", originalName: "all" },
    ...categories.map((cat) => ({
      ...cat,
      name: categoryNameMap[cat.name] || cat.name,
      originalName: cat.name, // Menyimpan nama asli dari backend
    })),
  ];

  return (
    <header className="header">
      <Logo />
      <Kategori options={categoryOptions} onSelect={handleSelect} />
      <Search handleSearchChange={handleSearchChange} />
      <CartList />
      <AccountIcon />
    </header>
  );
};

export default Header;
