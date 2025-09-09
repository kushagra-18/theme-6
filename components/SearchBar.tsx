"use client";

import { useState, useEffect, useRef } from "react";
import { Post } from "@/lib/blazeblog";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 300); // 300ms delay
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (debouncedQuery) {
      setIsLoading(true);
      fetch(`/api/search?q=${debouncedQuery}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.posts || []);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Search fetch error:", err);
          setIsLoading(false);
          setResults([]);
        });
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  return (
    <div className="relative" ref={searchRef}>
      <div className="form-control">
        <input
          type="text"
          placeholder="Search…"
          className="input input-bordered w-48 md:w-64 bg-base-100 text-base-content placeholder-base-content/60 focus:border-primary"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
      </div>
      {isFocused && (query.length > 0) && (
        <div className="absolute mt-2 w-full md:w-96 max-h-96 overflow-y-auto rounded-box shadow-2xl bg-base-100 text-base-content border border-base-300 z-20 right-0">
          {isLoading && <div className="p-4 text-center opacity-70">Loading...</div>}
          {!isLoading && results.length === 0 && debouncedQuery && (
            <div className="p-4 text-center opacity-70">No results found.</div>
          )}
          <ul className="menu p-0 divide-y divide-base-200">
            {results.map((post) => (
              <li key={post.id} className="hover:bg-base-200">
                <Link href={`/${post.slug}`} onClick={() => { setQuery(''); setIsFocused(false); }} className="py-3 px-4">
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
