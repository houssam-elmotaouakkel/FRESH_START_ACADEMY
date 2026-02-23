import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi'
import contactService from '../services/contactService'

function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const payload = {
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        subject: data.subject,
        message: data.message,
      }
      await contactService.sendMessage(payload)
      toast.success('Votre message a été envoyé avec succès !')
      reset()
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l\'envoi du message')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: <FiMapPin className="w-6 h-6" />,
      title: 'Adresse',
      content: '123 Rue de l\'Éducation, Casablanca, Maroc'
    },
    {
      icon: <FiPhone className="w-6 h-6" />,
      title: 'Téléphone',
      content: '+212 5 22 00 00 00'
    },
    {
      icon: <FiMail className="w-6 h-6" />,
      title: 'Email',
      content: 'contact@freshstart.ma'
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      title: 'Horaires',
      content: 'Lun - Ven: 9h - 18h'
    }
  ]

  return (
    <div>
      {/* Header */}
      <section className="gradient-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white">Contactez-nous</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Une question ? N'hésitez pas à nous contacter. Notre équipe vous répondra dans les plus brefs délais.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Envoyez-nous un message
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      {...register('firstName', {
                        required: 'Le prénom est requis'
                      })}
                      className={`${errors.firstName ? 'border-red-500' : ''}`}
                      placeholder="Votre prénom"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      {...register('lastName', {
                        required: 'Le nom est requis'
                      })}
                      className={`${errors.lastName ? 'border-red-500' : ''}`}
                      placeholder="Votre nom"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'L\'email est requis',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email invalide'
                      }
                    })}
                    className={`${errors.email ? 'border-red-500' : ''}`}
                    placeholder="votre@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Sujet *
                  </label>
                  <select
                    {...register('subject', {
                      required: 'Le sujet est requis'
                    })}
                    className={`${errors.subject ? 'border-red-500' : ''}`}
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="information">Demande d'information</option>
                    <option value="inscription">Inscription</option>
                    <option value="cours">Question sur les cours</option>
                    <option value="autre">Autre</option>
                  </select>
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    rows="5"
                    {...register('message', {
                      required: 'Le message est requis',
                      minLength: {
                        value: 10,
                        message: 'Le message doit contenir au moins 10 caractères'
                      }
                    })}
                    className={`${errors.message ? 'border-red-500' : ''}`}
                    placeholder="Votre message..."
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    'Envoi en cours...'
                  ) : (
                    <>
                      <FiSend />
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Informations de contact
              </h2>
              <div className="space-y-6 mb-8">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-secondary-100 rounded-xl"
                  >
                    <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center text-white flex-shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{info.title}</h3>
                      <p className="text-gray-600">{info.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="bg-secondary-200 rounded-xl h-64 flex items-center justify-center">
                <p className="text-gray-500">Carte Google Maps</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-secondary-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Questions Fréquentes
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: 'Comment puis-je m\'inscrire à un cours ?',
                a: 'Vous pouvez vous inscrire directement sur notre site en créant un compte, puis en sélectionnant le cours de votre choix.'
              },
              {
                q: 'Quels sont les modes de paiement acceptés ?',
                a: 'Nous acceptons les paiements par carte bancaire, virement et espèces sur place.'
              },
              {
                q: 'Puis-je essayer un cours avant de m\'inscrire ?',
                a: 'Oui, nous offrons une première séance d\'essai gratuite pour tous nos cours.'
              }
            ].map((faq, index) => (
              <div key={index} className="card p-6">
                <h3 className="font-semibold text-gray-800 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
