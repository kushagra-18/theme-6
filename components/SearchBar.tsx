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
          className="input input-bordered w-48 md:w-64 bg-neutral-focus text-neutral-content placeholder-neutral-content/50"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
      </div>
      {isFocused && (query.length > 0) && (
        <div className="absolute mt-2 w-full md:w-96 max-h-96 overflow-y-auto rounded-box shadow-2xl bg-neutral text-neutral-content z-20 right-0">
          {isLoading && <div className="p-4 text-center">Loading...</div>}
          {!isLoading && results.length === 0 && debouncedQuery && (
            <div className="p-4 text-center">No results found.</div>
          )}
          <ul className="menu p-0">
            {results.map((post) => (
              <li key={post.id}>
                <Link href={`/${post.slug}`} onClick={() => { setQuery(''); setIsFocused(false); }}>
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
