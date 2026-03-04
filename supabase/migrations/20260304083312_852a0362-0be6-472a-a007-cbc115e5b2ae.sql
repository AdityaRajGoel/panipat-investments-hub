
-- Add image_url column to unlisted_shares
ALTER TABLE public.unlisted_shares ADD COLUMN image_url TEXT;

-- Create storage bucket for stock logos
INSERT INTO storage.buckets (id, name, public) VALUES ('stock-logos', 'stock-logos', true);

-- Allow public read access to stock logos
CREATE POLICY "Stock logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'stock-logos');

-- Allow authenticated and anonymous uploads via edge function (service role)
-- No insert/update/delete policies needed since edge function uses service role key
