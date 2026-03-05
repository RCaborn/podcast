-- ============================================================
-- Counter Culture — seed data
-- ============================================================
-- NOTE: In a real Supabase project the profile rows would be
-- created via an auth trigger after sign-up. Here we insert
-- them directly with deterministic UUIDs so foreign keys work.
-- ============================================================

-- ---------- auth stub users ----------
-- Supabase requires auth.users rows to exist before profiles
-- (profiles.id references auth.users on delete cascade).
-- We insert minimal rows with deterministic UUIDs so the seed
-- is self-contained. Passwords are bcrypt hashes of "password123".

insert into auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, aud, role, raw_app_meta_data, raw_user_meta_data, created_at, updated_at) values
(
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'rosa@example.com',
  '$2a$10$Q7RHDX5m1LS0YEKfBsTd8eYi1Fvv0XaGn0vG3jPzJQxOKqHB9UJXe',
  now(), 'authenticated', 'authenticated',
  '{"provider":"email","providers":["email"]}',
  '{}', now(), now()
),
(
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'marcus@example.com',
  '$2a$10$Q7RHDX5m1LS0YEKfBsTd8eYi1Fvv0XaGn0vG3jPzJQxOKqHB9UJXe',
  now(), 'authenticated', 'authenticated',
  '{"provider":"email","providers":["email"]}',
  '{}', now(), now()
),
(
  '33333333-3333-3333-3333-333333333333',
  '00000000-0000-0000-0000-000000000000',
  'fiona@example.com',
  '$2a$10$Q7RHDX5m1LS0YEKfBsTd8eYi1Fvv0XaGn0vG3jPzJQxOKqHB9UJXe',
  now(), 'authenticated', 'authenticated',
  '{"provider":"email","providers":["email"]}',
  '{}', now(), now()
);

-- ---------- profiles ----------

insert into public.profiles (id, full_name, shop_name, location, bio, avatar_initials, avatar_colour, trade_type, region, years_trading, tagline, shop_photo_url, shop_photo_caption) values
(
  '11111111-1111-1111-1111-111111111111',
  'Rosa Capaldi',
  'Rosa''s Deli',
  'Edinburgh',
  'Third-generation Italian-Scot running an Edinburgh institution since 2012. Obsessed with nduja, natural wine, and keeping the neighbourhood fed properly.',
  'RC',
  'terracotta',
  'deli',
  'Lothian',
  12,
  'Family deli, Edinburgh Old Town. Nduja, natural wine, and too many opinions.',
  'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80',
  'The counter at Rosa''s Deli'
),
(
  '22222222-2222-2222-2222-222222222222',
  'Marcus Webb',
  'The Corner Larder',
  'Bristol',
  'Former chef turned shopkeeper. Opened The Corner Larder in Bedminster in 2019. Sourdough evangelist. Believes every neighbourhood deserves a proper counter.',
  'MW',
  'olive',
  'deli',
  'West of England',
  4,
  'Bristol deli with a focus on South West producers.',
  'https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&q=80',
  'Morning prep at The Corner Larder'
),
(
  '33333333-3333-3333-3333-333333333333',
  'Fiona Hartley',
  'Hartley & Daughters',
  'Hebden Bridge',
  'Runs a farmshop-meets-deli in the Calder Valley with her daughter Nell. Champions small Yorkshire producers and refuses to stock anything that travels more than fifty miles.',
  'FH',
  'sienna',
  'farm-shop',
  'West Yorkshire',
  11,
  'Third-generation farm shop. Yorkshire producers only.',
  'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&q=80',
  'The cheese room, stocked for Christmas'
);

-- ---------- articles ----------

insert into public.articles (title, slug, excerpt, body, tag, author_name, author_source, read_time, card_style, issue_number, image_url, is_featured, published_at) values

-- 1: Newsletter Issue 12
(
  'Why the best delis aren''t thinking about competing with supermarkets anymore',
  'best-delis-not-competing',
  'A new generation of deli owners have stopped chasing volume and started building something the multiples can''t replicate: genuine community.',
  E'For years the advice was the same. Differentiate. Stock what Tesco can''t. Find your niche. And it wasn''t bad advice — it just wasn''t the whole picture. Because the smartest deli owners we spoke to this month aren''t thinking about supermarkets at all.\n\nTake Rosa Capaldi at Rosa''s Deli in Edinburgh. "I stopped reading trade press that compared us to multiples about three years ago," she told us. "The comparison is meaningless. We''re not in the same business. They sell groceries. I sell a reason to walk down the street." Her shop runs a monthly supper club in the back room, hosts a cheesemaker every Saturday morning, and has a loyalty scheme based on handwritten postcards. Footfall is up 22% year on year.\n\nThe pattern is consistent across every thriving independent we visited. They''ve stopped defining themselves by what they''re not and started building around what only they can offer: a human being behind the counter who actually knows the difference between a Comté aged twelve months and one aged twenty-four. A place where someone remembers your name, asks about your week, and slips an extra olive into the bag.\n\nThis isn''t sentimentality. It''s strategy. When you stop competing on range and price — battles you will always lose — you free up energy to compete on the one axis the supermarkets can never touch: genuine, unreplicable, deeply local community. And that, it turns out, is worth a great deal more than a discount on cheddar.',
  'Newsletter',
  'Counter Culture Editorial',
  'Counter Culture Weekly',
  7,
  'light',
  12,
  null,
  false,
  '2026-02-28T09:00:00Z'
),

-- 2: Success Story (FEATURED with image)
(
  'We stopped trying to stock everything. Sales went up 40%.',
  'stopped-stocking-everything',
  'When Marcus Webb cut his product range by half, his regulars thought he''d lost it. Twelve months later, the numbers told a very different story.',
  E'Eighteen months ago Marcus Webb stood in the middle of The Corner Larder in Bristol and counted 1,247 different products on his shelves. "I was exhausted," he says. "I was spending more time managing stock than talking to customers. Something had to give."\n\nThe decision was radical. He cut the range to around 600 lines, removing anything he couldn''t personally vouch for. Duplicates went first — did he really need four brands of olive oil when he only believed in one? Then the ''just-in-case'' stock, the products he kept because a competitor stocked them, not because anyone was asking.\n\n"The first month was terrifying. A few regulars noticed straight away. One woman told me I was making a mistake." But something unexpected happened. Average basket spend went up almost immediately. "When you take away the noise, people actually look at what''s in front of them. They pick up the thing you''ve chosen for them, they trust the edit." By month six, total revenue was up 28%. By month twelve, 40%.\n\nThe lesson, Marcus says, is one the fashion world learned decades ago: curation is a service. "People don''t come to an independent for infinite choice. They come because they trust you to have already made the choice for them." He now writes a short card for every product explaining why it earned its place on the shelf. "It''s the most powerful thing I''ve ever done for the business."',
  'Success Story',
  'Marcus Webb',
  'The Corner Larder, Bristol',
  6,
  'light',
  null,
  'https://placehold.co/800x600?text=Counter+Culture+Featured',
  true,
  '2026-02-20T09:00:00Z'
),

-- 3: Opinion
(
  'Three things drive footfall in a deli. Most owners only nail one.',
  'three-things-drive-footfall',
  'It''s not about the product. It''s about the rhythm, the ritual, and the reason to return.',
  E'Every deli owner thinks about footfall. Most think about it wrong. They obsess over the product — the new cheese, the seasonal chutney, the Christmas hamper range — and wonder why the numbers plateau. Product matters, of course. But it''s only one of three things that actually drive people through your door on a regular basis.\n\nThe first is rhythm. Your shop needs a weekly heartbeat that people can set their watch by. Fresh bread on Wednesday. New wine on Friday. Tasting samples on Saturday morning. It doesn''t matter what the rhythm is, as long as it exists. Rhythm creates habit, and habit creates footfall.\n\nThe second is ritual. This is different from rhythm. Ritual is personal. It''s the customer who always buys the same sourdough and the same butter every Sunday. It''s the retired gentleman who comes in at 11am for a coffee and a chat. Your job is to notice these rituals and protect them. Move the sourdough to a different shelf and you''ve broken a spell you didn''t know you''d cast.\n\nThe third — and this is the one most owners miss — is the reason to return that has nothing to do with shopping. A community noticeboard. A seat by the window. A monthly event. Something that says: this place is yours, even when you''re not buying. The shops with the best footfall numbers are invariably the ones that understood this. You''re not just selling food. You''re providing a place.',
  'Opinion',
  'Counter Culture Editorial',
  'Counter Culture Weekly',
  5,
  'light',
  null,
  null,
  false,
  '2026-02-14T09:00:00Z'
),

-- 4: Industry News (FEATURED with image)
(
  'The supplier every deli in the north is talking about',
  'supplier-north-talking-about',
  'A small Yorkshire producer is quietly reshaping how independents think about their charcuterie counter.',
  E'If you run a deli anywhere north of Birmingham, chances are someone has mentioned Fell & Furrow to you in the past six months. The Skipton-based charcuterie producer launched in 2024 with three products and a waiting list. They now supply over eighty independent shops across the north of England and southern Scotland, and demand is showing no signs of slowing.\n\nWhat makes them different isn''t the product — though the product is exceptional. It''s the model. Fell & Furrow operate on what founder Jack Whitmore calls "the thirty-mile promise": every ingredient is sourced within thirty miles of their curing room, every pig is from a named farm, and every batch is numbered. "We''re not doing anything revolutionary," Whitmore says. "We''re doing what charcuterie makers in rural France have done for centuries. We''re just doing it in Yorkshire."\n\nFor deli owners, the appeal is obvious. Provenance sells, but only when it''s real. "I''ve had customers actually visit the farms," says Fiona Hartley of Hartley & Daughters in Hebden Bridge. "Try doing that with your supermarket salami." The margins are tighter than mass-produced alternatives, but Hartley says the uplift in basket spend more than compensates. "People buy the story. Then they buy the cheese to go with it, and the bread, and the wine."',
  'Industry News',
  'Counter Culture Editorial',
  'Counter Culture Weekly',
  5,
  'cream',
  null,
  'https://placehold.co/800x600?text=Counter+Culture+Story',
  true,
  '2026-02-07T09:00:00Z'
),

-- 5: Opinion
(
  'Has the farm shop bubble burst? Not exactly.',
  'farm-shop-bubble',
  'The boom is over. What''s left is something more interesting: the farm shops that were always in it for the right reasons.',
  E'Between 2020 and 2023, farm shops were having a moment. Lockdown drove people to local food. Instagram made farmyard aesthetics aspirational. Money poured in — some of it smart, much of it speculative. Pop-up farm shops appeared in converted barns with suspiciously professional branding and a heavy lean on lifestyle over livestock.\n\nNow the correction is underway. Several high-profile openings from that era have quietly closed. Rising energy costs, the end of pandemic-era shopping habits, and a brutal cost-of-living squeeze have thinned the herd. If you only read the headlines, you''d think the whole sector was in trouble.\n\nBut talk to the people who were farming and selling before the boom, and you hear a different story. "We''re fine," says Fiona Hartley, whose family have been selling from their Hebden Bridge site since 2015. "We were fine before the boom and we''re fine after it. The ones who are struggling are the ones who built a farm shop without a farm." The distinction matters. The genuine farm shops — the ones with mud on the floor, awkward opening hours dictated by lambing season, and a counter staffed by someone who can tell you exactly which field your lamb chop came from — those places are trading steadily. Some are even growing.\n\nWhat''s dying isn''t the farm shop. It''s the fantasy of the farm shop — the version that was really just a deli in wellies. And perhaps that''s no bad thing.',
  'Opinion',
  'Counter Culture Editorial',
  'Counter Culture Weekly',
  6,
  'light',
  null,
  null,
  false,
  '2026-01-31T09:00:00Z'
),

-- 6: Newsletter Issue 11
(
  'Your first year behind the counter: a brutally honest timeline',
  'first-year-behind-counter',
  'Month by month, here''s what actually happens when you open an independent food shop. Nobody tells you about month four.',
  E'Month one: euphoria. The shop is open. People come. They buy things. You are living the dream. You post on Instagram. Your mum cries. Strangers tell you how brave you are.\n\nMonth two: the admin hits. VAT returns. Supplier invoices that don''t match delivery notes. A fridge that runs slightly warm. The realisation that you now work every Saturday for the foreseeable future. You still love it, but the romance has a few new scratches.\n\nMonth three: the quiet week. It arrives without warning. Monday to Thursday, almost nobody comes in. You rearrange the shelves twice. You question every decision you''ve ever made. You google "average deli revenue UK" at 2am. This is normal. Everyone goes through it. Nobody talks about it.\n\nMonth four: the first crisis. Could be a supplier going bust, a broken chiller, a one-star review from someone who wanted a product you don''t stock, or simply a week where the numbers don''t add up. This is the month that separates the people who''ll still be here in five years from those who won''t. How you respond to this month defines everything.\n\nMonths five through eight: the grind. Not glamorous. Not terrible. Just work. You learn your customers'' names. You figure out what sells on Tuesdays versus Fridays. You develop opinions about shelf labels. Slowly, imperceptibly, you start to become a shopkeeper.\n\nMonth nine: someone you''ve never met tells you they drove twenty minutes to visit because a friend recommended you. This is the moment. This is the whole thing.\n\nMonths ten through twelve: you stop googling your competitors. You stop comparing your Instagram numbers. You start trusting your own instincts about what belongs on your counter. You''re not the new shop anymore. You''re just the shop. And that''s more than enough.',
  'Newsletter',
  'Counter Culture Editorial',
  'Counter Culture Weekly',
  8,
  'light',
  11,
  null,
  false,
  '2026-01-24T09:00:00Z'
);

-- ---------- threads ----------

insert into public.threads (id, title, category, tags, is_weekly_prompt, prompt_week, author_id, created_at) values
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'This week: have you changed your range in the last year, and what drove the decision?',
  null,
  ARRAY['range', 'buying', 'weekly-prompt'],
  true,
  '2026-W10',
  '11111111-1111-1111-1111-111111111111',
  '2026-03-03T09:00:00Z'
),
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'What''s the one product you''d never drop from your counter, no matter what the margin?',
  'delis',
  ARRAY['range', 'margins'],
  false,
  null,
  '11111111-1111-1111-1111-111111111111',
  '2026-02-25T14:30:00Z'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Anyone else finding it impossible to get good British charcuterie reliably?',
  'butchers',
  ARRAY['suppliers', 'equipment'],
  false,
  null,
  '22222222-2222-2222-2222-222222222222',
  '2026-02-20T10:15:00Z'
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'How do you handle the "it''s cheaper in Tesco" conversation?',
  'general',
  ARRAY['margins', 'first-year'],
  false,
  null,
  '33333333-3333-3333-3333-333333333333',
  '2026-02-18T16:45:00Z'
);

-- ---------- replies ----------

-- Thread 1: "What's the one product you'd never drop..."
insert into public.replies (thread_id, author_id, content, created_at) values
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '11111111-1111-1111-1111-111111111111',
  'I''ll start: our house nduja. Costs me a fortune to make in-house but people drive across the city for it. It''s not about the margin on that one jar — it''s about what it brings through the door.',
  '2026-02-25T14:31:00Z'
),
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '22222222-2222-2222-2222-222222222222',
  'Proper sourdough from a local baker. We sell it practically at cost. But everything else on the counter sells because of it. Take away the bread and the whole rhythm of the shop falls apart.',
  '2026-02-25T15:10:00Z'
),
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '33333333-3333-3333-3333-333333333333',
  'Raw Yorkshire honey from a beekeeper about four miles from the shop. Margin''s thin but the story is incredible — customers stand there reading the label for five minutes. Sells everything around it.',
  '2026-02-25T17:45:00Z'
);

-- Thread 2: "Anyone else finding it impossible to get good British charcuterie..."
insert into public.replies (thread_id, author_id, content, created_at) values
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '22222222-2222-2222-2222-222222222222',
  'It''s been a nightmare honestly. Had two suppliers let me down in the last three months. One ghosted me entirely after I''d already listed their stuff. Anyone got reliable contacts in the south west?',
  '2026-02-20T10:16:00Z'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '33333333-3333-3333-3333-333333333333',
  'Have you tried Fell & Furrow up in Skipton? They''re new-ish but incredibly reliable. Everything is sourced within thirty miles and the quality is outstanding. We''ve been stocking them for about six months now.',
  '2026-02-20T11:30:00Z'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '11111111-1111-1111-1111-111111111111',
  'I gave up on finding a single reliable supplier and went direct to three small producers instead. More invoices to manage but the quality is night and day. Happy to share names if you want to DM me.',
  '2026-02-20T14:00:00Z'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '22222222-2222-2222-2222-222222222222',
  'Rosa that would be amazing, will message you. And Fiona — just looked up Fell & Furrow, their coppa looks brilliant. Ordering samples this week.',
  '2026-02-20T16:20:00Z'
);

-- Thread 3: "How do you handle the 'it's cheaper in Tesco' conversation?"
insert into public.replies (thread_id, author_id, content, created_at) values
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '33333333-3333-3333-3333-333333333333',
  'Had this again last Saturday. Bloke picked up our cheddar, looked at the price, and said "I can get a block twice this size in Tesco for three quid." I just smiled and said "You absolutely can." And left it at that.',
  '2026-02-18T16:46:00Z'
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '11111111-1111-1111-1111-111111111111',
  'I used to get defensive about it. Now I just offer them a taste. Nine times out of ten they buy it. You can''t argue with someone''s palate. The cheese does the talking.',
  '2026-02-18T18:00:00Z'
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '22222222-2222-2222-2222-222222222222',
  'Honestly? I think the best response is no response. If someone''s comparing you to a supermarket on price, they''re not your customer yet. Emphasis on yet. Keep being brilliant and they''ll come round or they won''t. Either way, you can''t win that argument at the till.',
  '2026-02-19T09:30:00Z'
);

-- ---------- notices ----------

insert into public.notices (author_id, type, title, body, location, contact_hint) values
(
  '22222222-2222-2222-2222-222222222222',
  'supplier-rec',
  'Anyone used Cannon & Cannon for British charcuterie?',
  'Looking at switching our charcuterie supplier. We''re currently using a big national distributor but want to go more regional / artisan. Has anyone traded with Cannon & Cannon or similar? Interested in margins, minimum orders, reliability.',
  'Bristol',
  'Reply on this thread or DM'
),
(
  '22222222-2222-2222-2222-222222222222',
  'staff-wanted',
  'Part-time cheesemonger wanted — Bristol, 2 days/week',
  'Looking for someone with cheese knowledge (or genuine enthusiasm to learn) for two days a week, Fri/Sat. The Corner Larder is a small team, so personality and reliability matter more than a CV. Happy to train the right person.',
  'Bristol',
  'Reply below or email via profile page'
),
(
  '33333333-3333-3333-3333-333333333333',
  'equipment-for-sale',
  'Berkel flywheel slicer — needs restoration, free to collect',
  'We''ve got a beautiful old Berkel Model 9 that needs some love. Works but the blade guard is damaged. Free to anyone who''ll actually restore it rather than turn it into a doorstop. Collection from Hebden Bridge.',
  'Hebden Bridge',
  'Reply below'
);

-- ---------- display-only directory profiles ----------
-- These are seed-only profiles for the /directory page.
-- Minimal auth stubs required to satisfy the profiles FK constraint.

insert into auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, aud, role, raw_app_meta_data, raw_user_meta_data, created_at, updated_at) values
(
  '44444444-4444-4444-4444-444444444444',
  '00000000-0000-0000-0000-000000000000',
  'tom@example.com',
  '$2a$10$Q7RHDX5m1LS0YEKfBsTd8eYi1Fvv0XaGn0vG3jPzJQxOKqHB9UJXe',
  now(), 'authenticated', 'authenticated',
  '{"provider":"email","providers":["email"]}',
  '{}', now(), now()
),
(
  '55555555-5555-5555-5555-555555555555',
  '00000000-0000-0000-0000-000000000000',
  'nadia@example.com',
  '$2a$10$Q7RHDX5m1LS0YEKfBsTd8eYi1Fvv0XaGn0vG3jPzJQxOKqHB9UJXe',
  now(), 'authenticated', 'authenticated',
  '{"provider":"email","providers":["email"]}',
  '{}', now(), now()
),
(
  '66666666-6666-6666-6666-666666666666',
  '00000000-0000-0000-0000-000000000000',
  'duncan@example.com',
  '$2a$10$Q7RHDX5m1LS0YEKfBsTd8eYi1Fvv0XaGn0vG3jPzJQxOKqHB9UJXe',
  now(), 'authenticated', 'authenticated',
  '{"provider":"email","providers":["email"]}',
  '{}', now(), now()
);

insert into public.profiles (id, full_name, shop_name, location, bio, avatar_initials, avatar_colour, trade_type, region, years_trading, tagline, face_photo_url, shop_photo_url, shop_photo_caption) values
(
  '44444444-4444-4444-4444-444444444444',
  'Tom Priestley',
  'Priestley & Son',
  'Ludlow',
  'Fourth-generation butcher in Ludlow. Tom took over from his dad in 2008 and hasn''t changed the recipe for their pork pies since. Sources everything from farms within twenty miles and still does his own slaughtering on Tuesdays.',
  'TP',
  'charcoal',
  'butcher',
  'Shropshire',
  18,
  'Ludlow butcher. Four generations, same pork pie recipe.',
  NULL,
  'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=800&q=80',
  'The charcuterie rail at Priestley & Son, Ludlow'
),
(
  '55555555-5555-5555-5555-555555555555',
  'Nadia Karim',
  'The Saltbox',
  'Margate',
  'Nadia left restaurant kitchens in 2021 to open a grocer on the Old Town high street. The Saltbox stocks Middle Eastern storecupboard staples alongside Kent-grown fruit and veg. She makes her own dukkah and it outsells everything else in the shop.',
  'NK',
  'brass',
  'grocer',
  'Kent',
  5,
  'Margate grocer. Kent veg, Middle Eastern staples, homemade dukkah.',
  NULL,
  'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80',
  'Morning deliveries at The Saltbox, Margate'
),
(
  '66666666-6666-6666-6666-666666666666',
  'Duncan Greig',
  'Greig''s Cheese',
  'Bury St Edmunds',
  'Runs a tiny cheesemonger on Abbeygate Street with his partner Liz. Duncan trained at Neal''s Yard before going solo in 2017. Keeps a maximum of forty cheeses at any time and knows the maker behind every single one.',
  'DG',
  'sienna',
  'cheesemonger',
  'Suffolk',
  9,
  'Forty cheeses, max. Every one from someone we know by name.',
  NULL,
  'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&q=80',
  'The counter at Greig''s Cheese, Bury St Edmunds'
);

-- Threads for the new directory profiles

insert into public.threads (id, title, category, tags, is_weekly_prompt, prompt_week, author_id, created_at) values
(
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'Butchers: how are you handling the rising cost of offal?',
  'butchers',
  ARRAY['margins', 'suppliers'],
  false,
  null,
  '44444444-4444-4444-4444-444444444444',
  '2026-02-22T11:00:00Z'
),
(
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  'Best way to introduce customers to ingredients they''ve never cooked with?',
  'general',
  ARRAY['range', 'first-year'],
  false,
  null,
  '55555555-5555-5555-5555-555555555555',
  '2026-02-16T09:30:00Z'
),
(
  '77777777-7777-7777-7777-777777777777',
  'Affinage at home — anyone doing their own ageing in a small shop?',
  'cheesemongers',
  ARRAY['equipment', 'range'],
  false,
  null,
  '66666666-6666-6666-6666-666666666666',
  '2026-02-12T14:15:00Z'
);

-- Notices for the new directory profiles

insert into public.notices (author_id, type, title, body, location, contact_hint) values
(
  '44444444-4444-4444-4444-444444444444',
  'staff-wanted',
  'Apprentice butcher wanted — Ludlow, full-time',
  'We''re looking for someone who wants to learn the trade properly. Early starts, cold rooms, and a lot of knife work. No experience needed but you have to actually want to be a butcher — we can tell the difference. Paid above apprentice minimum.',
  'Ludlow',
  'Drop into the shop or reply below'
),
(
  '55555555-5555-5555-5555-555555555555',
  'supplier-rec',
  'Looking for a reliable UK sumac and za''atar supplier',
  'Currently importing direct from Lebanon which is brilliant quality but the lead times are killing me. Anyone know a UK-based supplier doing proper Middle Eastern spices at wholesale? Not supermarket-grade stuff — the real thing.',
  'Margate',
  'DM or reply here'
),
(
  '66666666-6666-6666-6666-666666666666',
  'equipment-for-sale',
  'Secondhand cheese wire cutter — £80, Bury St Edmunds',
  'Upgraded to a new Boska so our old wire cutter needs a home. It''s a sturdy bench-mounted unit, works perfectly, just cosmetically scuffed. Would suit someone starting out. Collection only.',
  'Bury St Edmunds',
  'Reply below or visit the shop'
);

-- ---------- thread reactions ----------

insert into public.thread_reactions (thread_id, author_id, type) values
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '22222222-2222-2222-2222-222222222222',
  'same-here'
),
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '33333333-3333-3333-3333-333333333333',
  'useful'
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '11111111-1111-1111-1111-111111111111',
  'same-here'
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '22222222-2222-2222-2222-222222222222',
  'same-here'
);
