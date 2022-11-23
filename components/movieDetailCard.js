import React from "react"
import styles from "../styles/MovieDetailCard.module.css"
import { getGenres } from "../utils/getGenres"
const MovieDetailCard = ({ movie }) => {
  const addDefaultSrc = ev => {
    ev.target.src = "/no-image.png"
    ev.target.style.width = "200px"
    ev.target.style.height = "200px"
    ev.target.style.objectFit = "cover"
  }
  const movieDate = new Date(movie.release_date)
  const movieGenres = movie.genres.map(genre => genre.name)
  const someStyle = {
    "--background": `url(http://image.tmdb.org/t/p/w500${movie.backdrop_path})`,
  }

  return (
    <div className={styles.card} style={someStyle}>
      <div className={styles.divImg}>
        <img
          className={styles.img}
          alt={movie.title}
          onError={addDefaultSrc}
          src={`http://image.tmdb.org/t/p/w500${movie.poster_path}`}
        />
      </div>
      <div className={styles.movieCardInfo}>
        <h1 className={styles.title}>{movie.title}</h1>
        <p className={styles.description}>{movie.overview}</p>
        <div className={styles.lesserInfoDiv}>
          <span className={styles.description}>
            <b>Release Date:</b> {movieDate.toLocaleDateString()}
          </span>
          <span>
            <b>Genres:</b> {movieGenres.join(", ")}
          </span>
          <span>
            <b>Movie Duration:</b> {movie.runtime} minutes
          </span>
          <span>
            <b>Rate:</b> {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default MovieDetailCard
