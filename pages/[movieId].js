import { useRouter } from "next/router"
import Layout from "../layout/Layout"
import {
  getMovie,
  getMovies,
  getMoviesCredit,
} from "../services/moviesServices"
import MovieDetailCard from "../components/movieDetailCard"
import ItemCard from "../components/itemCard"
import { default as homeStyles } from "../styles/Home.module.css"
import styles from "../styles/MovieDetails.module.css"
const Movie = ({ movie, cast, crew }) => {
  const router = useRouter()
  const { movieId } = router.query
  const actors = cast
    ?.filter(person => person.known_for_department === "Acting")
    .slice(0, 10)
  return (
    <Layout>
      <div style={{ padding: 20 }}>
        <div style={{ marginBottom: 20 }}>
          <MovieDetailCard movie={movie} />
        </div>
        <div className={styles.actorsDiv}>
          <h1>Actors</h1>
          <div className={homeStyles.moviesCategoryDiv}>
            {actors?.map(actor => (
              <ItemCard
                title={actor.name}
                subTitle={actor.character}
                photoPath={actor.profile_path}
                key={actor.id}
                buttonText="See More"
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Movie

export async function getStaticPaths() {
  const moviesEndpoints = [
    "upcoming",
    "popular",
    "latest",
    "now_playing",
    "top_rated",
  ]

  // const paths = moviesEndpoints.map(async movieEndpoint => {
  //   const { movies } = await getMovies(movieEndpoint)
  //   movies
  //     .map(movie => {
  //       return { params: { movieId: movie.id.toString() } }
  //     })
  //     .then(res => console.log("res", res))
  // })
  const { movies } = await getMovies("upcoming")
  const paths = movies.map(movie => {
    return { params: { movieId: movie.id.toString() } }
  })

  return {
    paths,
    fallback: true,
  }
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps(context) {
  const { movieId } = context.params
  const { movie } = await getMovie(movieId)
  const { crew, cast } = await getMoviesCredit(movieId)
  return {
    // Passed to the page component as props
    props: { movie, crew, cast },
  }
}
