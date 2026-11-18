-- Perbarui path gambar thumbnail per tipe sepatu di tabel public.products Supabase
-- Jalankan di Supabase Dashboard -> SQL Editor

-- 1. Vans Sk8-Low Contrast Black (Full Black Suede)
UPDATE public.products
SET thumbnails = '[
  {"label":"SAMPING","image":"/images/prod-sk8low-contrast-176857.png"},
  {"label":"DETAIL","image":"/images/sk8low-contrast-detail.png"},
  {"label":"OUTSOLE","image":"/images/sk8low-contrast-outsole.jpg"},
  {"label":"BOX ASLI","image":"/images/sk8low-contrast-box.jpg"}
]'::jsonb
WHERE id = 'vans-sk8-low-contrast';

-- 2. Vans Sk8-Low Classic Black White (White Sidestripe & Midsole)
UPDATE public.products
SET thumbnails = '[
  {"label":"SAMPING","image":"/images/prod-sk8low-classic-176857.png"},
  {"label":"DETAIL","image":"/images/sk8low-classic-detail.jpg"},
  {"label":"OUTSOLE","image":"/images/sk8low-classic-outsole.jpg"},
  {"label":"BOX ASLI","image":"/images/sk8low-classic-box.jpg"}
]'::jsonb
WHERE id = 'vans-sk8-low-classic';

-- 3. Vans Old Skool Classic
UPDATE public.products
SET thumbnails = '[
  {"label":"SAMPING","image":"/images/prod-oldskool-classic-176857.png"},
  {"label":"DETAIL","image":"/images/oldskool-classic-detail.jpg"},
  {"label":"OUTSOLE","image":"/images/oldskool-classic-outsole.jpg"},
  {"label":"BOX ASLI","image":"/images/oldskool-classic-box.jpg"}
]'::jsonb
WHERE id = 'vans-old-skool-classic';

-- 4. Vans Authentic Racing Red
UPDATE public.products
SET thumbnails = '[
  {"label":"SAMPING","image":"/images/prod-authentic-red-176857.png"},
  {"label":"DETAIL","image":"/images/authentic-red-detail.jpg"},
  {"label":"OUTSOLE","image":"/images/authentic-red-outsole.jpg"},
  {"label":"BOX ASLI","image":"/images/authentic-red-box.png"}
]'::jsonb
WHERE id = 'vans-authentic-red';

-- 5. Vans Authentic Classic Black White
UPDATE public.products
SET thumbnails = '[
  {"label":"SAMPING","image":"/images/prod-authentic-black-176857.png"},
  {"label":"DETAIL","image":"/images/authentic-black-detail.jpg"},
  {"label":"OUTSOLE","image":"/images/authentic-black-outsole.jpg"},
  {"label":"BOX ASLI","image":"/images/authentic-black-box.jpg"}
]'::jsonb
WHERE id = 'vans-authentic-black';

-- 6. Vans Realm Backpack Black (22L)
UPDATE public.products
SET thumbnails = '[
  {"label":"DEPAN","image":"/images/prod-realm-backpack-176857.png"},
  {"label":"DETAIL","image":"/images/backpack-detail.png"},
  {"label":"MATERIAL","image":"/images/backpack-material.jpg"},
  {"label":"TAG ASLI","image":"/images/backpack-compartment.jpg"}
]'::jsonb
WHERE id = 'vans-realm-backpack';
