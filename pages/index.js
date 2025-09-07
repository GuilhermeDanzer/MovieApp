'use client'
import Head from 'next/head'
import { useState, useRef, useEffect, useCallback } from 'react'
import styles from '../styles/Home.module.css'
import { getMovies, search } from '../services/moviesServices'
import ItemCard from '../components/itemCard'
import Layout from '../layout/Layout'
import { getGenres } from '../utils/getGenres'
export default function Home({ propsMovies, current_page, max_page }) {
  const categories = [
    {
      category: 'Upcoming',
      value: 'upcoming',
      selected: false,
    },
    {
      category: 'Popular',
      value: 'popular',
      selected: false,
    },
    {
      category: 'Now Playing',
      value: 'now_playing',
      selected: false,
    },
    {
      category: 'Top Rated',
      value: 'top_rated',
      selected: false,
    },
  ]
  const [movies, setMovies] = useState(propsMovies)
  const [moviesEndpoint, setMoviesEndpoint] = useState('/upcoming')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(currentPage < max_page)
  const [searchTerm, setSearchTerm] = useState('')

  const observer = useRef()
  const lastMovieElementRef = useCallback(
    node => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          fetchMoreData()
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore]
  )
  const fetchMoreData = async () => {
    if (hasMore === false) return
    setLoading(loading => !loading)
    const { movies: fetchedMovies, current_page } = searchTerm
      ? await search(searchTerm, currentPage + 1)
      : await getMovies(moviesEndpoint, currentPage + 1)

    setMovies(movies => [...movies, ...fetchedMovies])
    setCurrentPage(currentPage => current_page)
    setHasMore(hasMore => currentPage < max_page)
    setLoading(loading => !loading)
  }

  const changeMovieEndpoint = async (value = moviesEndpoint) => {
    setLoading(loading => true)
    setMovies(movies => [])
    setMoviesEndpoint(moviesEndpoint => value)
    setSearchTerm(searchTerm => '')
    const { movies: fetchedMovies } = await getMovies(value, 1)

    setMovies(movies => (fetchedMovies ? fetchedMovies : []))
    setCurrentPage(currentPage => 1)
    setLoading(loading => false)
  }

  const fetchSearchData = async () => {
    const { movies: fetchedMovies, current_page } = await search(searchTerm, 1)

    setMovies(movies => [...fetchedMovies])
    setCurrentPage(currentPage => current_page)

    setLoading(loading => false)
  }

  useEffect(() => {
    setMovies(movies => [])
    setLoading(loading => true)

    const delayDebounceFn = setTimeout(
      () => {
        searchTerm ? fetchSearchData() : changeMovieEndpoint()
      },
      searchTerm ? 3000 : 100
    )

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Movies List</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={styles.moviesCategoryDiv}>
          <input
            autoFocus
            type="text"
            autoComplete="off"
            className={styles.searchBar}
            placeholder="Search here..."
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.moviesCategoryDiv}>
          {categories.map((item, i) => {
            return (
              <div
                key={i}
                onClick={() => changeMovieEndpoint(item.value)}
                className={
                  item.value === moviesEndpoint
                    ? `${styles.moviesCategoryButton} ${styles.moviesCategoryButtonSelected}`
                    : styles.moviesCategoryButton
                }>
                {item.category}
              </div>
            )
          })}
        </div>
        {(!loading && movies.length < 1) || movies.length > 0 ? (
          <div className={styles.cardDisplay}>
            {movies.map((movie, index) => {
              if (movies.length === index + 1) {
                return (
                  <ItemCard
                    ref={lastMovieElementRef}
                    key={movie.id}
                    title={movie.title}
                    subTitle={getGenres(movie.genre_ids).join(', ')}
                    photoPath={movie.poster_path}
                    buttonAction={`/${movie.id}`}
                    buttonText="See Details"
                  />
                )
              } else {
                return (
                  <ItemCard
                    key={movie.id}
                    title={movie.title}
                    subTitle={getGenres(movie.genre_ids).join(', ')}
                    photoPath={movie.poster_path}
                    buttonAction={`/${movie.id}`}
                    buttonText="See Details"
                  />
                )
              }
            })}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 20,
            }}>
            <span className={styles.loader}></span>
          </div>
        )}
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const { movies, current_page, max_page } = await getMovies('/upcoming')

  return {
    props: {
      propsMovies: movies,
      current_page,
      max_page,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 60, // In seconds
  }
}
