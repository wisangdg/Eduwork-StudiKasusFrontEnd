import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>
        &copy; {new Date().getFullYear()} Edustore Company. All rights reserved.
      </p>
    </footer>
  );
};

const styles = {
  footer: {
    position: "relative",
    bottom: 0,
    width: "100%",
    backgroundColor: "#4a90e2",
    color: "#fff",
    textAlign: "center",
    padding: "15px 0",
  },
};

export default Footer;
