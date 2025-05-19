// frontend/src/components/GuessingGame/GuessingGame.jsx
import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import SignupFormModal from '../SignupFormModal';
import LoginFormModal from '../LoginFormModal';
import { login } from '../../store/session';
import './GuessingGame.css';

const GuessingGame = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const { setModalContent } = useModal();
  const allCards =
    useMemo(() => ({
      "Personality and Traits": [
        { prompt: "Introvert vs. Extrovert", options: ['Introvert', 'Extrovert'] },
        { prompt: "Optimistic vs. Realist", options: ['Optimistic', 'Realist'] },
        { prompt: "Adventurous vs. Homebody", options: ['Adventurous', 'Homebody'] },
        { prompt: "Morning person vs. Night owl", options: ['Morning person', 'Night owl'] },
        { prompt: "Spontaneous vs. Planner", options: ['Spontaneous', 'Planner'] },
        { prompt: "Organized vs. Messy", options: ['Organized', 'Messy'] },
        { prompt: "Empathic vs. Logical", options: ['Empathic', 'Logical'] },
        { prompt: "Risk-taker vs. Cautious", options: ['Risk-taker', 'Cautious'] },
        { prompt: "Sentimental vs. Pragmatic", options: ['Sentimental', 'Pragmatic'] },
        { prompt: "Glass half full vs. Glass half empty", options: ['Glass half full', 'Glass half empty'] },
      ],
      "Behavioral and Social Preferences": [
        { prompt: "Small group gatherings vs. Big parties", options: ['Small group gatherings', 'Big parties'] },
        { prompt: "Loud in group chats vs. Silent in group chats", options: ['Loud in group chats', 'Silent in group chats'] },
        { prompt: "Loves to travel vs. Homebody on vacation", options: ['Loves to travel', 'Homebody on vacation'] },
        { prompt: "Needs quiet time vs. Always surrounded by noise", options: ['Needs quiet time', 'Always surrounded by noise'] },
        { prompt: "People watcher vs. Talker", options: ['People watcher', 'Talker'] },
        { prompt: "Social butterfly vs. Low-key", options: ['Social butterfly', 'Low-key'] },
        { prompt: "Likes being the center of attention vs. Prefers to stay in the background", options: ['Likes being the center of attention', 'Prefers to stay in the background'] },
        { prompt: "Gives a lot of hugs vs. Not a hugger", options: ['Gives a lot of hugs', 'Not a hugger'] },
        { prompt: "Always early vs. Always running late", options: ['Always early', 'Always running late'] },
        { prompt: "Will start dancing in public vs. Keeps it cool on the dance floor", options: ['Will start dancing in public', 'Keeps it cool on the dance floor'] },
      ],
      "Hobbies and Interests": [
        { prompt: "Art lover vs. Tech geek", options: ['Art lover', 'Tech geek'] },
        { prompt: "Loves reading vs. Loves podcasts", options: ['Loves reading', 'Loves podcasts'] },
        { prompt: "Fitness junkie vs. Netflix binger", options: ['Fitness junkie', 'Netflix binger'] },
        { prompt: "Gamer vs. Non-gamer", options: ['Gamer', 'Non-gamer'] },
        { prompt: "Into crafts/DIY vs. Prefer ready-made stuff", options: ['Into crafts/DIY', 'Prefer ready-made stuff'] },
        { prompt: "Loves cooking vs. Takes-out more than cooks", options: ['Loves cooking', 'Takes-out more than cooks'] },
        { prompt: "Outdoor activities vs. Indoor activities", options: ['Outdoor activities', 'Indoor activities'] },
        { prompt: "Sci-fi fan vs. Fantasy fan", options: ['Sci-fi fan', 'Fantasy fan'] },
        { prompt: "Fan of comics vs. Fan of anime/manga", options: ['Fan of comics', 'Fan of anime/manga'] },
        { prompt: "Enjoys puzzles vs. Enjoys board games", options: ['Enjoys puzzles', 'Enjoys board games'] },
      ],
      "Food and Drink Preferences": [
        { prompt: "Sweet tooth vs. Salty snacks lover", options: ['Sweet tooth', 'Salty snacks lover'] },
        { prompt: "Vegetarian vs. Meat lover", options: ['Vegetarian', 'Meat lover'] },
        { prompt: "Coffee addict vs. Tea enthusiast", options: ['Coffee addict', 'Tea enthusiast'] },
        { prompt: "Spicy food lover vs. Mild food lover", options: ['Spicy food lover', 'Mild food lover'] },
        { prompt: "Cooking a 5-course meal vs. Order takeout every time", options: ['Cooking a 5-course meal', 'Order takeout every time'] },
        { prompt: "Late-night snacks vs. Meal preppers", options: ['Late-night snacks', 'Meal preppers'] },
        { prompt: "Wine enthusiast vs. Beer lover", options: ['Wine enthusiast', 'Beer lover'] },
        { prompt: "Smoothie fan vs. Juice lover", options: ['Smoothie fan', 'Juice lover'] },
        { prompt: "Cook with recipes vs. Cook by feeling", options: ['Cook with recipes', 'Cook by feeling'] },
        { prompt: "Dessert first vs. Appetizer first", options: ['Dessert first', 'Appetizer first'] },
      ],
      "Music, Movies, and TV Shows": [
        { prompt: "Pop music lover vs. Rock music lover", options: ['Pop music lover', 'Rock music lover'] },
        { prompt: "Into indie music vs. Mainstream hits", options: ['Into indie music', 'Mainstream hits'] },
        { prompt: "Horror movie fan vs. Comedy movie fan", options: ['Horror movie fan', 'Comedy movie fan'] },
        { prompt: "Reality TV fan vs. Documentary lover", options: ['Reality TV fan', 'Documentary lover'] },
        { prompt: "Love musicals vs. Prefer action-packed films", options: ['Love musicals', 'Prefer action-packed films'] },
        { prompt: "Binge-watching series vs. Slow and steady watcher", options: ['Binge-watching series', 'Slow and steady watcher'] },
        { prompt: "Spotify playlists vs. Vinyl records", options: ['Spotify playlists', 'Vinyl records'] },
        { prompt: "Sci-fi TV shows vs. True crime shows", options: ['Sci-fi TV shows', 'True crime shows'] },
        { prompt: "Classic movies vs. Modern blockbusters", options: ['Classic movies', 'Modern blockbusters'] },
        { prompt: "Concert-goer vs. Stay-at-home listener", options: ['Concert-goer', 'Stay-at-home listener'] },
      ],
      "Travel and Adventure": [
        { prompt: "Beach vacation vs. Mountain retreat", options: ['Beach vacation', 'Mountain retreat'] },
        { prompt: "Wants to visit Paris vs. Wants to visit Tokyo", options: ['Wants to visit Paris', 'Wants to visit Tokyo'] },
        { prompt: "Road trips vs. Flight to a destination", options: ['Road trips', 'Flight to a destination'] },
        { prompt: "Solo travel vs. Travel with friends", options: ['Solo travel', 'Travel with friends'] },
        { prompt: "Cultural tourism vs. Nature tourism", options: ['Cultural tourism', 'Nature tourism'] },
        { prompt: "Wants to learn a new language vs. Wants to learn new food recipes", options: ['Wants to learn a new language', 'Wants to learn new food recipes'] },
        { prompt: "Adventurous destination vs. Relaxing beach destination", options: ['Adventurous destination', 'Relaxing beach destination'] },
        { prompt: "Travel often vs. Prefer staying local", options: ['Travel often', 'Prefer staying local'] },
        { prompt: "Would love to work abroad vs. Prefer to stay in hometown", options: ['Would love to work abroad', 'Prefer to stay in hometown'] },
      ],
      "Conversation Style and Humor": [
        { prompt: "Sarcastic vs. Straightforward", options: ['Sarcastic', 'Straightforward'] },
        { prompt: "Loves dad jokes vs. Dark humor", options: ['Loves dad jokes', 'Dark humor'] },
        { prompt: "Tells long stories vs. Keeps it short", options: ['Tells long stories', 'Keeps it short'] },
        { prompt: "Love puns vs. Find puns annoying", options: ['Love puns', 'Find puns annoying'] },
        { prompt: "Philosophical vs. Casual talker", options: ['Philosophical', 'Casual talker'] },
        { prompt: "Talks about feelings vs. Keeps emotions inside", options: ['Talks about feelings', 'Keeps emotions inside'] },
        { prompt: "Playful teasing vs. Serious chat", options: ['Playful teasing', 'Serious chat'] },
        { prompt: "Laughs at anything vs. Hard to make laugh", options: ['Laughs at anything', 'Hard to make laugh'] },
        { prompt: "Love debates vs. Avoids arguments", options: ['Love debates', 'Avoids arguments'] },
        { prompt: "Loves to gossip vs. Keeps secrets", options: ['Loves to gossip', 'Keeps secrets'] },
      ],
      "Mindset and Lifestyle": [
        { prompt: "Minimalist vs. Lover of collections", options: ['Minimalist', 'Lover of collections'] },
        { prompt: "Yoga/meditation vs. Gym enthusiast", options: ['Yoga/meditation', 'Gym enthusiast'] },
        { prompt: "Early riser vs. Late-night thinker", options: ['Early riser', 'Late-night thinker'] },
        { prompt: "Planner vs. Go with the flow", options: ['Planner', 'Go with the flow'] },
        { prompt: "Has a routine vs. Lives spontaneously", options: ['Has a routine', 'Lives spontaneously'] },
        {
          prompt: "Sleep is sacred vs. Can function on little sleep", options: ['Sleep is sacred', 'Can function on little sleep']
        },
        { prompt: "Dreamer vs. Doer", options: ['Dreamer', 'Doer'] },
        { prompt: "Workaholic vs. Work to live", options: ['Workaholic', 'Work to live'] },
        { prompt: "Productivity tools lover vs. Keeps it simple", options: ['Productivity tools lover', 'Keeps it simple'] },
        { prompt: "Journaling vs. Digital planner", options: ['Journaling', 'Digital planner'] },
      ],
      "Random Fun Cards": [
        { prompt: "Would rather live in the past vs. Would rather live in the future", options: ['Would rather live in the past', 'Would rather live in the future'] },
        { prompt: "Owns a pet vs. Loves animals but doesn't own one", options: ['Owns a pet', 'Loves animals but doesn\'t own one'] },
        { prompt: "Into conspiracy theories vs. Skeptical of all theories", options: ['Into conspiracy theories', 'Skeptical of all theories'] },
        { prompt: "Would survive in a zombie apocalypse vs. Would probably be the first to go", options: ['Would survive in a zombie apocalypse', 'Would probably be the first to go'] },
        { prompt: "Has a secret talent vs. Has no secret talents", options: ['Has a secret talent', 'Has no secret talents'] },
        { prompt: "Into astrology vs. Doesn't believe in it", options: ['Into astrology', 'Doesn\'t believe in it'] },
        { prompt: "Wants a big family vs. Prefers a small family", options: ['Wants a big family', 'Prefers a small family'] },
        { prompt: "Introverts with extrovert friends vs. Extroverts with introvert friends", options: ['Introverts with extrovert friends', 'Extroverts with introvert friends'] },
        { prompt: "Has an embarrassing childhood story vs. Keeps that info hidden", options: ['Has an embarrassing childhood story', 'Keeps that info hidden'] },
        { prompt: "Believes in ghosts vs. Doesn't believe in them", options: ['Believes in ghosts', 'Doesn\'t believe in them'] }
      ]
    }), []);

  const roastBank = {
    "Personality and Traits": {
      "Introvert": "The human version of airplane mode.",
      "Extrovert": "Probably starts conversations with mannequins.",
      "Optimistic": "Thinks the WiFi will fix itself.",
      "Realist": "Kills dreams for breakfast.",
      "Adventurous": "Will try anything… except replying to texts.",
      "Homebody": "Has frequent flyer miles for their couch.",
      "Morning person": "You're up before the birds, huh? Bet your coffee has a 'please help me' vibe.",
      "Night owl": "You're like a nocturnal creature, but instead of hunting, you're binge-watching Netflix.",
      "Spontaneous": "You don't plan anything, huh? Just wake up and decide life's a game of chance.",
      "Planner": "Your calendar has a schedule for everything—even your bathroom breaks. Chill.",
      "Organized": "Has color-coded spreadsheets for their socks.",
      "Messy": "Can't even find the remote in a two-foot radius.",
      "Empathic": "Probably hugging their WiFi router right now.",
      "Logical": "Can't make small talk without analyzing it first.",
      "Risk-taker": "Has a collection of 'How did I survive that?' stories.",
      "Cautious": "Reads every warning label… even the ones on cereal boxes.",
      "Sentimental": "Keeps a journal for every mood swing.",
      "Pragmatic": "Has no time for emotions, just practical solutions.",
      "Glass half full": "Thinks the glass is a personal growth opportunity.",
      "Glass half empty": "Probably just knocked over the glass for fun."
    },
    "Behavioral and Social Preferences": {
      "Small group gatherings": "Thrives in spaces where the drama is limited.",
      "Big parties": "The center of attention... whether they like it or not.",
      "Loud in group chats": "Their phone's vibrating more than their heart.",
      "Silent in group chats": "Reads every message but responds only after 24 hours.",
      "Loves to travel": "Probably has a passport with more stamps than your diary.",
      "Homebody on vacation": "Vacation? Nah, I'll just Netflix and chill at home.",
      "Needs quiet time": "If it's not a library, it's not a real place.",
      "Always surrounded by noise": "If silence hits, they panic and start talking to the plants.",
      "People watcher": "Their favorite hobby is judging people they've never met.",
      "Talker": "Can turn any five-minute conversation into a TED talk.",
      "Social butterfly": "Can talk to anyone... even in elevators.",
      "Low-key": "Their idea of a party is a quiet walk and a cup of tea.",
      "Likes being the center of attention": "Has an inner monologue that's basically a crowd chant.",
      "Prefers to stay in the background": "The ninja of social events. Silent, unseen, but judging.",
      "Gives a lot of hugs": "Their arms are 90% hug, 10% self-control.",
      "Not a hugger": "Would rather shake hands... awkwardly.",
      "Always early": "They're the kind of person who shows up 15 minutes before the event starts.",
      "Always running late": "Can't even make it to their own reflection on time.",
      "Will start dancing in public": "Probably the only one dancing at a funeral.",
      "Keeps it cool on the dance floor": "Will only move if they have a VIP section."
    },
    "Hobbies and Interests": {
      "Art lover": "Could spend hours staring at a painting and still feel deep.",
      "Tech geek": "Probably has a gadget for everything... including their coffee mug.",
      "Loves reading": "Reads books so long, their Kindle starts giving them advice.",
      "Loves podcasts": "Has a podcast for everything... even if they don't actually listen to them.",
      "Fitness junkie": "Their gym membership gets more action than their social life.",
      "Netflix binger": "Thinks 8 episodes is a 'light binge'.",
      "Gamer": "Has controller-induced thumb calluses.",
      "Non-gamer": "Thinks 'Fortnite' is a fancy ice cream.",
      "Into crafts/DIY": "Their Pinterest boards are practically DIY museums.",
      "Prefer ready-made stuff": "If it can't be delivered with two-day shipping, it's too much effort.",
      "Loves cooking": "Their kitchen is a Michelin-starred disaster.",
      "Takes-out more than cooks": "Their idea of cooking is 'Do we have any leftovers?'",
      "Outdoor activities": "Will climb a mountain just to tell you about it.",
      "Indoor activities": "Their house has a better view than the outdoors.",
      "Sci-fi fan": "Has read more sci-fi than your average alien.",
      "Fantasy fan": "Can explain the entire 'Lord of the Rings' saga in five minutes.",
      "Fan of comics": "Knows the exact difference between Marvel and DC… and it's personal.",
      "Fan of anime/manga": "Can recite entire Naruto episodes... in Japanese.",
      "Enjoys puzzles": "Has an entire closet dedicated to jigsaw pieces.",
      "Enjoys board games": "Knows every rule to Monopoly, even the ones that don't exist."
    },
    "Food and Drink Preferences": {
      "Sweet tooth": "Would trade a kidney for a cupcake.",
      "Salty snacks lover": "Might be 90% sodium at this point.",
      "Coffee addict": "Blood type: Espresso.",
      "Vegetarian": "Ah, a plant-based queen. Saving the world one tofu cube at a time.",
      "Meat lover": "You looked at a cow and said 'mmm personality' didn't you?",
      "Tea enthusiast": "Owns more teas than socks.",
      "Spicy food lover": "Your spice tolerance is probably on the government watchlist.",
      "Mild food lover": "Thinks pepper is too spicy.",
      "Cooking a 5-course meal": "Your oven might be the most used appliance in your house.",
      "Order takeout every time": "Has a food delivery app addiction.",
      "Late-night snacks": "Probably eating chips in bed as we speak.",
      "Meal preppers": "Their fridge looks like an Instagram ad for meal prep services.",
      "Wine enthusiast": "Has a bottle of wine for every occasion... and then some.",
      "Beer lover": "Knows every microbrewery in a 20-mile radius.",
      "Smoothie fan": "Their blender is probably their second best friend.",
      "Juice lover": "Drinks juice like it's a life-source.",
      "Cook with recipes": "Can't cook without a step-by-step guide.",
      "Cook by feeling": "Their secret ingredient is 'I'll just add some more garlic.'",
      "Dessert first": "They believe dessert is a priority, not a choice.",
      "Appetizer first": "Would rather have an appetizer feast than a full meal."
    },
    "Music, Movies, and TV Shows": {
      "Pop music lover": "Thinks Top 40 is the only true music chart.",
      "Rock music lover": "Their playlists are probably older than their parents.",
      "Into indie music": "Has a secret playlist that only five people know about.",
      "Mainstream hits": "Can recite every line from the latest pop song.",
      "Horror movie fan": "They're the reason 'scary movie night' became a cult tradition.",
      "Comedy movie fan": "If they're not laughing, they're probably sleeping.",
      "Reality TV fan": "They've memorized every reality show theme song.",
      "Documentary lover": "Knows the meaning of 'documentary binging.'",
      "Love musicals": "Can break into song at the most inconvenient times.",
      "Prefer action-packed films": "Can't sit still unless there's an explosion every 5 minutes.",
      "Binge-watching series": "Has watched a whole season in one sitting—no regrets.",
      "Slow and steady watcher": "Can make a series last as long as the next decade.",
      "Spotify playlists": "Has curated a playlist for every mood... even the weird ones.",
      "Vinyl records": "Probably knows the optimal volume level for every vinyl they own.",
      "Sci-fi TV shows": "Knows the difference between Star Trek and Star Wars... and will argue it.",
      "True crime shows": "Has probably solved a cold case... in their head.",
      "Classic movies": "They've seen Casablanca so many times, it's their second home.",
      "Modern blockbusters": "Can tell you the plot of every Marvel movie—no spoilers.",
      "Concert-goer": "Their bucket list is full of concerts they've already seen.",
      "Stay-at-home listener": "Their living room is a VIP section."
    },
    "Travel and Adventure": {
      "Beach vacation": "Probably has sand in places that should never have sand.",
      "Mountain retreat": "Lives for panoramic views and hot cocoa.",
      "Wants to visit Paris": "They've already practiced their 'bonjour'.",
      "Wants to visit Tokyo": "Their bucket list is a sushi roll of adventure.",
      "Road trips": "Their car is a portable hotel.",
      "Flight to a destination": "They'll book a flight just to avoid driving for 10 hours.",
      "Solo travel": "Enjoys their own company… probably too much.",
      "Travel with friends": "Their friends are just an extension of their luggage.",
      "Cultural tourism": "Would visit every museum, given the chance.",
      "Nature tourism": "Spends more time outside than inside... and never regrets it.",
      "Wants to learn a new language": "Already fluent in 'travel' and 'selfie'.",
      "Wants to learn new food recipes": "Can probably make a sushi roll better than you.",
      "Adventurous destination": "No mountain too high, no desert too hot.",
      "Relaxing beach destination": "Their version of an adventure is getting a tan.",
      "Travel often": "Their passport is as used as a grocery list.",
      "Prefer staying local": "Their backyard is the world they need.",
      "Would love to work abroad": "You think working abroad will solve all your problems? Good luck, your Wi-Fi might not even work in Bali.",
      "Prefer to stay in hometown": "Staying in your hometown? How adventurous of you. Exploring the local coffee shop again, huh?"
    },
    "Conversation Style and Humor": {
      "Sarcastic": "So dry, they make the Sahara jealous.",
      "Straightforward": "Delivers truth like a UPS package—on time and slightly damaged.",
      "Loves dad jokes": "Has a dad joke for every situation, even funerals.",
      "Dark humor": "Their sense of humor might be too dark for this world.",
      "Tells long stories": "Could turn a two-sentence anecdote into a Broadway play.",
      "Keeps it short": "Their idea of storytelling is 'You had to be there.'",
      "Love puns": "Every sentence is a punchline waiting to happen.",
      "Find puns annoying": "Thinks puns are crimes against humanity.",
      "Philosophical": "Could ponder the meaning of life... in a grocery store.",
      "Casual talker": "Prefers to keep things light and shallow—no digging for them.",
      "Talks about feelings": "They feel things... so many things.",
      "Keeps emotions inside": "Their emotional range is 'meh.'",
      "Playful teasing": "Loves poking fun, but it's all in good spirit.",
      "Serious chat": "They believe that small talk is small betrayal.",
      "Laughs at anything": "Can laugh at a rock if you make it sound funny.",
      "Hard to make laugh": "Their sense of humor is a treasure chest—good luck finding it.",
      "Love debates": "Can turn any casual chat into a high-stakes argument.",
      "Avoids arguments": "Would rather retreat into silence than engage in a heated debate.",
      "Loves to gossip": "Knows your business better than you.",
      "Keeps secrets": "Their mouth is a locked vault."
    },
    "Mindset and Lifestyle": {
      "Minimalist": "Has more space in their closet than their mind.",
      "Lover of collections": "Their basement looks like an archive for oddities.",
      "Yoga/meditation": "Their inner peace is so deep, they might be half asleep.",
      "Gym enthusiast": "Has more protein shakes than human friends.",
      "Early riser": "Can hear birds chirping, because they've already been up for two hours.",
      "Late-night thinker": "Their best ideas come after midnight, usually about pizza.",
      "Planner": "Has a five-year plan, and it's color-coded.",
      "Go with the flow": "Couldn't plan a grocery trip if their life depended on it.",
      "Has a routine": "Knows exactly what they'll do… tomorrow.",
      "Lives spontaneously": "Their life motto is 'Why plan when you can wing it?'",
      "Sleep is sacred": "Their bed is their sanctuary.",
      "Can function on little sleep": "Thinks 3 hours of sleep is the equivalent of a full night's rest.",
      "Dreamer": "Lives in their head more than in reality.",
      "Doer": "Knows how to execute... even if it's 2am.",
      "Workaholic": "Their hobby is work, and their job is their hobby.",
      "Work to live": "Works hard enough to pay for the occasional nap.",
      "Productivity tools lover": "Has 17 different apps to organize their life.",
      "Keeps it simple": "Has a planner with one task: 'Survive today.'",
      "Journaling": "Their journal is their therapist.",
      "Digital planner": "Their phone is their life coordinator."
    },
    "Random Fun Cards": {
      "Would rather live in the past": "Living in the past? Hey, maybe you'll find a way to bring back those low-rise jeans… good luck with that.",
      "Would rather live in the future": "Living in the future? Hope you're ready for flying cars and zero personal privacy. Enjoy the ride!",
      "Owns a pet": "You own a pet? How's that little ball of chaos turning your life upside down and making you question your decisions?",
      "Loves animals but doesn't own one": "Loving animals without owning one? You must be the hero that saves all the stray cats on Instagram.",
      "Into conspiracy theories": "Into conspiracy theories? Well, let me guess—aliens are definitely watching us through your webcam, right?",
      "Skeptical of all theories": "You don't believe in conspiracy theories? Well, how do you explain the mysterious disappearance of your socks every laundry day?",
      "Would survive in a zombie apocalypse": "Oh, you'd survive the zombie apocalypse? Sure, as long as your survival skills include hoarding snacks and hiding in your basement.",
      "Would probably be the first to go": "Zombie apocalypse? You're more likely to trip and fall into a horde of zombies while looking for your phone charger.",
      "Has a secret talent": "You have a secret talent? What is it—knowing how to waste time on TikTok without anyone noticing?",
      "Has no secret talents": "No secret talents? Don't worry, you're probably just really good at pretending to know what's going on in meetings.",
      "Into astrology": "You're into astrology? I bet you consult the stars before deciding what to have for lunch.",
      "Doesn't believe in it": "You don't believe in astrology? Well, how else are you going to explain why you always have bad days during full moons?",
      "Wants a big family": "You want a big family? Well, get ready for endless chaos, sibling drama, and having to buy every single holiday gift on a budget.",
      "Prefers a small family": "Small family, huh? I bet you love the peace and quiet—until your mom starts calling you for a 'family reunion' every month.",
      "Introverts with extrovert friends": "Being an introvert with extrovert friends? Must be fun watching them do all the talking while you silently sip your drink in the corner.",
      "Extroverts with introvert friends": "Extroverts with introvert friends? You're probably wearing them down with your constant social plans and unsolicited enthusiasm.",
      "Has an embarrassing childhood story": "You've got an embarrassing childhood story? Please, do tell—just don't make us all cringe at the details.",
      "Keeps that info hidden": "Keeps your embarrassing stories hidden? Oh, so you're just saving them for when you're ready to throw yourself under the bus at a family gathering.",
      "Believes in ghosts": "You believe in ghosts? Wait until they start haunting you in the form of bad Wi-Fi and slow internet speeds.",
      "Doesn't believe in them": "You don't believe in ghosts? Sure, just wait until that one day you hear something go bump in the night… alone."
    },
    "Personality and Traits Second Roast": {
      "Introvert": "Considers 'going out' a personal attack.",
      "Extrovert": "Their silence is more concerning than their talking.",
      "Optimistic": "Still believes their crypto will recover.",
      "Realist": "Has a backup plan for their backup plan.",
      "Adventurous": "Their idea of risk is ordering something new at a restaurant.",
      "Homebody": "Their home has seen more of them than their friends have.",
      "Morning person": "Do you even know what 'sleeping in' feels like? I don't trust your energy.",
      "Night owl": "Is your life just one big, caffeinated, existential crisis until 3 AM?",
      "Spontaneous": "Ever heard of a to-do list? Or do you just ride the chaos wave all day?",
      "Planner": "You've probably got a backup plan for your backup plans. It's a vibe, I guess.",
      "Organized": "Alphabetizes their spice rack and color-codes their closet.",
      "Messy": "Their room looks like it was robbed, but 'they know where everything is.'",
      "Empathic": "Cries during commercials about paper towels.",
      "Logical": "Responds to 'I love you' with 'that's statistically improbable.'",
      "Risk-taker": "Has a medical record longer than their resume.",
      "Cautious": "Takes 20 minutes to decide on a Netflix show.",
      "Perfectionist": "Still editing that email from three days ago.",
      "Good enough is fine": "Their motto is 'it'll do.'",
      "Competitive": "Turns family game night into the Hunger Games.",
      "Just for fun": "Says 'it's just a game' but secretly keeps score.",
      "Sentimental": "Still has the movie ticket from their first date in 2007.",
      "Pragmatic": "Brings a jacket even in summer, just in case.",
      "Glass half full": "Finds the silver lining in a parking ticket.",
      "Glass half empty": "Prepares for rain during a drought."
    },
    "Behavioral and Social Preferences Second Roast": {
      "Small group gatherings": "Thinks four people is a crowd.",
      "Big parties": "Needs the validation of at least 20 people to feel alive.",
      "Loud in group chats": "Types in all caps and uses excessive emojis.",
      "Silent in group chats": "Leaves everyone on read but still knows all the gossip.",
      "Loves to travel": "Their Instagram is 90% airport selfies.",
      "Homebody on vacation": "Pays for a resort just to use the hotel Wi-Fi.",
      "Needs quiet time": "Shushes people in their own dreams.",
      "Always surrounded by noise": "Can't sleep without a podcast, fan, and white noise machine.",
      "People watcher": "Could write a novel about strangers they've observed at coffee shops.",
      "Talker": "Has never met a silence they couldn't fill.",
      "Social butterfly": "Has more acquaintances than actual friends.",
      "Low-key": "Their idea of wild is staying up past 10 PM.",
      "Likes being the center of attention": "Would interrupt their own funeral to tell a story.",
      "Prefers to stay in the background": "So quiet people check if they're still breathing.",
      "Gives a lot of hugs": "Personal space is a foreign concept to them.",
      "Not a hugger": "Gives side hugs with a three-second maximum.",
      "Always early": "Has never experienced the adrenaline rush of running late.",
      "Always running late": "Sets their clock 15 minutes fast but still shows up 20 minutes late.",
      "Will start dancing in public": "Has no rhythm but infinite confidence.",
      "Keeps it cool on the dance floor": "Thinks nodding their head is dancing."
    },
    "Hobbies and Interests Second Roast": {
      "Art lover": "Pretends to understand modern art but is just staring at shapes.",
      "Tech geek": "Has more devices than friends.",
      "Loves reading": "Buys books faster than they can read them.",
      "Loves podcasts": "Can't do dishes without listening to someone talk about murder.",
      "Fitness junkie": "Posts gym selfies but crops out the pizza they had after.",
      "Netflix binger": "Knows the Netflix intro sound better than their own ringtone.",
      "Gamer": "Has better relationships with NPCs than real people.",
      "Non-gamer": "Still thinks Pac-Man is cutting-edge technology.",
      "Into crafts/DIY": "Has a graveyard of half-finished projects.",
      "Prefer ready-made stuff": "Would pay extra to avoid assembling IKEA furniture.",
      "Loves cooking": "Uses every pot and pan to make one meal.",
      "Takes-out more than cooks": "On a first-name basis with all the delivery drivers.",
      "Outdoor activities": "Posts hiking photos but was actually 10 feet from the parking lot.",
      "Indoor activities": "Considers walking to the mailbox 'going outside.'",
      "Sci-fi fan": "Corrects scientific inaccuracies in movies nobody asked about.",
      "Fantasy fan": "Has a detailed map of a world that doesn't exist.",
      "Fan of comics": "Will explain the entire Marvel timeline if you give them a chance.",
      "Fan of anime/manga": "Uses Japanese phrases in regular conversation.",
      "Enjoys puzzles": "Gets irrationally angry when there's a missing piece.",
      "Enjoys board games": "Takes Monopoly way too seriously."
    },
    "Food and Drink Preferences Second Roast": {
      "Sweet tooth": "Considers chocolate a food group.",
      "Salty snacks lover": "Can detect when someone opens a bag of chips from three rooms away.",
      "Coffee addict": "Measures time in cups, not hours.",
      "Tea enthusiast": "Has a tea for every mood, ailment, and weather condition.",
      "Vegetarian": "Honestly, your carbon footprint is judging the rest of us right now.",
      "Meat lover": "Bet you think medium-rare is a personality trait.",
      "Spicy food lover": "Their taste buds are basically fireproof.",
      "Mild food lover": "Thinks black pepper is exotic.",
      "Cooking a 5-course meal": "Spends three hours cooking, 15 minutes eating.",
      "Order takeout every time": "Their kitchen is just for show.",
      "Late-night snacks": "The refrigerator light sees them more than the sun does.",
      "Meal preppers": "Eats the same chicken and broccoli five days in a row.",
      "Wine enthusiast": "Swirls their water glass out of habit.",
      "Beer lover": "Judges people who drink domestic beer.",
      "Smoothie fan": "Puts kale in everything and expects you not to notice.",
      "Juice lover": "Thinks juice cleanses actually work.",
      "Cook with recipes": "Measures ingredients with scientific precision.",
      "Cook by feeling": "Never makes the same dish twice.",
      "Dessert first": "Life is uncertain, eat the cake first.",
      "Appetizer first": "Orders three appetizers instead of a main course."
    },
    "Music, Movies, and TV Shows Second Roast": {
      "Pop music lover": "Knows all the lyrics but none of the meanings.",
      "Rock music lover": "Still wearing band t-shirts from concerts they attended in high school.",
      "Into indie music": "Stops liking bands as soon as other people discover them.",
      "Mainstream hits": "Their music taste is whatever's on the radio right now.",
      "Horror movie fan": "Sleeps with the lights on but claims they're not scared.",
      "Comedy movie fan": "Quotes movies instead of having original thoughts.",
      "Reality TV fan": "Believes the 'reality' in reality TV.",
      "Documentary lover": "Starts every sentence with 'I watched this documentary...'",
      "Love musicals": "Bursts into song at inappropriate moments.",
      "Prefer action-packed films": "Measures movie quality by explosion count.",
      "Binge-watching series": "Loses entire weekends to shows they'll forget in a month.",
      "Slow and steady watcher": "Still hasn't finished Breaking Bad.",
      "Spotify playlists": "Has a playlist for every micro-mood.",
      "Vinyl records": "Talks about 'warmth' and 'authenticity' way too much.",
      "Sci-fi TV shows": "Can explain time travel paradoxes but can't be on time.",
      "True crime shows": "Knows suspicious facts about body disposal.",
      "Classic movies": "Judges you for not having seen Citizen Kane.",
      "Modern blockbusters": "Thinks CGI is more important than plot.",
      "Concert-goer": "Watches the whole show through their phone screen.",
      "Stay-at-home listener": "Claims the 'audio quality is better at home.'"
    },
    "Travel and Adventure Second Roast": {
      "Beach vacation": "Returns with a sunburn that matches their personality: bright and painful.",
      "Mountain retreat": "Takes selfies at dangerous heights for the 'gram.",
      "Wants to visit Paris": "Expects it to be like Emily in Paris.",
      "Wants to visit Tokyo": "Thinks knowing anime prepares them for Japan.",
      "Road trips": "Curates playlists longer than the actual drive.",
      "Flight to a destination": "Claps when the plane lands.",
      "Solo travel": "Posts 'finding myself' captions on every trip.",
      "Travel with friends": "Plans group trips that fall apart three days before departure.",
      "Cultural tourism": "Visits foreign countries but eats at McDonald's.",
      "Nature tourism": "Complains about bugs while 'connecting with nature.'",
      "Wants to learn a new language": "Downloaded Duolingo but hasn't opened it in months.",
      "Wants to learn new food recipes": "Pins recipes they'll never actually make.",
      "Adventurous destination": "Their travel insurance premiums are astronomical.",
      "Relaxing beach destination": "Spends thousands to lie down in a different location.",
      "Travel often": "Has more photos from airports than their own home.",
      "Prefer staying local": "Thinks crossing the county line is exotic.",
      "Would love to work abroad": "You're ready to live the dream, huh? Pack your bags and prepare for jet lag and culture shock!",
      "Prefer to stay in hometown": "You prefer comfort over chaos. It's a cute way to avoid international cuisine and unfamiliar traffic."
    },
    "Conversation Style and Humor Second Roast": {
      "Sarcastic": "Their sincerity setting is permanently broken.",
      "Straightforward": "Has never heard of tact.",
      "Loves dad jokes": "Makes everyone groan at least once per conversation.",
      "Dark humor": "Makes jokes at funerals and wonders why people are upset.",
      "Tells long stories": "Has never reached a point quickly in their life.",
      "Keeps it short": "Texts back 'k' and thinks it's sufficient.",
      "Love puns": "Thinks they're punnier than they actually are.",
      "Find puns annoying": "Has no appreciation for wordplay, the highest form of humor.",
      "Philosophical": "Turns 'how are you' into an existential crisis.",
      "Casual talker": "Has never had a deep thought in their life.",
      "Talks about feelings": "Emotional processing in real-time, all the time.",
      "Keeps emotions inside": "Their therapist works overtime.",
      "Playful teasing": "Doesn't realize when they've crossed the line.",
      "Serious chat": "Makes small talk feel like a job interview.",
      "Laughs at anything": "Their laugh is more reliable than a clock.",
      "Hard to make laugh": "Watches comedy with a straight face.",
      "Love debates": "Argues about the color of the sky just for fun.",
      "Avoids arguments": "Agrees with everyone to their face, complains later.",
      "Loves to gossip": "Starts sentences with 'Don't tell anyone but...'",
      "Keeps secrets": "Knows everyone's dirt but takes it to the grave."
    },
    "Mindset and Lifestyle Second Roast": {
      "Minimalist": "Owns three shirts but has strong opinions about all of them.",
      "Lover of collections": "One garage sale away from being on Hoarders.",
      "Yoga/meditation": "Says 'namaste' in regular conversation.",
      "Gym enthusiast": "Flexes while reaching for things on high shelves.",
      "Early riser": "Sends 'good morning' texts at 5 AM.",
      "Late-night thinker": "Most productive between midnight and 3 AM.",
      "Planner": "Has backup plans for their backup plans.",
      "Go with the flow": "Hasn't made a decision since 2015.",
      "Has a routine": "Gets anxious when their schedule changes by 5 minutes.",
      "Lives spontaneously": "Their bank account reflects their impulsive decisions.",
      "Sleep is sacred": "Cancels plans if it interferes with their sleep schedule.",
      "Can function on little sleep": "Probably in a constant state of delirium.",
      "Dreamer": "Has more dreams than accomplishments.",
      "Doer": "Doesn't understand the concept of relaxation.",
      "Workaholic": "Answers emails during their own wedding.",
      "Work to live": "Counts down to Friday starting on Monday morning.",
      "Productivity tools lover": "Has five apps that do the same thing.",
      "Keeps it simple": "Their to-do list is a single Post-it note.",
      "Journaling": "Writes about life instead of living it.",
      "Digital planner": "Gets notifications about their notifications."
    },
    "Random Fun Cards Second Roast": {
      "Would rather live in the past": "You're living in the past? Well, just wait until the future shows up and you're still stuck trying to fix your flip phone.",
      "Would rather live in the future": "The future? Sure, but remember to pack a lot of charger cables and sunscreen for your inevitable trip to Mars.",
      "Owns a pet": "You've got a pet? Well, it's official—you're now living the 'I'll clean up your mess because I love you' life.",
      "Loves animals but doesn't own one": "You love animals but don't own one? Sounds like you're a professional pet-sitter in a world that doesn't pay you in treats.",
      "Into conspiracy theories": "You're into conspiracy theories? Maybe the real mystery is how you've managed to avoid being in a cult so far.",
      "Skeptical of all theories": "Skeptical of all theories? Well, good luck proving that your favorite coffee shop isn't secretly a front for a secret society.",
      "Would survive in a zombie apocalypse": "Survive a zombie apocalypse? You'd probably be the first one to befriend the zombies, offering them pizza to 'negotiate peace.'",
      "Would probably be the first to go": "First to go in a zombie apocalypse? Your biggest survival skill is probably how to scream dramatically while trying to escape.",
      "Has a secret talent": "A secret talent? Well, the only thing you've mastered is being able to pretend you're working while scrolling through memes.",
      "Has no secret talents": "No secret talents? You're probably too busy perfecting the art of knowing just enough to get by.",
      "Into astrology": "Astrology fan? Are you consulting the stars or just blaming your bad day on Mercury being in retrograde again?",
      "Doesn't believe in it": "You don't believe in astrology? Sounds like someone's still waiting for their 'good vibes' to magically appear.",
      "Wants a big family": "Big family dreams? So you're just planning on converting your house into a never-ending Thanksgiving dinner gathering?",
      "Prefers a small family": "Small family? Well, you probably never have to fight for the TV remote, but you also never get out of doing all the chores.",
      "Introverts with extrovert friends": "Introvert with extrovert friends? You're just the 'mysterious, brooding one' in the group, probably daydreaming about leaving early.",
      "Extroverts with introvert friends": "You're the extrovert with introvert friends? They secretly dread your 10th invitation to another 'spontaneous' brunch meetup.",
      "Has an embarrassing childhood story": "An embarrassing childhood story? Sounds like you've spent years rehearsing how to laugh off that one moment you'll never live down.",
      "Keeps that info hidden": "Embarrassing childhood story? Nah, you'd rather pull a 'nothing to see here' and keep the cringe locked away forever.",
      "Believes in ghosts": "Believing in ghosts? You're probably also convinced that your 'forgotten' Wi-Fi password is some paranormal activity in disguise.",
      "Doesn't believe in them": "Doesn't believe in ghosts? You'll be the first one running for the hills when the lights flicker and the floor creaks at 2am."
    }
  };

  const generalPrompts = [
    "Why'd you pick that card for me?",
    "Is that how people usually see you?",
    "Was it a hard choice?",
    "Did I surprise you with my answer?",
    "What card would you pick for yourself?",
    "Do you think I'd change this about myself?",
    "Do you think that makes us compatible?",
    "What would be your 'wild card' guess for me?"
  ];

  const matchSpecificPrompts = [
    "Why do you think we both saw that in each other?",
    "Do you think that means we're alike?",
    "Have people told you this about yourself before?"
  ];

  const notAMatchPrompts = [
    "What made you choose that card?",
    "Do you feel like that description fits you better?",
    "Was there a second choice you almost picked?",
    "What card do you think is most unlike me?"
  ];

  const [showSettings, setShowSettings] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showPrompts, setShowPrompts] = useState(false);
  const [isMatch, setIsMatch] = useState(null);
  const [isRoastMode, setIsRoastMode] = useState(false);
  const [forcedMatch, setForcedMatch] = useState(false);
  const [originalMatchState, setOriginalMatchState] = useState(null);
  const [usedCards, setUsedCards] = useState([]);
  const [remainingCards, setRemainingCards] = useState(0);
  const [totalCards, setTotalCards] = useState(0);
  const [userGuess, setUserGuess] = useState(null);
  const [showPlayerForm, setShowPlayerForm] = useState(true);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [showRules, setShowRules] = useState(false);
  const [showAddPlayerForm, setShowAddPlayerForm] = useState(false);
  const [showRemovePlayerForm, setShowRemovePlayerForm] = useState(false);
  const [playerToRemove, setPlayerToRemove] = useState('');
  const [hasRestored, setHasRestored] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("guessMeGameData");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setPlayers(data.players || []);
        setCurrentPlayer(data.currentPlayer ?? 0);
        setUsedCards(data.usedCards || []);
        setRoundNumber(data.roundNumber || 1);
        setGameStarted(data.gameStarted ?? false);
        setIsRoastMode(data.isRoastMode ?? false);
        setSelectedCategory(data.selectedCategory || null);
        setSelectedCard(data.selectedCard || null);
        setShowPrompts(data.showPrompts ?? false);
        setUserGuess(data.userGuess ?? null);
        setIsMatch(data.isMatch ?? null);
        setForcedMatch(data.forcedMatch ?? false);
        setOriginalMatchState(data.originalMatchState ?? null);
        setTotalCards(data.totalCards || 0);
        setRemainingCards(data.remainingCards || 0);
        setShowPlayerForm(!data.gameStarted);
        setHasRestored(true);
      } catch (e) {
        console.error("Failed to parse game data:", e);
        setHasRestored(true);
      }
    } else {
      setHasRestored(true);
    }
  }, []);

  useEffect(() => {
    if (!hasRestored) return;
    const gameData = {
      players,
      currentPlayer,
      usedCards,
      roundNumber,
      gameStarted,
      isRoastMode,
      selectedCategory,
      selectedCard,
      showPrompts,
      userGuess,
      isMatch,
      forcedMatch,
      originalMatchState,
      showSettings,
      totalCards,
      remainingCards
    };

    localStorage.setItem("guessMeGameData", JSON.stringify(gameData));
  }, [
    hasRestored,
    players,
    currentPlayer,
    usedCards,
    roundNumber,
    gameStarted,
    isRoastMode,
    selectedCategory,
    selectedCard,
    showPrompts,
    userGuess,
    isMatch,
    forcedMatch,
    originalMatchState,
    showSettings,
    totalCards,
    remainingCards
  ]);

  useEffect(() => {
    if (!allCards || Object.keys(allCards).length === 0) return;
    let total = 0;
    for (const category in allCards) {
      total += allCards[category].length;
    }
    setTotalCards(total);
    setRemainingCards(total - usedCards.length);
  }, [usedCards.length, allCards]);

  useEffect(() => {
    console.log("Current player is now:", players[currentPlayer]);
  }, [currentPlayer, players]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedCard(null);
    setUserGuess('');
    setShowPrompts(false);
    setIsMatch(null);
    setForcedMatch(false);
    setOriginalMatchState(null);
  };

  const handleCardSelect = (card) => {
    setSelectedCard(card);
    setShowPrompts(false);
    setUserGuess('');
    setIsMatch(null);
    setForcedMatch(false);
    setOriginalMatchState(null);
  };

  const handleUserGuess = (guess) => {
    if (!selectedCard || !selectedCard.options) return;
    const matchResult = guess === selectedCard.options[0];
    setUserGuess(guess);
    setIsMatch(matchResult);
    setOriginalMatchState(matchResult);
    setShowPrompts(true);
    setForcedMatch(false);
  };

  const forceMatch = () => {
    setOriginalMatchState(isMatch);
    setIsMatch(true);
    setForcedMatch(true);
  };

  const undoMatch = () => {
    setIsMatch(originalMatchState);
    setForcedMatch(false);
  };

  const handleGoBack = () => {
    setSelectedCategory(null);
    setSelectedCard(null);
    setUserGuess('');
    setShowPrompts(false);
    setIsMatch(null);
    setForcedMatch(false);
    setOriginalMatchState(null);
  };

  const resetGamePlay = () => {
    setShowPrompts(false);
    setUserGuess(null)
    setIsMatch(null);
    setForcedMatch(false);
    setOriginalMatchState(null);
  };

  const toggleRoastMode = () => {
    setIsRoastMode(!isRoastMode);
  };

  const getRoastResponses = () => {
    if (isMatch === true) {
      return [
        "Aw, cute. You guessed me right. Finally, someone gets me… kind of.",
        "Look at us. Two overthinkers syncing up for once.",
        "Should we just skip the small talk and start a podcast together?",
        "Great minds think alike… and clearly have questionable taste."
      ];
    } else if (isMatch === false) {
      return [
        "Bold of you to assume I have that much emotional stability.",
        "Not even close, but hey, points for creativity.",
        "So… you don't believe in first impressions, huh?",
        "You looked at me and thought that? Interesting.",
        "One of us is delusional and honestly, it might be me."
      ];
    }
    return [];
  };

  const handleDemoLogin = () => {
    dispatch(login({ credential: 'demo@user.io', password: 'password' }));
  };

  const getChoiceRoast = (category, guess) => {
    const categoryRoasts = roastBank[category];
    const secondCategoryName = `${category} Second Roast`;
    const secondCategoryRoasts = roastBank[secondCategoryName];

    let roasts = [];
    if (categoryRoasts && categoryRoasts[guess]) {
      roasts.push(categoryRoasts[guess]);
    }
    if (secondCategoryRoasts && secondCategoryRoasts[guess]) {
      roasts.push(secondCategoryRoasts[guess]);
    }

    if (roasts.length > 0) {
      return roasts.join(" • ");
    }
    return "You guessed that? Bold. Mysterious. Mildly incorrect.";
  };

  const handleAddPlayer = (e) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      setPlayers([...players, newPlayerName.trim()]);
      setNewPlayerName("");
      setShowAddPlayerForm(false);
    }
  };

  const handleRemovePlayer = (e) => {
    e.preventDefault();
    if (playerToRemove) {
      const updatedPlayers = players.filter(player => player !== playerToRemove);
      setPlayers(updatedPlayers);
      setPlayerToRemove("");
      setShowRemovePlayerForm(false);
    }
  };

  const startGame = () => {
    if (players.length < 2) {
      alert("You need at least 2 players to start the game!");
      return;
    }

    setGameStarted(true);
    setShowPlayerForm(false);
    setCurrentPlayer(0);
    setUsedCards([]);
    setRoundNumber(1);
  };

  const nextPlayerTurn = () => {
    if (players.length === 0) return;
    const nextPlayer = (currentPlayer + 1) % players.length;
    if (nextPlayer === 0 && selectedCard && selectedCategory) {
      setUsedCards((prev) => [
        ...prev,
        `${selectedCategory}:${selectedCard.prompt}`
      ]);
    }

    setCurrentPlayer(nextPlayer);

    if (nextPlayer === 0) {
      setRoundNumber(prevRound => prevRound + 1);
    }

    resetGamePlay();
  };

  if (!user) {
    return (
      <>
        <p>Please sign up or log in to start or resume a game.</p>
        <div className="auth-buttons">
          <button className="btn-signup" onClick={() => setModalContent(<SignupFormModal />)}>
            Sign up
          </button>
          <button className="btn-login" onClick={() => setModalContent(<LoginFormModal />)}>
            Log in
          </button>
          <button className="btn-demo" onClick={handleDemoLogin}>
            Demo Login
          </button>
        </div>
      </>
    )
  }

  return (
    <div className="game-container">
      <h1>Guess Me Game</h1>

      {showPlayerForm && (
        <div className="player-setup">
          <h2>Add Players</h2>
          <div className="players-list">
            {players.length > 0 ? (
              <div>
                <h3>Current Players:</h3>
                <>
                  {players.map((player, index) => (
                    <p key={index}>{player}</p>
                  ))}
                </>
              </div>
            ) : (
              <p>No players added yet. Add at least 2 players to start.</p>
            )}
          </div>

          <form onSubmit={handleAddPlayer}>
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Enter player name"
            />

            {players.length >= 2 && (
              <button type="button" className="start-game-btn" onClick={startGame}>
                Start Game
              </button>
            )}

            <button type="submit">Add Player</button>
          </form>

          {players.length > 0 && (
            <div>
              <button onClick={() => setShowRemovePlayerForm(!showRemovePlayerForm)}>
                Remove Player
              </button>

              {showRemovePlayerForm && (
                <form onSubmit={handleRemovePlayer}>
                  <select
                    value={playerToRemove}
                    onChange={(e) => setPlayerToRemove(e.target.value)}
                  >
                    <option value="">Select a player to remove</option>
                    {players.map((player, index) => (
                      <option key={index} value={player}>{player}</option>
                    ))}
                  </select>
                  <button type="submit">Remove</button>
                </form>
              )}
            </div>
          )}

          <button onClick={() => setShowRules(!showRules)}>
            {showRules ? "Hide Rules" : "Show Rules"}
          </button>

          {showRules && (
            <div className="rules">
              <h3>How to Play</h3>
              <h4>The game consists of six themed categories: Personality and Traits; Food and Drink; Music, Movies, and TV Shows; Travel and Adventure; Conversation Style and Humor; and Mindset and Lifestyle. Each category has a set of possible traits, preferences, or interests for each of you to guess about your match. You will be presented with two options for each category. At the start of the game, you both have the option to activate Roast Me Gently Mode. If both of you opt in, a lighthearted, sarcastic twist will be added to the game. When Roast Mode is on, each guess is followed by a playful roast that adds humor to the conversation. These roasts are meant to be light-hearted and funny, not mean-spirited. After both of you make your guess, the game will reveal whether each guess was correct or incorrect. For correct guesses, a playful or humorous response will appear. For incorrect guesses, the game might make a sarcastic comment or ask a follow-up question to spark conversation. After each guess, you will receive &quot;Talk About This&quot; prompts, which are designed to spark deeper or more playful conversations.</h4>
            </div>
          )}
        </div>
      )}

      {gameStarted && (
        <div className="game-play">
          <div className="game-header">
            <h2>Round {roundNumber - 1}</h2>
            <p>Current Player: {players[currentPlayer]}</p>
            <p>Cards Remaining: {remainingCards} / {totalCards}</p>
            <button onClick={toggleRoastMode}>
              {isRoastMode ? "Disable Roast Mode" : "Enable Roast Mode"}
            </button>
          </div>

          {!selectedCategory && (
            <div className="category-selection">
              <h3>Select a Category</h3>
              <div className="categories-grid">
                {allCards && Object.keys(allCards).map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className="category-btn"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedCategory && !selectedCard && (
            <div className="card-selection">
              <h3>{selectedCategory}</h3>
              <div className="cards-grid">
                {allCards[selectedCategory].map((card) => (
                  <button
                    key={card.prompt}
                    onClick={() => handleCardSelect(card)}
                    className="card-btn"
                    disabled={usedCards.includes(`${selectedCategory}:${card.prompt}`)}
                  >
                    {card.prompt}
                  </button>
                ))}
              </div>
              <button onClick={handleGoBack} className="back-btn">
                Back to Categories
              </button>
            </div>
          )}

          {selectedCard && !showPrompts && (
            <div className="card-guessing">
              <h3>{selectedCard.prompt}</h3>
              <p>Which option best describes {players[currentPlayer]}?</p>
              <div className="options-container">
                {selectedCard.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleUserGuess(option)}
                    className="option-btn"
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button onClick={() => setSelectedCard(null)} className="back-btn">
                Back to {selectedCategory}
              </button>
            </div>
          )}

          {showPrompts && (
            <div className="discussion-prompts">
              <h3>Talk About This</h3>
              <div className="guess-result">
                <h4>Your Guess: {userGuess}</h4>
                {isMatch === true && <p className="match-indicator">It&apos;s a Match! 🥳</p>}
                {isMatch === false && <p className="no-match-indicator">Not a Match 🤔</p>}
              </div>

              <div className="match-controls">
                {!isMatch && !forcedMatch && (
                  <button onClick={forceMatch} className="force-match-btn">
                    Make It a Match
                  </button>
                )}
                {forcedMatch && (
                  <button onClick={undoMatch} className="undo-match-btn">
                    Undo Match
                  </button>
                )}
                {isMatch && !forcedMatch && (
                  <button onClick={() => setIsMatch(false)} className="undo-match-btn">
                    Undo Match
                  </button>
                )}
              </div>

              {forcedMatch && (
                <p className="forced-match-note">
                  <em>Match was manually set</em>
                </p>
              )}

              <div className="prompts-section">
                <h4>General Discussion Prompts:</h4>
                <ul className="prompts-list">
                  {generalPrompts.map((prompt, index) => (
                    <li key={index}>{prompt}</li>
                  ))}
                </ul>
              </div>

              {isMatch === true && (
                <div className="prompts-section">
                  <h4>It&apos;s a Match! 🥳 Discuss These Too:</h4>
                  <ul className="prompts-list">
                    {matchSpecificPrompts.map((prompt, index) => (
                      <li key={index}>{prompt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {isMatch === false && (
                <div className="prompts-section">
                  <h4>Not a Match 🤔 Discuss These Too:</h4>
                  <ul className="prompts-list">
                    {notAMatchPrompts.map((prompt, index) => (
                      <li key={index}>{prompt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {isRoastMode && (
                <div className="roast-section">
                  <h4>Roast Mode 🔥</h4>
                  <ul className="roasts-list">
                    {getRoastResponses().map((roast, index) => (
                      <li key={index}>{roast}</li>
                    ))}
                  </ul>

                    <div className="choice-roast">
                      <h4>Roasts based on your guess:</h4>
                      <ul className="roasts-list">
                        {getChoiceRoast(selectedCategory, userGuess)
                          .split(' • ')
                          .map((roast, i) => (
                            <li key={i}>{roast}</li>
                          ))}
                      </ul>
                    </div>
                </div>
              )}

              <div className="navigation-buttons">
                <button onClick={resetGamePlay} className="try-again-btn">
                  Try Again
                </button>
                <button onClick={() => setSelectedCard(null)} className="another-card-btn">
                  Choose Another Card
                </button>
                <button onClick={handleGoBack} className="back-btn">
                  Go Back to Category Selection
                </button>
                <button onClick={nextPlayerTurn} className="next-player-btn">
                  Next Player&apos;s Turn
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setShowSettings(!showSettings)}
        className="settings-btn"
      >
        {showSettings ? "Hide Settings" : "Settings"}
      </button>

      {showSettings && (
        <div className="settings-panel">
          <h3>Game Settings</h3>

          <div className="player-management">
            <h4>Players</h4>
            <>
              {players.map((player, index) => (
                <p key={index}>{player}</p>
              ))}
            </>
            <br />

            <button onClick={() => setShowAddPlayerForm(!showAddPlayerForm)}>
              {showAddPlayerForm ? "Cancel" : "Add Player"}
            </button>

            {showAddPlayerForm && (
              <form onSubmit={handleAddPlayer}>
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Enter player name"
                />
                <button type="submit">Add</button>
              </form>
            )}

            {players.length > 0 && (
              <>
                <button onClick={() => setShowRemovePlayerForm(!showRemovePlayerForm)}>
                  {showRemovePlayerForm ? "Cancel" : "Remove Player"}
                </button>

                {showRemovePlayerForm && (
                  <form onSubmit={handleRemovePlayer}>
                    <select
                      value={playerToRemove}
                      onChange={(e) => setPlayerToRemove(e.target.value)}
                    >
                      <option value="">Select a player to remove</option>
                      {players.map((player, index) => (
                        <option key={index} value={player}>{player}</option>
                      ))}
                    </select>
                    <button type="submit">Remove</button>
                  </form>
                )}
              </>
            )}
          </div>

          <div className="game-progress">
            <h4>Game Progress</h4>
            <p>Round: {roundNumber - 1}</p>
            <p>Current Player: {players[currentPlayer]}</p>
            <p>Cards Used: {usedCards.length} / {totalCards}</p>
            <p>Cards Remaining: {remainingCards}</p>
          </div>

          <button
            onClick={() => {
              if (window.confirm("Clear saved game? This will reset everything.")) {
                localStorage.removeItem("guessMeGameData");
                window.location.reload();
              }
            }}
            className="reset-saved-game-btn"
          >
            Clear Saved Game
          </button>
        </div>
      )}

      <button
        onClick={() => {
          if (window.confirm("Are you sure you want to reset the game? All progress will be lost.")) {
            setGameStarted(false);
            setShowPlayerForm(true);
            setSelectedCategory(null);
            setSelectedCard(null);
            setUserGuess(null);
            setUsedCards([]);
            setRoundNumber(1);
          }
        }}
        className="reset-game-btn"
      >
        Reset Game
      </button>
    </div>
  );
};

export default GuessingGame;