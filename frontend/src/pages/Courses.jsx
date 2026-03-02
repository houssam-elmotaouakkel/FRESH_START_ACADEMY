import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaSearch, FaFilter, FaGraduationCap, FaChevronRight, FaTimes } from 'react-icons/fa';
import courseService from '../services/courseService';
import { formatPrice } from '../utils/helpers';
import { COURSE_CATEGORIES, COURSE_LEVELS } from '../utils/constants';

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [level, setLevel] = useState(searchParams.get('level') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 9,
        isActive: true,
        ...(search && { search }),
        ...(category && { category }),
        ...(level && { level }),
      };

      const response = await courseService.getAllCourses(params);
      setCourses(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, level]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (level) params.set('level', level);
    if (page > 1) params.set('page', String(page));
    setSearchParams(params);
  }, [search, category, level, page, setSearchParams]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setLevel('');
    setPage(1);
    setShowFilters(false);
  };

  const hasActiveFilters = search || category || level;

  return (
    <div className="min-h-screen">
      <section className="gradient-primary text-white">
        <div className="content-wrap px-4 py-14">
          <p className="text-xs uppercase tracking-[0.24em] text-secondary-100/85 mb-2">Catalogue</p>
          <h1 className="section-title text-white mb-4">Choisissez votre programme</h1>
          <p className="text-white/85 max-w-2xl">
            Parcourez les cours disponibles et filtrez selon votre niveau, objectif et disponibilite.
          </p>
        </div>
      </section>

      <div className="content-wrap px-4 py-10">
        <div className="card p-5 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-600" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un cours..."
                className="pl-10"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="lg:hidden btn-secondary"
            >
              <FaFilter />
              Filtres
            </button>

            <div className="hidden lg:flex gap-3">
              <select
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">Toutes categories</option>
                {Object.entries(COURSE_CATEGORIES).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>

              <select
                value={level}
                onChange={(event) => {
                  setLevel(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">Tous niveaux</option>
                {Object.entries(COURSE_LEVELS).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-primary">
              Rechercher
            </button>
          </form>

          {showFilters && (
            <div className="lg:hidden mt-4 pt-4 border-t border-secondary-200/70 grid grid-cols-2 gap-3">
              <select
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">Categorie</option>
                {Object.entries(COURSE_CATEGORIES).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
              <select
                value={level}
                onChange={(event) => {
                  setLevel(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">Niveau</option>
                {Object.entries(COURSE_LEVELS).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>
          )}

          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-secondary-700">Filtres actifs:</span>
              {search && (
                <span className="chip">
                  Recherche: {search}
                  <button className="ml-2" onClick={() => setSearch('')} type="button">
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              )}
              {category && (
                <span className="chip">
                  {COURSE_CATEGORIES[category]}
                  <button className="ml-2" onClick={() => setCategory('')} type="button">
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              )}
              {level && (
                <span className="chip">
                  {COURSE_LEVELS[level]}
                  <button className="ml-2" onClick={() => setLevel('')} type="button">
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button onClick={clearFilters} type="button" className="text-sm text-error-500 hover:text-error-600">
                Effacer
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="spinner" /></div>
        ) : courses.length === 0 ? (
          <div className="card py-16 px-8 text-center">
            <FaGraduationCap className="mx-auto h-16 w-16 text-secondary-400 mb-4" />
            <h3 className="text-xl font-medium text-primary-900 mb-2">Aucun cours trouve</h3>
            <p className="text-secondary-700 mb-6">
              Modifiez vos filtres ou revenez a une recherche plus large.
            </p>
            <button onClick={clearFilters} type="button" className="btn-primary">
              Voir tous les cours
            </button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <article key={course.id} className="card overflow-hidden flex flex-col">
                  <div className="h-44 gradient-primary text-white p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="chip bg-white/15 text-white border border-white/30">
                        {COURSE_CATEGORIES[course.category] || course.category}
                      </span>
                      {!course.isActive && (
                        <span className="chip bg-error-500/90 text-white">Indisponible</span>
                      )}
                    </div>
                    <p className="text-white/90 text-sm">
                      Niveau: {COURSE_LEVELS[course.level] || course.level}
                    </p>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-semibold text-primary-900 mb-2">{course.title}</h3>
                    <p className="text-secondary-700 mb-5 flex-1">{course.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-secondary-200/70">
                      <span className="text-2xl font-bold text-primary-700">
                        {formatPrice(course.price)}
                      </span>
                      <Link to={`/courses/${course.id}`} className="btn-secondary text-sm">
                        Details
                        <FaChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <nav className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    className="btn-secondary text-sm disabled:opacity-50"
                  >
                    Precedent
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-secondary-800">
                    Page {page} / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={page === totalPages}
                    className="btn-secondary text-sm disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
