
ALTER TABLE public.unlisted_shares 
ADD COLUMN buy_price text,
ADD COLUMN sell_price text,
ADD COLUMN company_description text,
ADD COLUMN sector text DEFAULT 'General',
ADD COLUMN founded_year text,
ADD COLUMN headquarters text;
