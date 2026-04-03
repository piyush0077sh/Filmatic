import { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Initialize EmailJS - You need to sign up at emailjs.com and get your public key
// Replace 'YOUR_PUBLIC_KEY' with your actual public key from emailjs.com
const EMAILJS_PUBLIC_KEY = 'CG-7uacy-TiUsyUZH';
const EMAILJS_SERVICE_ID = 'service_filmatic';
const EMAILJS_TEMPLATE_ID = 'template_filmatic_feedback';

export default function Feedback() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Initialize EmailJS only if public key is configured
    if (EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      setError('Email service not configured. Please contact us directly.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: 'yashhumai2006@gmail.com',
        from_name: name,
        from_email: email,
        message: message,
        reply_to: email,
      });

      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setError('Failed to send feedback. Please try again or contact us directly.');
      console.error('EmailJS error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-film-900">
      <Navbar />

      <main className="flex-1">
        <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-green-500">
              Get in touch
            </p>
            <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
              Send us your feedback
            </h1>
            <p className="mt-4 text-lg text-film-400">
              Have suggestions, bug reports, or just want to say hi? We'd love to hear from you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-lg border border-film-700 bg-film-800 p-8">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-film-300">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Piyush Singh"
                  className="mt-2 w-full rounded-lg border border-film-700 bg-film-700 px-4 py-3 text-white outline-none transition focus:border-green-600/60 focus:ring-1 focus:ring-green-600/30"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-film-300">
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-lg border border-film-700 bg-film-700 px-4 py-3 text-white outline-none transition focus:border-green-600/60 focus:ring-1 focus:ring-green-600/30"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-film-300">
                  Your Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you think about Filmatic..."
                  rows={6}
                  className="mt-2 w-full rounded-lg border border-film-700 bg-film-700 px-4 py-3 text-white outline-none transition focus:border-green-600/60 focus:ring-1 focus:ring-green-600/30"
                  required
                  minLength={10}
                />
              </div>

              {/* Success Message */}
              {success && (
                <div className="rounded-lg border border-green-600/30 bg-green-950/20 p-4 text-sm text-green-400">
                  ✓ Thanks for your feedback! We'll get back to you soon.
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="rounded-lg border border-red-600/30 bg-red-950/20 p-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-green-600 hover:bg-green-500 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Sending...' : 'Send Feedback'}
              </button>
            </div>
          </form>

          {/* Setup Instructions */}
          {EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY' && (
            <div className="mt-8 rounded-lg border border-orange-600/30 bg-orange-950/20 p-6 text-sm text-orange-400">
              <p className="font-semibold">⚠ Email service not configured</p>
              <p className="mt-2">
                To enable the feedback form:
              </p>
              <ol className="mt-3 space-y-2 ml-4 list-decimal">
                <li>Sign up at <a href="https://www.emailjs.com" target="_blank" rel="noopener noreferrer" className="underline">emailjs.com</a></li>
                <li>Create a new email service</li>
                <li>Get your public key from the dashboard</li>
                <li>Replace 'YOUR_PUBLIC_KEY' in src/pages/Feedback.jsx</li>
              </ol>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
