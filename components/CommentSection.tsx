"use client";

import { useEffect, useState } from "react";
import { blazeblog, Comment } from "@/lib/blazeblog";

interface CommentsResponseMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Props {
  postId: number;
  postSlug: string;
}

const CommentCard = ({ comment }: { comment: Comment }) => {
  const date = new Date(comment.createdAt);
  const dateStr = isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const initials = String(comment.authorName || '?').trim().slice(0, 1).toUpperCase();
  return (
    <div className="p-4 rounded-xl border border-base-300 bg-base-100">
      <div className="flex items-start gap-3">
        <div className="avatar placeholder">
          <div className="w-10 rounded-full bg-neutral-focus text-neutral-content">
            <span>{initials}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div className="font-semibold truncate">{comment.authorName}</div>
            <time className="text-xs opacity-70 shrink-0">{dateStr}</time>
          </div>
          <div className="mt-1 text-base-content/90 whitespace-pre-wrap leading-relaxed">{comment.content}</div>
        </div>
      </div>
    </div>
  );
};

export default function CommentSection({ postId, postSlug }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [meta, setMeta] = useState<CommentsResponseMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = async (p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const { comments: list, meta: m } = await blazeblog.getComments(postSlug, p, 5);
      setComments(p === 1 ? list : [...comments, ...list]);
      setMeta(m);
      setPage(p);
    } catch (e: any) {
      setError(e?.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, postSlug]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);
    try {
      const res = await blazeblog.createCommentByPostId({
        postId,
        authorName,
        authorEmail,
        content,
      });
      if (res?.data) {
        setComments([res.data, ...comments]);
        setAuthorName("");
        setAuthorEmail("");
        setContent("");
        setMessage(res.message || 'Thanks! Your comment was received.');
      } else {
        setMessage('Thanks! Your comment was received.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  const canLoadMore = meta ? page < meta.totalPages : false;

  const totalCount = meta?.total ?? comments.length;

  return (
    <section className="mt-16 border-t border-base-300 pt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Comments</h2>
        <span className="badge badge-ghost">{totalCount}</span>
      </div>

      <div className="rounded-2xl border border-base-300 bg-base-100 p-5 mb-8">
        <h3 className="text-lg font-semibold mb-3">Leave a comment</h3>
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="input input-bordered w-full" placeholder="Name" value={authorName} onChange={e => setAuthorName(e.target.value)} required />
            <input className="input input-bordered w-full" type="email" placeholder="Email" value={authorEmail} onChange={e => setAuthorEmail(e.target.value)} required />
          </div>
          <textarea className="textarea textarea-bordered w-full" rows={4} placeholder="Write your comment..." value={content} onChange={e => setContent(e.target.value)} required />
          <div className="flex items-center gap-3">
            <button type="submit" className={`btn btn-primary ${submitting ? 'loading' : ''}`} disabled={submitting}>Post Comment</button>
            <span className="text-xs opacity-70">Your email will not be published.</span>
          </div>
          {message && <div className="alert alert-success py-2 h-auto min-h-[2rem]"><span>{message}</span></div>}
          {error && <div className="alert alert-error py-2 h-auto min-h-[2rem]"><span>{error}</span></div>}
        </form>
      </div>

      {loading && comments.length === 0 && <div className="text-sm opacity-70">Loading comments…</div>}
      {!loading && comments.length === 0 && !error && (
        <div className="text-sm opacity-70">No comments yet</div>
      )}

      <div className="grid gap-3">
        {comments.map(c => <CommentCard key={c.id} comment={c} />)}
      </div>

      {canLoadMore && (
        <div className="mt-6 text-center">
          <button className="btn btn-outline" onClick={() => load(page + 1)} disabled={loading}>
            {loading ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </section>
  );
}
