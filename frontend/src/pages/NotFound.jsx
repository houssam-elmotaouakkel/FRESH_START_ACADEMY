import { Link } from 'react-router-dom'
import { FiHome, FiArrowLeft } from 'react-icons/fi'

function NotFound() {
  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="gradient-primary text-white text-9xl font-bold w-64 h-64 rounded-full flex items-center justify-center mx-auto mb-8">
          404
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Page non trouvée
        </h1>
        <p className="text-xl text-secondary-600 mb-8 max-w-md mx-auto">
          Oups ! La page que vous recherchez semble avoir disparu ou n'existe pas.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary flex items-center justify-center gap-2">
            <FiHome />
            Retour à l'accueil
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <FiArrowLeft />
            Page précédente
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound