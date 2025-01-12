import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance.js";
import AddToCart from "./AddToCart.js";
import Loading from "../../pages/Loading.jsx";
import { useSelector } from "react-redux";

const fetchMenus = async (page, activeTag, searchKeyword, selectedCategory) => {
  const params = {
    skip: (page - 1) * 10,
    limit: 10,
    page,
    q: searchKeyword,
  };

  if (activeTag.length !== 0 && activeTag !== null) {
    params.tags = activeTag.map((tag) => tag._id).join(",");
  }

  if (searchKeyword) {
    params.search = searchKeyword;
  }

  if (selectedCategory && selectedCategory._id !== "all") {
    params.category = selectedCategory.name;
  }

  const response = await axiosInstance.get("/api/products", {
    params,
  });

  return response.data;
};

const MenuItem = ({ menu, formatPrice, handleAddCart }) => (
  <div key={menu._id} className="menu-item">
    <img
      className="menu-item-image"
      src={`${process.env.REACT_APP_API_URL}/images/products/${menu.image_url}`}
      alt={menu.name}
    />
    <h2>{menu.name}</h2>
    <p className="menu-description">{menu.description}</p>
    <p className="menu-price">Rp.{formatPrice(menu.price)}</p>
    <AddToCart menu={menu} handleAddCart={handleAddCart} />
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="pagination">
    <button
      disabled={currentPage === 1}
      onClick={() => onPageChange(currentPage - 1)}
    >
      Previous
    </button>
    <span>
      Page {currentPage} of {totalPages}
    </span>
    <button
      disabled={currentPage === totalPages}
      onClick={() => onPageChange(currentPage + 1)}
    >
      Next
    </button>
  </div>
);

export default function MenuItems({
  handleAddCart,
  searchKeyword,
  selectedCategory,
}) {
  const [menus, setMenus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const activeTags = useSelector((state) => state.tags.activeTags);
  const formatPrice = (price) => {
    return price.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  useEffect(() => {
    const loadMenus = async () => {
      setLoading(true);
      try {
        const response = await fetchMenus(
          currentPage,
          activeTags,
          searchKeyword,
          selectedCategory && selectedCategory._id !== "all"
            ? { ...selectedCategory, name: selectedCategory.originalName }
            : undefined
        );
        setMenus(response.data);
        setTotalPages(response.totalPages || 1);
      } catch (error) {
        console.error("Error fetching menus:", error);
        alert("Failed to fetch menus. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadMenus();
  }, [currentPage, activeTags, searchKeyword, selectedCategory]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
      <h1 className="menu-title">Our Menu's</h1>
      <div className="menu-items">
        {loading ? (
          <Loading />
        ) : menus && menus.length > 0 ? (
          menus.map((menu) => (
            <MenuItem
              key={menu._id}
              menu={menu}
              formatPrice={formatPrice}
              handleAddCart={handleAddCart}
            />
          ))
        ) : (
          <p>No menus found</p>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
