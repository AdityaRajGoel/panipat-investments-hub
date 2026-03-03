
-- Create unlisted shares table
CREATE TABLE public.unlisted_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  short_code TEXT NOT NULL,
  tag TEXT NOT NULL DEFAULT 'Popular',
  tag_color TEXT NOT NULL DEFAULT 'bg-secondary/10 text-secondary',
  price TEXT NOT NULL,
  min_qty TEXT NOT NULL DEFAULT '1 Share',
  gradient_color TEXT NOT NULL DEFAULT 'from-blue-600 to-blue-800',
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.unlisted_shares ENABLE ROW LEVEL SECURITY;

-- Public read access (everyone can see shares)
CREATE POLICY "Anyone can view active unlisted shares"
ON public.unlisted_shares
FOR SELECT
USING (is_active = true);

-- Seed with current data
INSERT INTO public.unlisted_shares (name, short_code, tag, tag_color, price, min_qty, gradient_color, display_order) VALUES
('National Stock Exchange Ltd (NSE)', 'NSE', 'Most Bought', 'bg-secondary/10 text-secondary', '₹2,060', '1 Share', 'from-indigo-600 to-indigo-800', 1),
('Metropolitan Stock Exchange of India Ltd', 'MSE', 'Top Gainer', 'bg-brand-gold/10 text-brand-gold', '₹5.40', '1 Share', 'from-blue-600 to-blue-800', 2),
('SBI Funds Management Ltd (SBI AMC)', 'SBI', 'Hot Right Now', 'bg-destructive/10 text-destructive', '₹780', '1 Share', 'from-blue-500 to-cyan-600', 3),
('Chennai Super Kings Cricket Ltd (CSK)', 'CSK', 'Hot Right Now', 'bg-destructive/10 text-destructive', '₹265', '1 Share', 'from-yellow-500 to-amber-600', 4),
('NCDEX Ltd', 'NCX', 'Exchange', 'bg-primary/10 text-primary', '₹431', '1 Share', 'from-emerald-600 to-green-700', 5),
('Apollo Green Energy Ltd', 'AGE', 'Hot Right Now', 'bg-destructive/10 text-destructive', '₹80', '30 Shares min', 'from-green-500 to-emerald-600', 6),
('OYO Rooms (Oravel Stays)', 'OYO', 'Popular', 'bg-secondary/10 text-secondary', '₹48', '1 Share', 'from-red-500 to-rose-600', 7),
('Orbis Financial Corporation Ltd', 'OFC', 'Financial', 'bg-primary/10 text-primary', '₹415', '1 Share', 'from-purple-600 to-violet-700', 8),
('PharmEasy (API Holdings Ltd.)', 'PE', 'HealthTech', 'bg-secondary/10 text-secondary', '₹22', '1 Share', 'from-teal-500 to-cyan-600', 9);
