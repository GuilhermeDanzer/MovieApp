import { useRouter } from 'next/router'
import Layout from '../layout/Layout'
import {
  getMovie,
  getMovies,
  getMoviesCredit,
} from '../services/moviesServices'
import MovieDetailCard from '../components/movieDetailCard'
import ItemCard from '../components/itemCard'
import { default as homeStyles } from '../styles/Home.module.css'
import styles from '../styles/MovieDetails.module.css'
import { FaLongArrowAltLeft } from 'react-icons/fa'

const Movie = ({ movie, cast, crew }) => {
  const router = useRouter()

  if (router.isFallback) return null

  const { movieId } = router.query
  const styleBackground = {
    '--background': `url(http://image.tmdb.org/t/p/w500${movie.backdrop_path})`,
  }

  const actors = cast
    ?.filter(person => person.known_for_department === 'Acting')
    .slice(0, 10)
  return (
    <Layout>
      <div style={{ padding: 20 }}>
        <FaLongArrowAltLeft
          size={80}
          color="white"
          cursor="pointer"
          onClick={() => router.back()}
        />
        <div style={{ marginBottom: 20 }}>
          <MovieDetailCard movie={movie} />
        </div>
        <div className={styles.actorsDiv} style={styleBackground}>
          <h1>Actors</h1>
          <div className={homeStyles.moviesCategoryDiv}>
            {actors?.map(actor => (
              <ItemCard
                title={actor.name}
                subTitle={actor.character}
                photoPath={actor.profile_path}
                key={actor.id}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Movie

// ...

export async function getStaticPaths() {
  try {
    const { movies } = await getMovies('upcoming')
    const paths = movies.map(movie => {
      return { params: { movieId: movie.id.toString() } }
    })

    return {
      paths,
      fallback: true,
    }
  } catch (error) {
    console.error('Error fetching movie paths:', error)
    return {
      paths: [],
      fallback: true,
    }
  }
}

export async function getStaticProps(context) {
  try {
    const { movieId } = context.params
    const { movie } = await getMovie(movieId)
    const { crew, cast } = await getMoviesCredit(movieId)
    return {
      // Passed to the page component as props
      props: { movie, crew, cast },
    }
  } catch (error) {
    console.error('Error fetching movie data:', error)
    return {
      props: {
        movie: null,
        crew: null,
        cast: null,
      },
    }
  }
}
