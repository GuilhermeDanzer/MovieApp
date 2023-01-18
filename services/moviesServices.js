// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios"
const baseURL = (endpoint = "", parameters = "") =>
  `https://api.themoviedb.org/3/${endpoint}?api_key=6d2e5d2be49fdfb5a407b6bdfdcaea60${parameters}`

export const getMovies = async (movieEndpoint, page = 1) => {
  const { data } = await axios.get(
    baseURL(`movie/${movieEndpoint}`, `&language=en_US&page=${page}`)
  )
  return {
    movies: data.results,
    current_page: data.page,
    max_page: data.total_pages,
  }
}

export const getMoviesCredit = async movieId => {
  const { data } = await axios.get(
    baseURL(`movie/${movieId}/credits`, "&language=en_US")
  )

  return { crew: data.crew, cast: data.cast }
}

export const getMovie = async movieId => {
  const { data } = await axios.get(
    baseURL(`movie/${movieId}`, "&language=en-US")
  )
  return { movie: data }
}

export const search = async (query, page) => {
  const { data } = await axios.get(
    baseURL("search/movie", `&query=${query}&page=${page}`)
  )
  return {
    movies: data.results,
    current_page: data.page,
    max_page: data.total_pages,
  }
}
