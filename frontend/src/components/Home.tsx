"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import API_URLS from "../config/api"
import Header from "./Header"
import Banner from "./Banner"
import { Search, Calendar, Clock, User, Video } from "lucide-react"

interface Movie {
  id: number
  nameMovie: string
  releaseDate: string
  durationMovie: string
  actor: string
  director: string
  studio: string
  content: string
  trailer: string
  avatar: string
  statusFilmId: StatusFilm
}

interface StatusFilm {
  id: number
  name: string
}

export default function Home() {
  const { t, i18n } = useTranslation()
  const [movies, setMovies] = useState<Movie[] | null>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const filteredMovies = movies?.filter((movie) => movie.nameMovie.toLowerCase().includes(searchTerm.toLowerCase()))

  useEffect(() => {
    setIsLoading(true)
    axios
        .get(API_URLS.MOVIE.list, {
          headers: { "Accept-Language": i18n.language },
        })
        .then((res) => {
          setMovies(res.data)
          setIsLoading(false)
        })
        .catch((err) => {
          console.error("Lỗi khi tải danh sách phim:", err)
          toast.error(t("movie.notfound"))
          setIsLoading(false)
        })
  }, [t, i18n.language])

  return (  
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />

        <main className="flex-grow">
          <Banner />

          {/* Search and Title Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">


              {/* Enhanced Search Bar */}
              <div className="relative w-full lg:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder={t("movie.search")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 shadow-sm"
                />
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                          <div className="h-64 bg-gray-200"></div>
                          <div className="p-6">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
            )}

            {/* Movies Grid */}
            {!isLoading && (
                <>
                  {filteredMovies && filteredMovies.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                        {filteredMovies.map((movie) => (
                            <div
                                key={movie.id}
                                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200"
                            >
                              {/* Movie Poster */}
                              <div className="relative overflow-hidden">
                                <img
                                    src={movie.avatar || "/placeholder.svg"}
                                    alt={movie.nameMovie}
                                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>

                                {/* Status Badge */}
                                <div className="absolute top-4 left-4">
                          {/*<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">*/}
                          {/*  {movie.statusFilmId.name}*/}
                          {/*</span>*/}
                                </div>
                              </div>

                              {/* Movie Info */}
                              <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem]">
                                  {movie.nameMovie}
                                </h3>

                                {/* Movie Details */}
                                <div className="space-y-2 mb-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{movie.releaseDate}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>{movie.durationMovie}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span className="truncate">{movie.director}</span>
                                  </div>
                                </div>

                                {/* Action Button */}
                                <Link to={`/movie/${movie.id}`} className="block">
                                  <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg">
                                    <Video className="h-4 w-4" />
                                    {t("movie.detail")}
                                  </button>
                                </Link>
                              </div>
                            </div>
                        ))}
                      </div>
                  ) : (
                      /* No Results State */
                      <div className="text-center py-16">
                        <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                          <Search className="h-full w-full" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No movies found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your search terms or browse all movies</p>
                        <button
                            onClick={() => setSearchTerm("")}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                        >
                          Clear search
                        </button>
                      </div>
                  )}
                </>
            )}
          </div>
        </main>

      </div>
  )
}
