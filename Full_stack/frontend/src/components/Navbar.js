import Cookie from "js-cookie";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaUserAlt } from "react-icons/fa";

export default function Navbar() {
  const [link, setLink] = useState("/");
  const [role, setRole] = useState("employee");
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const location = useLocation();
  const [employeeId, setEmployeeId] = useState("")

  useEffect(() => {
    const token = Cookie.get("accessToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentRole = decodedToken.role;
      setEmployeeId(decodedToken._id)

      setRole(currentRole);
      setName(decodedToken.name);
      setDesignation(decodedToken.designation);
      // console.log(designation)

      if (currentRole === "admin") {
        setLink("/admin");
      } else {
        setLink("/");
      }
    }
  }, []);

  let navigate = useNavigate();

  const handleLogoutClick = (e) => {
    e.preventDefault();
    Cookie.remove("accessToken");
    Cookie.remove("role");
    navigate('/login');
  };

  // const handleProfileClick = (e) => {
  //   e.preventDefault();
  //   if (role === "employee") {
  //     navigate(`/profile/${employeeId}`)
  //   }
  // }

  return (
    <div className="mb-32 sm:mb-20">

      <nav
        className="bg-white z-0 dark:bg-[#0369a1] fixed w-full  top-0 start-0 border-b border-gray-200 dark:border-gray-600 shadow-lg"
        style={{ background: 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)' }}
      >
        <div className="flex justify-between mx-auto p-4 max-w-7xl">
          <Link
            to={link}
            className="flex items-center space-x-3"
          >

            <span className=" absolute left-72 text-2xl font-semibold text-white dark:text-white">
              JMAN Learn
            </span>
          </Link>
          <div className="flex items-center md:order-2 space-x-3">
            <button
              // onClick={handleProfileClick}
              disabled={role === "admin"}
              type="button"
              className=" mr-4 text-[#0369a1]text-sm  px-4 py-2 transition duration-200 ease-in-out hover:bg-[#7ab5cc] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#0369a1] dark:bg-white dark:border-white dark:hover:bg-[#0369a1] dark:hover:text-white"
            >

              <div className=" absolute -top-0 right-42 flex -ml-12 gap-2 items-center justify-center h-full">
                <FaUserAlt />


                <p className="text-xl font-semibold text-gray-800">{name}</p>
              </div>
            </button>
            <button
              type="button"
              onClick={handleLogoutClick}
              className="absolute px-10  right-12 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 transition duration-200 ease-in-out dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            >
              Logout
            </button>
          </div>
          <div
            className="hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <ul className="flex ml-72 items-center space-x-8 p-2  mt-4 font-medium border border-gray-100 rounded   md:space-x-8 md:mt-0 md:border-0 dark:bg-transparent dark:border-gray-700 px-10" >
              <li>
                <Link
                  to={link}
                  className={`block hover:bg-white px-4 text-xl py-2 rounded  ${location.pathname === link ? "text-black bg-white" : "text-gray-900 dark:text-white "}`}
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`block hover:bg-white px-4 text-xl py-2 rounded  ${location.pathname === "/contact" ? "text-black bg-white" : "text-gray-900 dark:text-white "}`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>

  );
}
