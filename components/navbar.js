import React from "react"
import styles from "../styles/Navbar.module.css"
import Link from "next/link"
const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.wrapper}>
        <Link href="/">
          <li>Home</li>
        </Link>
      </ul>
    </nav>
  )
}

export default Navbar
