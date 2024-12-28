import { MdAccountBox } from "react-icons/md";
import { Link } from "react-router";
import { useSelector } from "react-redux";

function AccountIcon() {
  const token = useSelector((state) => state.auth.token);

  return (
    <>
      <button className="icons-button">
        {!token ? (
          <Link to="/login">
            <MdAccountBox size={17} />
          </Link>
        ) : (
          <Link to="/account">
            <MdAccountBox size={17} />
          </Link>
        )}
      </button>
    </>
  );
}

export default AccountIcon;
