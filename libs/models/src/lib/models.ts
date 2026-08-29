export enum PreferredLanguage {
  ENGLISH = 'en',
  TELUGU = 'te',
  HINDI = 'hi',
}

export enum AppTab {
  HOME = 'home',
  SADHANA = 'sadhana',
  UPDATES = 'updates',
  COMMUNITY = 'community',
  PROFILE = 'profile',
  JOURNEY = 'journey',
}

export enum DevoteeRole {
  DEVOTEE = 'devotee',
  ADMIN = 'admin',
}

export enum AnnouncementType {
  FESTIVAL = 'festival',
  TEMPLE = 'temple',
  CLASSES = 'classes',
  SEVA = 'seva',
  GENERAL = 'general',
}

export interface IDevotee {
  id: number;
  name: string;
  email: string;
  phone?: string;
  japaGoal: number;
  currentStreak: number;
  bestStreak: number;
  totalRoundsChanted: number;
  preferredLanguage: PreferredLanguage;
  role: DevoteeRole;
  createdAt: string;
}

export interface ISadhanaRecord {
  id: number;
  devoteeId: number;
  date: string; // YYYY-MM-DD format
  japaRoundsCount: number;
  readingCompleted: boolean;
  readingProgress: string;
  mangalaArati: boolean;
  morningPrayer: boolean;
  spiritualLecture: boolean;
  nbsJoined: boolean;
  createdAt: string;
}

export interface IAnnouncement {
  id: number;
  title: string;
  description: string;
  image?: string;
  type: AnnouncementType;
  date: string;
  time?: string;
  location?: string;
  official: boolean; // true = Official ISKCON Vizag, false = Community/Devotee
  createdAt: string;
}

export interface ISevaOpportunity {
  id: number;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  requiredDevoteesCount: number;
  registeredDevoteesCount: number;
  official: boolean;
  createdAt: string;
}

export class LoginResponseDto {
  token: string;
  devotee: IDevotee;

  constructor(token: string, devotee: IDevotee) {
    this.token = token;
    this.devotee = devotee;
  }
}

export class SadhanaSummaryDto {
  japaRoundsChanted: number;
  japaGoal: number;
  readingBook: string;
  readingProgress: string;
  sadhanaCompletedCount: number;
  sadhanaTotalCount: number;

  constructor(
    japaRoundsChanted: number,
    japaGoal: number,
    readingBook: string,
    readingProgress: string,
    sadhanaCompletedCount: number,
    sadhanaTotalCount: number
  ) {
    this.japaRoundsChanted = japaRoundsChanted;
    this.japaGoal = japaGoal;
    this.readingBook = readingBook;
    this.readingProgress = readingProgress;
    this.sadhanaCompletedCount = sadhanaCompletedCount;
    this.sadhanaTotalCount = sadhanaTotalCount;
  }
}

// Request and Response DTOs
export class RegisterRequestDto {
  name: string;
  email: string;
  passwordPlain: string;
  phone?: string;
  preferredLanguage?: PreferredLanguage;

  constructor(
    name: string,
    email: string,
    passwordPlain: string,
    phone?: string,
    preferredLanguage?: PreferredLanguage
  ) {
    this.name = name;
    this.email = email;
    this.passwordPlain = passwordPlain;
    this.phone = phone;
    this.preferredLanguage = preferredLanguage;
  }
}

export class LoginRequestDto {
  email: string;
  passwordPlain: string;

  constructor(email: string, passwordPlain: string) {
    this.email = email;
    this.passwordPlain = passwordPlain;
  }
}

export class UpdatePreferencesRequestDto {
  preferredLanguage: PreferredLanguage;
  japaGoal: number;

  constructor(preferredLanguage: PreferredLanguage, japaGoal: number) {
    this.preferredLanguage = preferredLanguage;
    this.japaGoal = japaGoal;
  }
}

export class SadhanaLogRequestDto {
  date: string; // YYYY-MM-DD
  japaRoundsCount: number;
  readingCompleted: boolean;
  readingProgress?: string;
  mangalaArati: boolean;
  morningPrayer: boolean;
  spiritualLecture: boolean;
  nbsJoined: boolean;

  constructor(
    date: string,
    japaRoundsCount: number,
    readingCompleted: boolean,
    readingProgress: string | undefined,
    mangalaArati: boolean,
    morningPrayer: boolean,
    spiritualLecture: boolean,
    nbsJoined: boolean
  ) {
    this.date = date;
    this.japaRoundsCount = japaRoundsCount;
    this.readingCompleted = readingCompleted;
    this.readingProgress = readingProgress;
    this.mangalaArati = mangalaArati;
    this.morningPrayer = morningPrayer;
    this.spiritualLecture = spiritualLecture;
    this.nbsJoined = nbsJoined;
  }
}

export class CreateAnnouncementRequestDto {
  title: string;
  description: string;
  image?: string;
  type: AnnouncementType;
  date: string;
  time?: string;
  location?: string;
  official: boolean;

  constructor(
    title: string,
    description: string,
    image: string | undefined,
    type: AnnouncementType,
    date: string,
    time: string | undefined,
    location: string | undefined,
    official: boolean
  ) {
    this.title = title;
    this.description = description;
    this.image = image;
    this.type = type;
    this.date = date;
    this.time = time;
    this.location = location;
    this.official = official;
  }
}

export class CreateSevaRequestDto {
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  requiredDevoteesCount: number;
  official: boolean;

  constructor(
    title: string,
    description: string,
    date: string,
    time: string | undefined,
    location: string,
    requiredDevoteesCount: number,
    official: boolean
  ) {
    this.title = title;
    this.description = description;
    this.date = date;
    this.time = time;
    this.location = location;
    this.requiredDevoteesCount = requiredDevoteesCount;
    this.official = official;
  }
}

export class TranslationKeysDto {
  greeting: string;
  morning: string;
  myBhakti: string;
  japa: string;
  rounds: string;
  todaysReading: string;
  todaysSadhana: string;
  myProgress: string;
  officialUpdates: string;
  home: string;
  sadhanaTab: string;
  updatesTab: string;
  journeyTab: string;
  profileTab: string;
  readNow: string;
  continueJapa: string;
  tapToCount: string;
  completed: string;
  streaks: string;
  days: string;
  bestStreak: string;
  thisMonth: string;
  japaHistory: string;
  week: string;
  month: string;
  year: string;
  language: string;
  changeLanguage: string;
  lightMode: string;
  darkMode: string;
  currentStreak: string;
  mangalaArati: string;
  morningPrayer: string;
  spiritualLecture: string;
  official: string;
  community: string;
  viewDetails: string;
  seva: string;
  gitaVerse: string;
  gitaVerseRef: string;
  sadhanaRatio: string;
  all: string;
  festivals: string;
  temple: string;
  classes: string;
  sevaCat: string;
  tapBead: string;
  nbsTitle: string;
  nbsSubtitle: string;
  joinNbs: string;
  joinedNbs: string;

  constructor(fields: {
    greeting: string;
    morning: string;
    myBhakti: string;
    japa: string;
    rounds: string;
    todaysReading: string;
    todaysSadhana: string;
    myProgress: string;
    officialUpdates: string;
    home: string;
    sadhanaTab: string;
    updatesTab: string;
    journeyTab: string;
    profileTab: string;
    readNow: string;
    continueJapa: string;
    tapToCount: string;
    completed: string;
    streaks: string;
    days: string;
    bestStreak: string;
    thisMonth: string;
    japaHistory: string;
    week: string;
    month: string;
    year: string;
    language: string;
    changeLanguage: string;
    lightMode: string;
    darkMode: string;
    currentStreak: string;
    mangalaArati: string;
    morningPrayer: string;
    spiritualLecture: string;
    official: string;
    community: string;
    viewDetails: string;
    seva: string;
    gitaVerse: string;
    gitaVerseRef: string;
    sadhanaRatio: string;
    all: string;
    festivals: string;
    temple: string;
    classes: string;
    sevaCat: string;
    tapBead: string;
    nbsTitle: string;
    nbsSubtitle: string;
    joinNbs: string;
    joinedNbs: string;
  }) {
    this.greeting = fields.greeting;
    this.morning = fields.morning;
    this.myBhakti = fields.myBhakti;
    this.japa = fields.japa;
    this.rounds = fields.rounds;
    this.todaysReading = fields.todaysReading;
    this.todaysSadhana = fields.todaysSadhana;
    this.myProgress = fields.myProgress;
    this.officialUpdates = fields.officialUpdates;
    this.home = fields.home;
    this.sadhanaTab = fields.sadhanaTab;
    this.updatesTab = fields.updatesTab;
    this.journeyTab = fields.journeyTab;
    this.profileTab = fields.profileTab;
    this.readNow = fields.readNow;
    this.continueJapa = fields.continueJapa;
    this.tapToCount = fields.tapToCount;
    this.completed = fields.completed;
    this.streaks = fields.streaks;
    this.days = fields.days;
    this.bestStreak = fields.bestStreak;
    this.thisMonth = fields.thisMonth;
    this.japaHistory = fields.japaHistory;
    this.week = fields.week;
    this.month = fields.month;
    this.year = fields.year;
    this.language = fields.language;
    this.changeLanguage = fields.changeLanguage;
    this.lightMode = fields.lightMode;
    this.darkMode = fields.darkMode;
    this.currentStreak = fields.currentStreak;
    this.mangalaArati = fields.mangalaArati;
    this.morningPrayer = fields.morningPrayer;
    this.spiritualLecture = fields.spiritualLecture;
    this.official = fields.official;
    this.community = fields.community;
    this.viewDetails = fields.viewDetails;
    this.seva = fields.seva;
    this.gitaVerse = fields.gitaVerse;
    this.gitaVerseRef = fields.gitaVerseRef;
    this.sadhanaRatio = fields.sadhanaRatio;
    this.all = fields.all;
    this.festivals = fields.festivals;
    this.temple = fields.temple;
    this.classes = fields.classes;
    this.sevaCat = fields.sevaCat;
    this.tapBead = fields.tapBead;
    this.nbsTitle = fields.nbsTitle;
    this.nbsSubtitle = fields.nbsSubtitle;
    this.joinNbs = fields.joinNbs;
    this.joinedNbs = fields.joinedNbs;
  }
}

export class TranslationsModel {
  en: TranslationKeysDto;
  te: TranslationKeysDto;
  hi: TranslationKeysDto;

  constructor(en: TranslationKeysDto, te: TranslationKeysDto, hi: TranslationKeysDto) {
    this.en = en;
    this.te = te;
    this.hi = hi;
  }
}

export const TRANSLATIONS = new TranslationsModel(
  new TranslationKeysDto({
    greeting: "Hare Krishna 🙏",
    morning: "Good Morning, Arjun",
    myBhakti: "My Bhakti",
    japa: "Japa",
    rounds: "Rounds",
    todaysReading: "Today's Reading",
    todaysSadhana: "Today's Sadhana",
    myProgress: "My Progress",
    officialUpdates: "Important From ISKCON Vizag",
    home: "Home",
    sadhanaTab: "Sadhana",
    updatesTab: "Updates",
    journeyTab: "Journey",
    profileTab: "Profile",
    readNow: "Read Now",
    continueJapa: "Continue Japa",
    tapToCount: "Tap to count",
    completed: "Completed",
    streaks: "Streaks",
    days: "Days",
    bestStreak: "Best Streak",
    thisMonth: "This Month",
    japaHistory: "Japa History",
    week: "Week",
    month: "Month",
    year: "Year",
    language: "Language",
    changeLanguage: "భాషను మార్చండి",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    currentStreak: "Current Streak",
    mangalaArati: "Mangala Arati",
    morningPrayer: "Morning Prayer",
    spiritualLecture: "Spiritual Lecture",
    official: "Official ISKCON Vizag",
    community: "Community",
    viewDetails: "View Details",
    seva: "Seva Opportunity",
    gitaVerse: "Bhagavad-gita",
    gitaVerseRef: "Chapter 2, Verse 20",
    sadhanaRatio: "Completed",
    all: "All",
    festivals: "Festivals",
    temple: "Temple",
    classes: "Classes",
    sevaCat: "Seva",
    tapBead: "Tap Bead to Count Japa",
    nbsTitle: "Nityam Bhagavata Sevaya (NBS)",
    nbsSubtitle: "Daily Devotional Session",
    joinNbs: "Check-in NBS Session",
    joinedNbs: "✓ Attended NBS Today",
  }),
  new TranslationKeysDto({
    greeting: "హరే కృష్ణ 🙏",
    morning: "శుభోదయం, అర్జున్",
    myBhakti: "నా భక్తి",
    japa: "జపం",
    rounds: "రౌండ్లు",
    todaysReading: "నేటి పఠనం",
    todaysSadhana: "నేటి సాధన",
    myProgress: "నా ప్రగతి",
    officialUpdates: "ఇస్కాన్ వైజాగ్ ముఖ్య సమాచారం",
    home: "హోమ్",
    sadhanaTab: "సాధన",
    updatesTab: "అప్డేట్లు",
    journeyTab: "నా ప్రయాణం",
    profileTab: "ప్రొఫైల్",
    readNow: "ఇప్పుడే చదవండి",
    continueJapa: "జపం కొనసాగించండి",
    tapToCount: "లెక్కించడానికి నొక్కండి",
    completed: "పూర్తయింది",
    streaks: "రోజుల వరుస",
    days: "రోజులు",
    bestStreak: "ఉత్తమ వరుస",
    thisMonth: "ఈ నెల",
    japaHistory: "జప చరిత్ర",
    week: "వారం",
    month: "నెల",
    year: "సంవత్సరం",
    language: "భాష",
    changeLanguage: "Change Language",
    lightMode: "లైట్ మోడ్",
    darkMode: "డార్క్ మోड",
    currentStreak: "ప్రస్తుత వరుస",
    mangalaArati: "మంగళ ఆరతి",
    morningPrayer: "ఉదయ ప్రార్థన",
    spiritualLecture: "ఆధ్యాత్మిక ఉపన్యాసం",
    official: "అధికారిక ఇస్కాన్ వైజాగ్",
    community: "కమ्यूనిటీ",
    viewDetails: "వివరాలు చూడండి",
    seva: "సేవ అవకాశం",
    gitaVerse: "భగవద్గీత",
    gitaVerseRef: "అధ్యాయం 2, శ్లోకం 20",
    sadhanaRatio: "పూర్తయింది",
    all: "అన్నీ",
    festivals: "పండుగలు",
    temple: "దేవాలయం",
    classes: "తరగతులు",
    sevaCat: "సేవ",
    tapBead: "జపం చేయడానికి పూసను నొక్కండి",
    nbsTitle: "నిత్యం భాగవత సేవయ (NBS)",
    nbsSubtitle: "రోజువారీ భక్తి కార్యక్రమం",
    joinNbs: "NBS సెషన్‌లో చేరండి",
    joinedNbs: "✓ ఈరోజు NBS కి హాజరయ్యారు",
  }),
  new TranslationKeysDto({
    greeting: "हरे कृष्ण 🙏",
    morning: "शुभ प्रभात, अर्जुन",
    myBhakti: "मेरी भक्ति",
    japa: "जप",
    rounds: "माला",
    todaysReading: "आज का पठन",
    todaysSadhana: "आज की साधना",
    myProgress: "मेरी प्रगति",
    officialUpdates: "इस्कॉन विजाग से महत्वपूर्ण",
    home: "होम",
    sadhanaTab: "साधना",
    updatesTab: "अपडेट्स",
    journeyTab: "मेरी यात्रा",
    profileTab: "प्रोफाइल",
    readNow: "अभी पढ़ें",
    continueJapa: "जप जारी रखें",
    tapToCount: "गिनने के लिए दबाएं",
    completed: "पूर्ण",
    streaks: "दिनों का सिलसिला",
    days: "दिन",
    bestStreak: "सर्वश्रेष्ठ सिलसिला",
    thisMonth: "इस महीने",
    japaHistory: "जप इतिहास",
    week: "सप्ताह",
    month: "महीना",
    year: "वर्ष",
    language: "भाषा",
    changeLanguage: "भाषा बदलें",
    lightMode: "लाइट मोड",
    darkMode: "डार्क मोड",
    currentStreak: "वर्तमान सिलसिला",
    mangalaArati: "मंगला आरती",
    morningPrayer: "सुबह की प्रार्थना",
    spiritualLecture: "आध्यात्मिक प्रवचन",
    official: "आधिकारिक इस्कॉन विजाग",
    community: "समुदाय",
    viewDetails: "विवरण देखें",
    seva: "सेवा का अवसर",
    gitaVerse: "भगवद-गीता",
    gitaVerseRef: "अध्याय 2, श्लोक 20",
    sadhanaRatio: "पूर्ण",
    all: "सभी",
    festivals: "त्यौहार",
    temple: "मंदिर",
    classes: "कक्षाएं",
    sevaCat: "सेवा",
    tapBead: "जप गिनने के लिए मनके को दबाएं",
    nbsTitle: "नित्यं भागवत सेवया (NBS)",
    nbsSubtitle: "दैनिक भक्ति सत्र",
    joinNbs: "NBS सत्र में शामिल हों",
    joinedNbs: "✓ आज NBS सत्र में उपस्थित थे",
  })
);


