// frontend/src/components/GamePlay/GamePlay.jsx
// import './GamePlay.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import {
  startGame,
  updateGameTrait,
  getUserGamePlays,
  updateGameCorrectness,
  updateGameInteractionType,
  deleteAllGamePlays,
  resetGameState,
} from '../../store/game-plays';
import { useModal } from '../../context/Modal';
import SignupFormModal from '../SignupFormModal';
import LoginFormModal from '../LoginFormModal';
import { login } from '../../store/session';
import './GamePlay.css';

const traitCategories = [
  {
    category: 'Personality and Traits',
    traits: ['Introvert vs. Extrovert',
      'Optimistic vs. Realist',
      'Adventurous vs. Homebody',
      'Morning person vs. Night owl',
      'Spontaneous vs. Planner',
      'Organized vs. Messy',
      'Empathic vs. Logical',
      'Risk-taker vs. Cautious',
      'Sentimental vs. Pragmatic',
      'Glass half full vs. Glass half empty']
  },
  {
    category: 'Food and Drink',
    traits: ['Sweet tooth vs. Salty snacks lover',
      'Vegetarian vs. Meat lover',
      'Coffee addict vs. Tea enthusiast',
      'Spicy food lover vs. Mild food lover',
      'Cooking a 5-course meal vs. Order takeout every time',
      'Late-night snacks vs. Meal preppers',
      'Wine enthusiast vs. Beer lover',
      'Smoothie fan vs. Juice lover',
      'Cook with recipes vs. Cook by feeling',
      'Dessert first vs. Appetizer first']
  },
  {
    category: 'Music, Movies, and TV Shows',
    traits: ['Pop music lover vs. Rock music lover',
      'Into indie music vs. Mainstream hits',
      'Horror movie fan vs. Comedy movie fan',
      'Reality TV fan vs. Documentary lover',
      'Love musicals vs. Prefer action-packed films',
      'Binge-watching series vs. Slow and steady watcher',
      'Spotify playlists vs. Vinyl records',
      'Sci-fi TV shows vs. True crime shows',
      'Classic movies vs. Modern blockbusters',
      'Concert-goer vs. Stay-at-home listener']
  },
  {
    category: 'Travel and Adventure',
    traits: ['Beach vacation vs. Mountain retreat',
      'Wants to visit Paris vs. Wants to visit Tokyo',
      'Road trips vs. Flight to a destination',
      'Solo travel vs. Travel with friends',
      'Loves hiking vs. Loves city tours',
      'Cultural tourism vs. Nature tourism',
      'Wants to learn a new language vs. Wants to learn new food recipes',
      'Adventurous destination vs. Relaxing beach destination',
      'Travel often vs. Prefer staying local',
      'Would love to work abroad vs. Prefer to stay in hometown']
  },
  {
    category: 'Conversation Style and Humor',
    traits: ['Sarcastic vs. Straightforward',
      'Loves dad jokes vs. Dark humor',
      'Tells long stories vs. Keeps it short',
      'Love puns vs. Find puns annoying',
      'Philosophical vs. Casual talker',
      'Talks about feelings vs. Keeps emotions inside',
      'Playful teasing vs. Serious chat',
      'Laughs at anything vs. Hard to make laugh',
      'Love debates vs. Avoids arguments',
      'Loves to gossip vs. Keeps secrets']
  },
  {
    category: 'Mindset and Lifestyle',
    traits: ['Minimalist vs. Lover of collections',
      'Yoga/meditation vs. Gym enthusiast',
      'Early riser vs. Late-night thinker',
      'Planner vs. Go with the flow',
      'Has a routine vs. Lives spontaneously',
      'Sleep is sacred vs. Can function on little sleep',
      'Dreamer vs. Doer',
      'Workaholic vs. Work to live',
      'Productivity tools lover vs. Keeps it simple',
      'Journaling vs. Digital planner']
  },
  {
    category: 'Random Fun Cards',
    traits: ['Would rather live in the past vs. Would rather live in the future',
      'Owns a pet vs. Loves animals but doesn\'t own one',
      'Into conspiracy theories vs. Skeptical of all theories',
      'Would survive in a zombie apocalypse vs. Would probably be the first to go',
      'Has a secret talent vs. Has no secret talents',
      'Into astrology vs. Doesn\'t believe in it',
      'Wants a big family vs. Prefers a small family',
      'Introverts with extrovert friends vs. Extroverts with introvert friends',
      'Has an embarrassing childhood story vs. Keeps that info hidden',
      'Believes in ghosts vs. Doesn\'t believe in them']
  }
];

const contentByInteractionType = {
  roasts: {
    correct: [
      "Aw, cute. You guessed me right. Finally, someone gets me… kind of.",
      "Look at us. Two overthinkers syncing up for once.",
      "Should we just skip the small talk and start a podcast together?",
      "Great minds think alike… and clearly have questionable taste."
    ],
    incorrect: [
      "Bold of you to assume I have that much emotional stability.",
      "Not even close, but hey, points for creativity.",
      "So… you don't believe in first impressions, huh?",
      "You looked at me and thought that? Interesting.",
      "One of us is delusional and honestly, it might be me."
    ]
  },
  'talk-about': {
    correct: [
      "Why do you think we both saw that in each other?",
      "Do you think that means we're alike?",
      "Have people told you this about yourself before?"
    ],
    incorrect: [
      "What made you choose that card?",
      "Do you feel like that description fits you better?",
      "Was there a second choice you almost picked?",
      "What card do you think is most unlike me?"
    ],
    general: [
      "Why'd you pick that card for me?",
      "Is that how people usually see you?",
      "Was it a hard choice?",
      "Did I surprise you with my answer?",
      "What card would you pick for yourself?",
      "Do you think I'd change this about myself?",
      "Do you think that makes us compatible?",
      "What would be your 'wild card' guess for me?"
    ]
  }
};

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
  "Food and Drink": {
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
  "Food and Drink Second Roast": {
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

const GamePlay = () => {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const game = useSelector((state) => state.gamePlays.game);
  const sessionUser = useSelector((state) => state.session.user);
  const loading = useSelector((state) => state.gamePlays.loading);
  const error = useSelector((state) => state.gamePlays.error);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTrait, setSelectedTrait] = useState('');
  const [interactionType, setInteractionType] = useState('guessing');
  const [guessedValue, setGuessedValue] = useState(null);
  const [guessSubmitted, setGuessSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forcedMatch, setForcedMatch] = useState(false);
  const [originalMatchState, setOriginalMatchState] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [usedCards, setUsedCards] = useState([]);
  const [showAddPlayerForm, setShowAddPlayerForm] = useState(false);
  const [showRemovePlayerForm, setShowRemovePlayerForm] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [playerToRemove, setPlayerToRemove] = useState('');
  const [, setSelectedContent] = useState([]);
  const [completedTraits, setCompletedTraits] = useState([]);

  const lastGuessedValue = useRef(null);

  const totalCards = traitCategories.reduce((acc, cat) => acc + cat.traits.length, 0);
  const remainingCards = totalCards - usedCards.length;

  const handleDemoLogin = () => {
    dispatch(login({ credential: 'demo@user.io', password: 'password' }));
  };

  const getContentFor = (game) => {
    const { interactionType, isCorrect } = game;
    if (!interactionType) return [];

    const content = contentByInteractionType[interactionType];
    if (!content) return [];

    if (interactionType === "roasts") {
      return isCorrect ? content.correct : content.incorrect;
    }

    if (interactionType === "talk-about") {
      return isCorrect ? content.correct : content.incorrect.concat(content.general);
    }

    return [];
  };

  useEffect(() => {
    dispatch(getUserGamePlays());
  }, [dispatch]);

  useEffect(() => {
    if (game?.id && selectedCategory && selectedTrait) {
      dispatch(updateGameTrait(game.id, {
        traitCategory: selectedCategory,
        traitName: selectedTrait,
      }));
    }
  }, [game?.id, selectedCategory, selectedTrait, dispatch]);

  useEffect(() => {
    if (game) {
      if (game.traitCategory) setSelectedCategory(game.traitCategory);
      if (game.traitName) setSelectedTrait(game.traitName);

      setInteractionType(game.interactionType || 'guessing');

      if (game.guessedValue !== lastGuessedValue.current) {
        setGuessedValue(game.guessedValue || null);
        setGuessSubmitted(!!game.guessedValue);
        lastGuessedValue.current = game.guessedValue;
      }

      if (game.interactionType && typeof game.isCorrect === 'boolean') {
        setSelectedContent(getContentFor(game));
      } else {
        setSelectedContent([]);
      }
    }
  }, [game]);

  useEffect(() => {
    setForcedMatch(false);
    setOriginalMatchState(null);
  }, [game?.id]);

  useEffect(() => {
    const savedGameData = localStorage.getItem("guessMeGameData");
    if (savedGameData) {
      const { players, currentPlayer, roundNumber, usedCards } = JSON.parse(savedGameData);
      if (players) setPlayers(players);
      if (currentPlayer !== undefined) setCurrentPlayer(currentPlayer);
      if (roundNumber) setRoundNumber(roundNumber);
      if (usedCards) setUsedCards(usedCards);
    } else if (sessionUser) {
      setPlayers([sessionUser.username]);
    }
  }, [sessionUser]);

  useEffect(() => {
    if (players.length > 0) {
      localStorage.setItem("guessMeGameData", JSON.stringify({
        players,
        currentPlayer,
        roundNumber,
        usedCards
      }));
    }
  }, [players, currentPlayer, roundNumber, usedCards]);

  const handleStartGame = async () => {
    setErrorMessage('');
    if (!sessionUser) {
      setErrorMessage('You must be logged in to play');
      return;
    }

    try {
      await dispatch(startGame({
        user1Id: sessionUser.id,
        user2Id: sessionUser.id,
        traitCategory: selectedCategory || null,
        traitName: selectedTrait || null,
        interactionType: interactionType || 'guessing',
      }));

      setSelectedCategory('');
      setSelectedTrait('');
      setGuessedValue(null);
      setGuessSubmitted(false);
      setSelectedContent([]);
    } catch (err) {
      console.error('Failed to start game:', err);
      setErrorMessage('Failed to start game. Please try again.');
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedTrait('');
    setGuessedValue(null);
    setGuessSubmitted(false);

    if (game?.id) {
      dispatch(updateGameTrait(game.id, {
        traitCategory: category,
        traitName: '',
        guessedValue: null
      }));
    }
  };

  const handleTraitSelect = (trait) => {
    setGuessedValue(null);
    setGuessSubmitted(false);
    setSelectedTrait(trait);

    if (!usedCards.includes(trait)) {
      setUsedCards([...usedCards, trait]);
    }

    if (game?.id) {
      dispatch(updateGameTrait(game.id, {
        traitName: trait,
        guessedValue: null
      }));
    }
  };

  const handleOptionSelect = (option) => {
    setGuessedValue(option);
    setGuessSubmitted(true);
  };

  const getTraitOptions = (trait) => {
    if (!trait) return [];
    return trait.split(' vs. ');
  };

  const handleForceMatch = () => {
    if (!game?.id) return;
    setOriginalMatchState(game.isCorrect);
    setForcedMatch(true);
    dispatch(updateGameCorrectness(game.id, { isCorrect: true }));
  };

  const handleUndoMatch = () => {
    if (!game?.id) return;

    if (forcedMatch) {
      setForcedMatch(false);
      dispatch(updateGameCorrectness(game.id, { isCorrect: originalMatchState }));
    } else {
      dispatch(updateGameCorrectness(game.id, { isCorrect: false }));
    }
  };

  const handleChangeInteractionType = (type) => {
    if (!game?.id) return;
    setInteractionType(type);
    dispatch(updateGameInteractionType(game.id, { interactionType: type }));
  };

  const handleAddPlayer = (e) => {
    e.preventDefault();
    if (newPlayerName.trim() && !players.includes(newPlayerName.trim())) {
      setPlayers([...players, newPlayerName.trim()]);
      setNewPlayerName('');
      setShowAddPlayerForm(false);
    }
  };

  const handleRemovePlayer = (e) => {
    e.preventDefault();
    if (playerToRemove && players.includes(playerToRemove)) {
      setPlayers(players.filter(player => player !== playerToRemove));
      setPlayerToRemove('');
      setShowRemovePlayerForm(false);

      if (currentPlayer >= players.length - 1) {
        setCurrentPlayer(0);
      }
    }
  };

  const nextPlayerTurn = () => {
    if (players.length === 0) return;
    const nextPlayer = (currentPlayer + 1) % players.length;
    const isLastPlayer = currentPlayer === players.length - 1;

    if (isLastPlayer && selectedTrait) {
      setCompletedTraits(prev => [...prev, selectedTrait]);
      setUsedCards(prev => [...prev, `${selectedCategory}:${selectedTrait}`]);
      setSelectedCategory('');
      setSelectedTrait('');
      if (game?.id) {
        dispatch(updateGameTrait(game.id, {
          traitCategory: '',
          traitName: '',
          guessedValue: null,
          isCorrect: undefined
        }));
      }
      setRoundNumber(roundNumber + 1);
    }

    setGuessedValue(null);
    setGuessSubmitted(false);
    setSelectedContent([]);
    if (game?.id) {
      dispatch(updateGameTrait(game.id, {
        guessedValue: null,
        isCorrect: undefined
      }));
    }
    setCurrentPlayer(nextPlayer);
  };

  const resetGamePlay = () => {
    setGuessedValue(null);
    setGuessSubmitted(false);
  };

  const handleChooseAnotherCard = () => {
    if (!game?.id) return;
    dispatch(updateGameTrait(game.id, {
      traitName: ''
    }));
    setSelectedTrait('');
    setGuessedValue(null);
    setGuessSubmitted(false);
    setSelectedContent([]);
  };

  const handleGoBack = () => {
    if (!game?.id) return;
    dispatch(updateGameTrait(game.id, {
      traitCategory: '',
      traitName: ''
    }));
    setSelectedCategory('');
    setSelectedTrait('');
    setGuessedValue(null);
    setGuessSubmitted(false);
    setSelectedContent([]);
  };

  const handleClearSavedGame = async () => {
    if (window.confirm("Clear saved game? This will reset everything.")) {
      try {
        localStorage.removeItem("guessMeGameData");

        if (game?.id && sessionUser?.id) {
          const user1Id = game.user_1_id;
          const user2Id = game.user_2_id;
          await dispatch(deleteAllGamePlays(user1Id, user2Id));
          dispatch(resetGameState());
          await dispatch(getUserGamePlays());
        } else {
          dispatch(resetGameState());
        }

        setPlayers(sessionUser ? [sessionUser.username] : []);
        setCurrentPlayer(0);
        setRoundNumber(1);
        setUsedCards([]);
        setSelectedCategory('');
        setSelectedTrait('');
        setGuessedValue(null);
        setGuessSubmitted(false);
        setSelectedContent([]);
        setInteractionType('guessing');
        setForcedMatch(false);
        setOriginalMatchState(null);
      } catch (error) {
        console.error("Error clearing saved game:", error);
        setErrorMessage('Failed to clear saved game. Please try again.');
      }
    }
  };

  const handleResetGame = async () => {
    if (window.confirm("Are you sure you want to reset the game? All progress will be lost.")) {
      try {
        setErrorMessage('');

        if (game?.id && sessionUser?.id) {
          const user1Id = game.user_1_id;
          const user2Id = game.user_2_id;
          await dispatch(deleteAllGamePlays(user1Id, user2Id));
          dispatch(resetGameState());
          await dispatch(getUserGamePlays());
        } else {
          dispatch(resetGameState());
        }

        setRoundNumber(1);
        setCurrentPlayer(0);
        setSelectedCategory('');
        setSelectedTrait('');
        setGuessedValue(null);
        setGuessSubmitted(false);
        setSelectedContent([]);
        setInteractionType('guessing');
        setForcedMatch(false);
        setOriginalMatchState(null);
        setUsedCards([]);
      } catch (error) {
        console.error("Error resetting game:", error);
        setErrorMessage('Failed to reset game. Please try again.');
      }
    }
  };

  const handleBackToTraitCategory = () => {
    if (!game?.id) return;
    dispatch(updateGameTrait(game.id, {
      traitName: ''
    }));
    setSelectedTrait('');
    setGuessedValue(null);
    setGuessSubmitted(false);
  };

  const handleBackToCategories = () => {
    if (!game?.id) return;
    dispatch(updateGameTrait(game.id, {
      traitCategory: '',
      traitName: ''
    }));
    setSelectedCategory('');
    setSelectedTrait('');
    setGuessedValue(null);
    setGuessSubmitted(false);
  };

  if (!sessionUser) {
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
    <div className="game-play-container">
      <h2>Game Play</h2>

      {loading && <p className="loading-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="game-controls">
        <button
          className="start-game-button"
          onClick={handleStartGame}
          disabled={loading || !sessionUser}
        >
          Start Game
        </button>

        <button
          className="show-rules-button"
          onClick={() => setShowRules(!showRules)}
        >
          {showRules ? "Hide Rules" : "Show Rules"}
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="settings-btn"
        >
          {showSettings ? "Hide Settings" : "Settings"}
        </button>
      </div>

      {showRules && (
        <div className="rules-section">
          <h3>How to Play</h3>
          <h4>The game consists of six themed categories: Personality and Traits; Food and Drink; Music, Movies, and TV Shows; Travel and Adventure; Conversation Style and Humor; and Mindset and Lifestyle. Each category has a set of possible traits, preferences, or interests for each of you to guess about your match. You will be presented with two options for each category. At the start of the game, you both have the option to activate Roast Me Gently Mode. If both of you opt in, a lighthearted, sarcastic twist will be added to the game. When Roast Mode is on, each guess is followed by a playful roast that adds humor to the conversation. These roasts are meant to be light-hearted and funny, not mean-spirited. After both of you make your guess, the game will reveal whether each guess was correct or incorrect. For correct guesses, a playful or humorous response will appear. For incorrect guesses, the game might make a sarcastic comment or ask a follow-up question to spark conversation. After each guess, you will receive &quot;Talk About This&quot; prompts, which are designed to spark deeper or more playful conversations.</h4>
        </div>
      )}

      {game && (
        <div className="active-game">
          <h3>Active Game</h3>
          <p><strong>Status:</strong> {game.status || 'Active'}</p>
          <p><strong>Category:</strong> {game.traitCategory || 'Not selected'}</p>
          <p><strong>Trait:</strong> {game.traitName || 'Not selected'}</p>
          <p><strong>Current Player:</strong> {players[currentPlayer] || 'Player 1'}</p>

          <div className="category-selection">
            <h3>Select a Category</h3>
            <div className="categories-list">
              {traitCategories.map((categoryObj, index) => (
                <div key={index} className="category-section">
                  <h4>{categoryObj.category}</h4>
                  <div className="traits-list">
                    <button
                      onClick={() => handleCategorySelect(categoryObj.category)}
                      disabled={loading}
                    >
                      Select this category
                    </button>

                    {selectedCategory === categoryObj.category && !selectedTrait && categoryObj.traits.map((trait, i) => (
                      <button
                        key={i}
                        onClick={() => handleTraitSelect(trait)}
                        disabled={loading || completedTraits.includes(trait)}
                        className={`${selectedTrait === trait ? 'selected' : ''} ${completedTraits.includes(trait) ? 'completed' : ''}`}
                      >
                        {trait} {completedTraits.includes(trait) ? '(Completed)' : ''}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedTrait && !guessSubmitted && (
            <div className="trait-options">
              <h3>Which option best describes {players[currentPlayer]}?</h3>
              <div className="options-buttons">
                {getTraitOptions(selectedTrait).map((option, index) => (
                  <button
                    key={index}
                    className={`option-button ${guessedValue === option ? 'selected' : ''}`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <br />
              <button onClick={handleBackToTraitCategory} className="back-btn">
                Back to {selectedCategory}
              </button>

              <button onClick={handleBackToCategories} className="back-btn">
                Back to Categories
              </button>
            </div>
          )}

          <div>
            <button
              onClick={() => {
                setGuessedValue(null);
                setGuessSubmitted(false);
              }}
              className="reset-guess-button"
            >
              Reset Guess
            </button>
          </div>

          {guessSubmitted && (
            <div className="post-guess-actions">
              <div className="guess-result">
                <h4>Your Guess: {guessedValue}</h4>
                {game.isCorrect === true && <p className="match-indicator">It&apos;s a Match! 🥳</p>}
                {game.isCorrect === false && <p className="no-match-indicator">Not a Match 🤔</p>}
              </div>

              <div className="match-controls">
                {game.isCorrect !== true && (
                  <button
                    onClick={handleForceMatch}
                    className="match-button"
                  >
                    Make It a Match
                  </button>
                )}

                {game.isCorrect === true && (
                  <button
                    onClick={handleUndoMatch}
                    className="unmatch-button"
                  >
                    Undo Match
                  </button>
                )}
              </div>

              {forcedMatch && (
                <p className="forced-match-note">
                  <em>Match was manually set</em>
                </p>
              )}

              <div className="interaction-type-buttons">
                <h4>Interaction Mode:</h4>
                <button
                  className={`interaction-button ${game.interactionType === 'guessing' ? 'active' : ''}`}
                  onClick={() => handleChangeInteractionType('guessing')}
                  disabled={game.interactionType === 'guessing'}
                >
                  Guessing Mode
                </button>

                <button
                  className={`interaction-button ${game.interactionType === 'roasts' ? 'active' : ''}`}
                  onClick={() => handleChangeInteractionType('roasts')}
                  disabled={game.interactionType === 'roasts'}
                >
                  {game.interactionType === 'roasts' ? 'Disable Roast Mode' : 'Enable Roast Mode'}
                </button>

                <button
                  className={`interaction-button ${game.interactionType === 'talk-about' ? 'active' : ''}`}
                  onClick={() => handleChangeInteractionType('talk-about')}
                  disabled={game.interactionType === 'talk-about'}
                >
                  Talk About Mode
                </button>
              </div>

              {game.isCorrect === true && game.interactionType === 'talk-about' && (
                <div className="prompts-section">
                  <h4>It&apos;s a Match! 🥳 Discuss These Too:</h4>
                  <ul className="prompts-list">
                    {contentByInteractionType['talk-about'].correct.map((prompt, index) => (
                      <li key={index}>{prompt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {game.isCorrect === false && game.interactionType === 'talk-about' && (
                <div className="prompts-section">
                  <h4>Not a Match 🤔 Discuss These Too:</h4>
                  <ul className="prompts-list">
                    {contentByInteractionType['talk-about'].incorrect.map((prompt, index) => (
                      <li key={index}>{prompt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {game.interactionType === 'roasts' && (
                <div className="roast-section-wrapper">
                  <div className="roast-section">
                    <h4>Roast Mode 🔥</h4>
                    <ul className="roasts-list">
                      {(game.isCorrect
                        ? contentByInteractionType.roasts.correct
                        : contentByInteractionType.roasts.incorrect
                      ).map((roast, index) => (
                        <li key={index}>{roast}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="choice-roast">
                    <h4>Roasts based on your guess:</h4>
                    <ul className="roasts-list">
                      {getChoiceRoast(selectedCategory, guessedValue)
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
                <button onClick={handleChooseAnotherCard} className="another-card-btn">
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

      {showSettings && (
        <div className="settings-panel">
          <h3>Game Settings</h3>

          <div className="player-management">
            <h4>Players</h4>
            <div className="player-list">
              {players.map((player, index) => (
                <p key={index}>{player}</p>
              ))}
            </div>

            <div className="player-buttons">
              <button
                onClick={() => setShowAddPlayerForm(!showAddPlayerForm)}
                className="add-player-btn"
              >
                {showAddPlayerForm ? "Cancel" : "Add Player"}
              </button>

              {showAddPlayerForm && (
                <form onSubmit={handleAddPlayer} className="add-player-form">
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
                  <button
                    onClick={() => setShowRemovePlayerForm(!showRemovePlayerForm)}
                    className="remove-player-btn"
                  >
                    {showRemovePlayerForm ? "Cancel" : "Remove Player"}
                  </button>

                  {showRemovePlayerForm && (
                    <form onSubmit={handleRemovePlayer} className="remove-player-form">
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
          </div>

          <div className="game-progress">
            <h4>Game Progress</h4>
            <p>Round: {roundNumber}</p>
            <p>Current Player: {players[currentPlayer]}</p>
            <p>Cards Used: {usedCards.length} / {totalCards}</p>
            <p>Cards Remaining: {remainingCards}</p>
          </div>

          <button
            onClick={handleClearSavedGame}
            className="clear-saved-game-btn"
          >
            Clear Saved Game
          </button>
        </div>
      )}

      <button
        onClick={handleResetGame}
        className="reset-game-btn"
      >
        Reset Game
      </button>
    </div>
  );
};

export default GamePlay;