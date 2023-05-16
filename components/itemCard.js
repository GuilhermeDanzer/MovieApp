import React, { forwardRef } from 'react'
import styles from '../styles/ItemCard.module.css'

import Link from 'next/link'
const ItemCard = (
  { title, subTitle, buttonAction = '', buttonText, photoPath },
  ref
) => {
  const addDefaultSrc = ev => {
    ev.target.src = '/no-image.png'
    ev.target.style.width = '200px'
    ev.target.style.height = '200px'
    ev.target.style.objectFit = 'cover'
  }
  return (
    <div className={styles.cardDiv} ref={ref}>
      <div className={styles.divImg}>
        <img
          className={styles.img}
          alt={title}
          onError={addDefaultSrc}
          src={`http://image.tmdb.org/t/p/w500${photoPath}`}
        />
      </div>
      <div className={styles.cardFooter}>
        <p className={styles.title}>{title}</p>
        <span className={styles.genres}>{subTitle}</span>
        {buttonText ? (
          <Link href={buttonAction}>
            <div className={styles.divButton}>
              <button className={styles.button}>{buttonText}</button>
            </div>
          </Link>
        ) : null}
      </div>
    </div>
  )
}

export default forwardRef(ItemCard)
