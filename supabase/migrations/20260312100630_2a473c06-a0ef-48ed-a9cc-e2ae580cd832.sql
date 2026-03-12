CREATE TABLE public.blog_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'basics',
  cover_image text,
  read_time integer NOT NULL DEFAULT 5,
  published boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published articles"
ON public.blog_articles
FOR SELECT
TO public
USING (published = true);