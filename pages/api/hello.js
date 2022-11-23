// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios"
const baseURL =
  "https://api.themoviedb.org/3/movie/76341?api_key=6d2e5d2be49fdfb5a407b6bdfdcaea60"
export default (req, res) => {
  res.status(200).json({ name: "John Doe" })
}
