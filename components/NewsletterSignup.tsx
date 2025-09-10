"use client";

import { useState } from "react";
import { blazeblog } from "@/lib/blazeblog";

type Props = { compact?: boolean };

export default function NewsletterSignup({ compact = false }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await blazeblog.subscribeToNewsletter({ email, name: name || undefined });
      if (res?.message) setMessage(res.message);
      else setMessage("Thanks for subscribing!");
      setEmail("");
      setName("");
    } catch (err: any) {
      const msg = err?.message || "Subscription failed. Please try again later.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-base-200 rounded-lg ${compact ? 'my-4 max-w-xl mx-auto' : 'my-12'}`}>
      <div className={`${compact ? 'px-4 py-6' : 'container mx-auto px-4 py-10'} text-center`}>
        <h2 className={`${compact ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'} font-bold`}>Subscribe to our newsletter</h2>
        <p className={`mt-3 ${compact ? 'text-base' : 'text-lg'} text-base-content/70`}>Get the latest stories, weekly.</p>
        <form onSubmit={onSubmit} className={`mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 ${compact ? 'max-w-lg' : 'max-w-2xl'} mx-auto`}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input input-bordered w-full sm:flex-1 bg-base-100"
            aria-label="Email address"
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name (optional)"
            className="input input-bordered w-full sm:w-56 bg-base-100"
            aria-label="Name"
          />
          <button type="submit" className={`btn btn-primary w-full sm:w-auto ${loading ? 'loading' : ''}`} disabled={loading}>
            {loading ? 'Subscribing' : 'Subscribe'}
          </button>
        </form>
        {message && <div className="alert alert-success mt-4 justify-center"><span>{message}</span></div>}
        {error && <div className="alert alert-error mt-4 justify-center"><span>{error}</span></div>}
      </div>
    </div>
  );
}
