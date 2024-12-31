import axiosInstance from "../../api/axiosInstance";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTag } from "../../store";

function Tags() {
  const [tags, setTags] = useState([]);
  const dispatch = useDispatch();
  const activeTags = useSelector((state) => state.tags.activeTags);

  useEffect(() => {
    axiosInstance
      .get("/api/tags")
      .then((response) => {
        setTags(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error("There was an error fetching the tags!", error);
        setTags([]);
      });
  }, []);

  function handleClickTags(tag) {
    dispatch(addTag(tag));
  }

  return (
    <div className="tags">
      <h2 className="tags-title">Tags:</h2>
      <ul className="tags-list">
        {Array.isArray(tags) &&
          tags.map((tag) => (
            <li
              key={tag._id}
              className={`tag-item ${
                activeTags.find((t) => t._id === tag._id) ? "active" : ""
              }`}
              onClick={() => handleClickTags(tag)}
            >
              {tag.name}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Tags;
