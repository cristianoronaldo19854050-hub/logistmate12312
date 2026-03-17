/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, createContext, useContext, useEffect, useRef, useMemo } from 'react';
import { 
  Home, 
  BookOpen, 
  ShieldCheck, 
  ClipboardList, 
  Globe, 
  Search, 
  Menu, 
  X, 
  ChevronRight,
  Check,
  Calculator,
  AlertTriangle,
  Info,
  Lock,
  CheckCircle2,
  XCircle,
  Wrench,
  Clock,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Trophy,
  Truck,
  Users,
  Fuel,
  FileText,
  Activity,
  MapPin,
  Leaf,
  BarChart3,
  AlertCircle,
  Volume2,
  VolumeX,
  LogOut,
  User as UserIcon,
  Zap,
  Bot,
  Scale,
  Lightbulb,
  ExternalLink,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QUESTIONS } from './data/questions';
import { TERMS, GLOSSARY, ABBREVIATIONS } from './data/dictionary';
import MappingGame from './components/MappingGame';
import USTimeZoneMap from './components/USTimeZoneMap';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthModal } from './components/AuthModal';
import { AIChatAssistant } from './components/AIChatAssistant';
import { AdminPortal } from './components/AdminPortal';

// --- Types & I18n ---

type Language = 'en' | 'ru' | 'uz';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const translations: Translations = {
  aiAssistant: { en: 'AI Assistant', ru: 'AI Помощник', uz: 'AI Yordamchi' },
  aiAssistantDesc: { en: 'Ask our AI expert about logistics regulations and calculations', ru: 'Спросите нашего AI-эксперта о правилах логистики и расчетах', uz: 'Logistika qoidalari va hisob-kitoblari haqida bizning AI mutaxassisimizdan so\'rang' },
  home: { en: 'Home', ru: 'Главная', uz: 'Asosiy' },
  tests: { en: 'Tests', ru: 'Тесты', uz: 'Testlar' },
  dictionary: { en: 'Dictionary', ru: 'Словарь', uz: 'Lug\'at' },
  safety: { en: 'Safety', ru: 'Безопасность', uz: 'Xavfsizlik' },
  tools: { en: 'Tools', ru: 'Инструменты', uz: 'Asboblar' },
  other: { en: 'Other', ru: 'Другое', uz: 'Boshqa' },
  getStarted: { en: 'Get Started', ru: 'Начать', uz: 'Boshlash' },
  heroTitle: { 
    en: 'Your successful career in logistics starts here', 
    ru: 'Ваша успешная карьера в логистике начинается здесь', 
    uz: 'Logistikadagi muvaffaqiyatli karyerangiz shu yerdan boshlanadi' 
  },
  heroSub: {
    en: 'Master the skills that power global supply chains. Learn from industry experts and join thousands of professionals transforming the logistics industry.',
    ru: 'Освойте навыки, которые управляют глобальными цепочками поставок. Учитесь у экспертов отрасли и присоединяйтесь к тысячам профессионалов, трансформирующих логистику.',
    uz: 'Global ta\'minot zanjirlarini boshqaradigan ko\'nikmalarni egallang. Soha mutaxassislaridan o\'rganing va logistika sohasini o\'zgartirayotgan minglab mutaxassislarga qo\'shiling.'
  },
  whatIsLogistmate: { en: 'What is Logistmate?', ru: 'Что такое Logistmate?', uz: 'Logistmate nima?' },
  logistmateDesc: {
    en: 'LogistMate is an interactive learning platform designed to teach logistics fundamentals to students and professionals. Our comprehensive curriculum covers essential logistics concepts, terminology, and best practices in an engaging, easy-to-understand format.',
    ru: 'LogistMate — это интерактивная обучающая платформа, предназначенная для обучения основам логистики студентов и профессионалов. Наша комплексная учебная программа охватывает основные концепции, терминологию и лучшие практики логистики в увлекательном и простом для понимания формате.',
    uz: 'LogistMate - bu talabalar va mutaxassislarga logistika asoslarini o\'rgatish uchun mo\'ljallangan interaktiv ta\'lim platformasi. Bizning keng qamrovli o\'quv dasturimiz asosiy logistika tushunchalari, terminologiyasi va ilg\'or tajribalarini qiziqarli va tushunarli formatda qamrab oladi.'
  },
  whyCreated: { en: 'Why We Created It', ru: 'Почему мы это создали', uz: 'Nima uchun yaratdik' },
  whyCreatedDesc: {
    en: 'We recognized the need for accessible, quality logistics education for students. Our mission is to make learning logistics concepts engaging, practical, and available to everyone interested in the transportation and supply chain industry.',
    ru: 'Мы осознали потребность в доступном и качественном логистическом образовании для студентов. Наша миссия — сделать изучение концепций логистики увлекательным, практичным и доступным для всех, кто интересуется индустрией транспорта и цепочек поставок.',
    uz: 'Biz talabalar uchun qulay va sifatli logistika ta\'limiga ehtiyoj borligini angladik. Bizning vazifamiz logistika tushunchalarini o\'rganishni transport va ta\'minot zanjiri sanoatiga qiziqqan har bir kishi uchun qiziqarli, amaliy va ochiq qilishdir.'
  },
  howItWorks: { en: 'How It Works', ru: 'Как это работает', uz: 'Qanday ishlaydi' },
  howItWorksDesc: {
    en: 'Progress through four difficulty levels, from basics to mastery. Each level builds on the previous one with interactive tests, comprehensive glossary terms, and detailed explanations to help you master logistics concepts step by step.',
    ru: 'Пройдите четыре уровня сложности, от основ до мастерства. Каждый уровень основывается на предыдущем с интерактивными тестами, подробными терминами глоссария и детальными объяснениями, которые помогут вам шаг за шагом освоить концепции логистики.',
    uz: 'Asoslardan mahoratgacha bo\'lgan to\'rtta qiyinchilik darajasidan o\'ting. Har bir daraja logistika tushunchalarini bosqichma-bosqich o\'zlashtirishingizga yordam beradigan interaktiv testlar, keng qamrovli glossariy atamalari va batafsil tushuntirishlar bilan oldingisiga tayanadi.'
  },
  whoBenefits: { en: 'Who Benefits', ru: 'Кому это полезно', uz: 'Kimga foydali' },
  whoBenefitsDesc: {
    en: 'Perfect for students studying logistics, aspiring supply chain professionals, career changers entering the transportation industry, and anyone looking to build a solid foundation in logistics management and operations.',
    ru: 'Идеально подходит для студентов, изучающих логистику, начинающих специалистов по цепочкам поставок, людей, меняющих карьеру и входящих в транспортную отрасль, а также для всех, кто хочет создать прочную основу в управлении логистикой и операциями.',
    uz: 'Logistikani o\'rganayotgan talabalar, ta\'minot zanjiri mutaxassislari bo\'lishga intilayotganlar, transport sohasiga kirib kelayotgan karyerasini o\'zgartiruvchilar va logistika menejmenti va operatsiyalarida mustahkam poydevor yaratmoqchi bo\'lgan har bir kishi uchun juda mos keladi.'
  },
  keyBenefits: { en: 'Key Benefits', ru: 'Ключевые преимущества', uz: 'Asosiy afzalliklar' },
  benefit1Title: { en: 'Comprehensive Coverage', ru: 'Комплексный охват', uz: 'Keng qamrovli qamrov' },
  benefit1Desc: { en: 'Essential logistics topics including transportation, safety, compliance, and operations management', ru: 'Основные темы логистики, включая транспорт, безопасность, соблюдение нормативных требований и управление операциями', uz: 'Transport, xavfsizlik, muvofiqlik va operatsiyalarni boshqarish kabi muhim logistika mavzulari' },
  benefit2Title: { en: 'Progressive Learning', ru: 'Прогрессивное обучение', uz: 'Progressiv ta\'lim' },
  benefit2Desc: { en: 'Start with basics and unlock advanced levels as you master each stage', ru: 'Начните с основ и открывайте продвинутые уровни по мере освоения каждого этапа', uz: 'Asoslardan boshlang va har bir bosqichni o\'zlashtirganingizda ilg\'or darajalarni oching' },
  benefit3Title: { en: 'Multilingual Support', ru: 'Многоязычная поддержка', uz: 'Ko\'p tilli qo\'llab-quvvatlash' },
  benefit3Desc: { en: 'Available in English, Russian, and Uzbek to serve diverse communities', ru: 'Доступно на английском, русском и узбекском языках для обслуживания различных сообществ', uz: 'Turli jamoalarga xizmat ko\'rsatish uchun ingliz, rus va o\'zbek tillarida mavjud' },
  benefit4Title: { en: 'Interactive Learning', ru: 'Интерактивное обучение', uz: 'Interaktiv ta\'lim' },
  benefit4Desc: { en: 'Practice with quizzes, searchable glossaries, and comprehensive reference materials', ru: 'Практикуйтесь с помощью викторин, глоссариев с возможностью поиска и подробных справочных материалов', uz: 'Viktorinalar, qidiriladigan glossariylar va keng qamrovli ma\'lumotnomalar bilan mashq qiling' },
  signIn: { en: 'Sign In', ru: 'Войти', uz: 'Kirish' },
  signUp: { en: 'Sign Up', ru: 'Регистрация', uz: 'Ro\'yxatdan o\'tish' },
  signOut: { en: 'Sign Out', ru: 'Выйти', uz: 'Chiqish' },
  profile: { en: 'Profile', ru: 'Профиль', uz: 'Profil' },
  dashboard: { en: 'Dashboard', ru: 'Панель управления', uz: 'Boshqaruv paneli' },
  welcomeBack: { en: 'Welcome back', ru: 'С возвращением', uz: 'Xush kelibsiz' },
  yourProgress: { en: 'Your Progress', ru: 'Ваш прогресс', uz: 'Sizning yutuqlaringiz' },
  recentActivity: { en: 'Recent Activity', ru: 'Недавняя активность', uz: 'Yaqindagi faollik' },
  achievements: { en: 'Achievements', ru: 'Достижения', uz: 'Yutuqlar' },
  authRequired: { en: 'Authentication Required', ru: 'Требуется авторизация', uz: 'Avtorizatsiya talab qilinadi' },
  authRequiredDesc: { en: 'Please sign in or register to access this feature.', ru: 'Пожалуйста, войдите или зарегистрируйтесь, чтобы получить доступ к этой функции.', uz: 'Ushbu funksiyadan foydalanish uchun tizimga kiring yoki ro\'yxatdan o\'ting.' },
  feedbackTitle: { en: 'Send Us Your Feedback', ru: 'Отправьте нам свой отзыв', uz: 'Bizga fikr-mulohazalaringizni yuboring' },
  feedbackSub: { en: 'We value your opinions and suggestions to improve LogistMate', ru: 'Мы ценим ваше мнение и предложения по улучшению LogistMate', uz: 'LogistMate-ni yaxshilash uchun sizning fikr va mulohazalaringizni qadrlaymiz' },
  nameLabel: { en: 'Name *', ru: 'Имя *', uz: 'Ism *' },
  emailLabel: { en: 'Email (Optional)', ru: 'Email (необязательно)', uz: 'Email (ixtiyoriy)' },
  messageLabel: { en: 'Message *', ru: 'Сообщение *', uz: 'Xabar *' },
  submitFeedback: { en: 'Submit Feedback', ru: 'Отправить отзыв', uz: 'Fikrni yuborish' },
  about: { en: 'ABOUT', ru: 'О НАС', uz: 'BIZ HAQIMIZDA' },
  quickLinks: { en: 'QUICK LINKS', ru: 'БЫСТРЫЕ ССЫЛКИ', uz: 'TEZKOR HAVOLALAR' },
  contact: { en: 'CONTACT', ru: 'КОНТАКТЫ', uz: 'ALOQA' },
  learning: { en: 'LEARNING', ru: 'ОБУЧЕНИЕ', uz: 'O\'RGANISH' },
  aboutText: { en: 'Learn logistics fundamentals, from basic concepts to advanced supply chain management.', ru: 'Изучите основы логистики, от базовых концепций до продвинутого управления цепочками поставок.', uz: 'Logistika asoslarini, asosiy tushunchalardan tortib ta\'minot zanjirini ilg\'or boshqarishgacha o\'rganing.' },
  terms: { en: 'Terms', ru: 'Термины', uz: 'Atamalar' },
  glossary: { en: 'Glossary', ru: 'Глоссарий', uz: 'Glossariy' },
  abbreviations: { en: 'Abbreviations', ru: 'Аббревиатуры', uz: 'Abbreviaturalar' },
  basics: { en: 'BASICs', ru: 'Основы', uz: 'Asoslar' },
  difficultyLevels: { en: '4 Difficulty Levels', ru: '4 уровня сложности', uz: '4 ta qiyinchilik darajasi' },
  welcome: { en: 'Welcome to Logistmate', ru: 'Добро пожаловать в Logistmate', uz: 'Logistmate-ga xush kelibsiz' },
  heroDesc: { 
    en: 'Your all-in-one platform for logistics excellence. Master your knowledge, stay safe, and speak the language of logistics.',
    ru: 'Ваша универсальная платформа для совершенства в логистике. Совершенствуйте свои знания, оставайтесь в безопасности и говорите на языке логистики.',
    uz: 'Logistika sohasida mukammallikka erishish uchun barchasi birda platforma. Bilimingizni oshiring, xavfsiz bo\'ling va logistika tilida gapiring.'
  },
  searchPlaceholder: { en: 'Search terms...', ru: 'Поиск терминов...', uz: 'Atamalarni qidirish...' },
  startTest: { en: 'Start Test', ru: 'Начать тест', uz: 'Testni boshlash' },
  safetyChecklist: { en: 'Safety Checklist', ru: 'Контрольный список безопасности', uz: 'Xavfsizlik nazorat ro\'yxati' },
  weightCalc: { en: 'Load Weight Calculator', ru: 'Калькулятор веса груза', uz: 'Yuk vazni kalkulyatori' },
  averageScore: { en: 'Average Score', ru: 'Средний балл', uz: 'O\'rtacha ball' },
  level1Score: { en: 'Level 1 Score', ru: 'Балл уровня 1', uz: '1-daraja balli' },
  level2Score: { en: 'Level 2 Score', ru: 'Балл уровня 2', uz: '2-daraja balli' },
  level3Score: { en: 'Level 3 Score', ru: 'Балл уровня 3', uz: '3-daraja balli' },
  level4Score: { en: 'Level 4 Score', ru: 'Балл уровня 4', uz: '4-daraja balli' },
  levelsCompleted: { en: '0 / 4 Levels Completed', ru: '0 / 4 уровней пройдено', uz: '0 / 4 daraja yakunlandi' },
  inProgress: { en: 'In Progress', ru: 'В процессе', uz: 'Jarayonda' },
  locked: { en: 'Locked', ru: 'Заблокировано', uz: 'Bloklangan' },
  level1Title: { en: 'Level 1', ru: 'Уровень 1', uz: '1-daraja' },
  level2Title: { en: 'Level 2', ru: 'Уровень 2', uz: '2-daraja' },
  level3Title: { en: 'Level 3', ru: 'Уровень 3', uz: '3-daraja' },
  level4Title: { en: 'Level 4', ru: 'Уровень 4', uz: '4-daraja' },
  level1Desc: { en: 'Test your fundamental logistics knowledge', ru: 'Проверьте свои базовые знания логистики', uz: 'Logistika bo\'yicha asosiy bilimlaringizni sinab ko\'ring' },
  level2Desc: { en: 'Challenge yourself with advanced logistics scenarios', ru: 'Испытайте себя в продвинутых сценариях логис����ики', uz: 'Murakkab logistika ssenariylari bilan o\'zingizni sinab ko\'ring' },
  level3Desc: { en: 'Master complex logistics operations management', ru: 'Освойте управление сложными логистическими операциями', uz: 'Murakkab logistika operatsiyalarini boshqarishni o\'zlashtiring' },
  level4Desc: { en: 'Demonstrate mastery of advanced logistics concepts', ru: 'Продемонстрируйте мастерство в продвинутых концепциях логистики', uz: 'Ilg\'or logistika tushunchalari bo\'yicha mahoratingizni namoyish eting' },
  unlockLevel2: { en: 'Complete Level 1 with 90% to unlock Level 2', ru: 'Пройдите уровень 1 на 90%, чтобы разблокировать уровень 2', uz: '2-darajani ochish uchun 1-darajani 90% bilan yakunlang' },
  unlockLevel3: { en: 'Complete Level 2 with 90% to unlock Level 3', ru: 'Пройдите уровень 2 на 90%, чтобы разблокировать уровень 3', uz: '3-darajani ochish uchun 2-darajani 90% bilan yakunlang' },
  unlockLevel4: { en: 'Complete Level 3 with 90% to unlock Level 4', ru: 'Пройдите уровень 3 на 90%, чтобы разблокировать уровень 4', uz: '4-darajani ochish uchun 3-darajani 90% bilan yakunlang' },
  lockedButton: { en: 'LOCKED - SCORE 90% ON PREVIOUS LEVEL', ru: 'ЗАБЛОКИРОВАНО - НАБЕРИТЕ 90% НА ПРЕДЫДУЩЕМ У��О��НЕ', uz: 'BLOKLANGAN - OLDINGI DARAJADA 90% BALL TO\'PLAN' },
  yourScore: { en: 'Your Score', ru: 'Ваш балл', uz: 'Sizning ballingiz' },
  startLevel1: { en: 'Start Level 1', ru: 'Начать уровень 1', uz: '1-darajani boshlash' },
  startLevel2: { en: 'Start Level 2', ru: 'Начать уровень 2', uz: '2-darajani boshlash' },
  startLevel3: { en: 'Start Level 3', ru: 'Начать уровень 3', uz: '3-darajani boshlash' },
  startLevel4: { en: 'Start Level 4', ru: 'Начать уровень 4', uz: '4-darajani boshlash' },
  completed: { en: 'Completed', ru: 'Пройдено', uz: 'Yakunlandi' },
  safetyBasics: { en: 'Safety BASICs', ru: 'Основы безопасности', uz: 'Xavfsizlik asoslari' },
  eld: { en: 'Electronic Logging Device (ELD)', ru: 'Электронное устройство регистрации (ELD)', uz: 'Elektron jurnal qurilmasi (ELD)' },
  fleetManagement: { en: 'Fleet Management', ru: 'Управление автопарком', uz: 'Parkni boshqarish' },
  csaPoints: { en: 'CSA Points', ru: 'Баллы CSA', uz: 'CSA ballari' },
  mapTimeZones: { en: 'Map & Time Zones', ru: 'Карта и часовые пояса', uz: 'Xarita va vaqt zonalari' },
  dispatcherTools: { en: 'Dispatcher Tools', ru: 'Инструменты диспетчера', uz: 'Dispetcher asboblari' },
  truckTypes: { en: 'Truck Types', ru: 'Типы грузовиков', uz: 'Yuk mashinalari turlari' },
  mappingGame: { en: 'Mapping Game', ru: 'Игра по картографии', uz: 'Xaritalash o\'yini' },
  typingGame: { en: 'Typing Game', ru: 'Игра по набору текста', uz: 'Yozish o\'yini' },
  accounting: { en: 'Accounting', ru: 'Бухгалтерия', uz: 'Buxgalteriya' },
  driverHiring: { en: 'Driver Hiring', ru: 'Найм водителей', uz: 'Haydovchilarni yollash' },
  update: { en: 'Update', ru: 'Обновление', uz: 'Yangilanish' },
  dispatch: { en: 'Dispatch', ru: 'Диспетчеризация', uz: 'Dispetcherlik' },
  accountingDesc: {
    en: 'Accounting in the logistics industry is a specialized field that goes far beyond basic bookkeeping. It involves the meticulous tracking, analysis, and management of all financial transactions associated with the movement of freight from origin to destination. Key aspects include:\n\n• Freight Billing & Invoicing: Accurately calculating charges based on weight, distance, and specialized services (accessorials).\n• Freight Auditing: A critical process of verifying carrier invoices against agreed-upon rates and contracts to prevent overpayment.\n• Accounts Payable & Receivable: Managing the delicate balance of paying carriers and vendors while ensuring timely collection from shippers.\n• Financial Reporting & KPIs: Analyzing metrics like Operating Ratio, Revenue per Mile, and Fuel Surcharge recovery to measure business health.\n• Regulatory Compliance: Handling complex tax requirements such as IFTA (International Fuel Tax Agreement) and local transportation taxes.\n\nEffective logistics accounting is the backbone of a profitable operation, providing the transparency needed to optimize costs and manage cash flow in a high-volume, low-margin environment.',
    ru: 'Бухгалтерский учет в логистической отрасли — это специализированная область, которая выходит далеко за рамки простого ведения бухгалтерии. Он включает в себя тщательное отслеживание, анализ и управление всеми финансовыми потоками, связанными с перемещением грузов от пункта отправления до пункта назначения. Ключевые аспекты включают:\n\n• Выставление счетов за фрахт: Точный расчет сборов на основе веса, расстояния и специализированных услуг.\n• Аудит фрахта: Критически важный процесс проверки счетов перевозчиков на соответствие согласованным тарифам и контрактам для предотвращения переплат.\n• Дебиторская и кредиторская задолженность: Управление тонким балансом оплаты перевозчикам и поставщикам при обеспечении своевременного получения средств от отправителей.\n• Финансовая отчетность и KPI: Анализ таких показателей, как операционный коэффициент, доход на милю и возмещение топливных надбавок для оценки состояния бизнеса.\n• Соблюдение нормативных требований: Обработка сложных налоговых требований, таких как IFTA (Международное соглашение о налоге на топливо) и местные транспортные налоги.\n\nЭффективный логистический учет является основой прибыльной деятельности, обеспечивая прозрачность, необходимую для оптимизации затрат и управления денежными потоками в условиях больших объемов и низкой маржи.',
    uz: 'Logistika sohasida buxgalteriya hisobi oddiy buxgalteriya hisobidan ancha yuqori bo\'lgan ixtisoslashgan sohadir. U yuklarni kelib chiqish joyidan belgilangan joyga ko\'chirish bilan bog\'liq barcha moliyaviy operatsiyalarni kuzatish, tahlil qilish va boshqarishni o\'z ichiga oladi. Asosiy jihatlarga quyidagilar kiradi:\n\n• Yuklar uchun hisob-faktura: Vazn, masofa va ixtisoslashtirilgan xizmatlar asosida to\'lovlarni aniq hisoblash.\n• Yuk auditi: To\'lovlarni ortiqcha to\'lashning oldini olish uchun tashuvchi hisob-fakturalarini kelishilgan stavkalar va shartnomalar bilan solishtirishning muhim jarayoni.\n• Debitorlik va kreditorlik qarzlari: Yuk jo\'natuvchilardan o\'z vaqtida to\'lovlarni yig\'ishni ta\'minlagan holda tashuvchilar va yetkazib beruvchilarga to\'lovlarni amalga oshirishning nozik muvozanatini boshqarish.\n• Moliyaviy hisobot va KPI: Biznes holatini o\'lchash uchun Operatsion koeffitsient, har bir mil uchun daromad va yoqilg\'i qo\'shimcha to\'lovlarini qoplash kabi ko\'rsatkichlarni tahlil qilish.\n• Normativ muvofiqlik: IFTA (Xalqaro yoqilg\'i solig\'i to\'g\'risidagi bitim) va mahalliy transport soliqlari kabi murakkab soliq talablarini bajarish.\n\nSamarali logistika hisobi foydali operatsiyaning asosi bo\'lib, yuqori hajmli va past marjali muhitda xarajatlarni optimallashtirish va pul oqimlarini boshqarish uchun zarur bo\'lgan shaffoflikni ta\'minlaydi.'
  },
  driverHiringDesc: {
    en: 'Hiring qualified drivers is perhaps the most significant challenge and responsibility for a motor carrier. A rigorous, multi-step process is essential to ensure safety, compliance, and operational reliability:\n\n1. Comprehensive Application: Collecting detailed work history, including all commercial driving experience for the past 10 years.\n2. MVR & PSP Reports: Reviewing Motor Vehicle Records for violations and Pre-Employment Screening Program data for roadside inspection history.\n3. Background Checks: Conducting criminal background checks and verifying previous employment as required by FMCSA regulations.\n4. Drug & Alcohol Clearinghouse: Querying the federal database to ensure the driver has no unresolved violations or "prohibited" status.\n5. Physical Examination: Ensuring the driver holds a valid Medical Examiner\'s Certificate (Med Card) from a registered professional.\n6. Road Test: A practical evaluation of the driver\'s ability to safely operate the specific equipment they will be assigned.\n7. Orientation & Training: Educating new hires on company safety policies, ELD usage, and specialized equipment handling.\n\nInvesting in a thorough hiring process reduces turnover, lowers insurance premiums, and protects the company\'s safety rating (CSA scores).',
    ru: 'Найм квалифицированных водителей — это, пожалуй, самая серьезная проблема и ответственность для автоперевозчика. Тщательный многоэтапный процесс необходим для обеспечения безопасности, соблюдения требований и операционной надежности:\n\n1. Комплексная заявка: Сбор подробной истории работы, включая весь опыт коммерческого вождения за последние 10 лет.\n2. Отчеты MVR и PSP: Просмотр записей о транспортных средствах на предмет нарушений и данных программы предэксплуатационного скрининга для истории дорожных проверок.\n3. Проверка биографических данных: Проведение проверок на наличие судимостей и подтверждение предыдущего места работы в соответствии с правилами FMCSA.\n4. Информационный центр по наркотикам и алкоголю: Запрос в федеральную базу данных, чтобы убедиться, что у водителя нет нерешенных нарушений или статуса «запрещено».\n5. Физический осмотр: Убедиться, что у водителя есть действующий сертификат медицинского эксперта (Med Card) от зарегистрированного специалиста.\n6. Дорожные испытания: Практическая оценка способности водителя безопасно управлять конкретным оборудованием, которое ему будет поручено.\n7. Ориентация и обучение: Обучение новых сотрудников политике безопасности компании, использованию ELD и обращению со специальным оборудованием.\n\nИнвестиции в тщательный процесс найма снижают текучесть кадров, уменьшают страховые взносы и защищают рейтинг безопасности компании (баллы CSA).',
    uz: 'Malakali haydovchilarni yollash, ehtimol, avtotashuvchi uchun eng katta muammo va mas\'uliyatdir. Xavfsizlik, muvofiqlik va operatsion ishonchlilikni ta\'minlash uchun qat\'iy, ko\'p bosqichli jarayon zarur:\n\n1. Keng qamrovli ariza: Oxirgi 10 yildagi barcha tijorat haydovchilik tajribasini o\'z ichiga olgan batafsil ish tarixini to\'plash.\n2. MVR va PSP hisobotlari: Qoidabuzarliklar uchun avtotransport vositalari yozuvlarini va yo\'l bo\'yidagi tekshiruvlar tarixi uchun ishga joylashishdan oldin skrining dasturi ma\'lumotlarini ko\'rib chiqish.\n3. Fon tekshiruvi: Sudlanganlikni tekshirish va FMCSA qoidalariga muvofiq oldingi ish joyini tasdiqlash.\n4. Giyovand moddalar va alkogol ma\'lumotlar markazi: Haydovchida hal qilinmagan qoidabuzarliklar yoki "taqiqlangan" maqomi yo\'qligiga ishonch hosil qilish uchun federal ma\'lumotlar bazasiga so\'rov yuborish.\n5. Tibbiy ko\'rik: Haydovchining ro\'yxatdan o\'tgan mutaxassisdan olingan amaldagi Tibbiy ekspert sertifikatiga (Med Card) ega ekanligiga ishonch hosil qilish.\n6. Yo\'l sinovi: Haydovchining o\'ziga yuklatilgan maxsus uskunani xavfsiz boshqarish qobiliyatini amaliy baholash.\n7. Yo\'nalish va trening: Yangi xodimlarga kompaniya xavfsizlik siyosati, ELDdan foydalanish va maxsus uskunalar bilan ishlash bo\'yicha ta\'lim berish.\n\nPuxta yollash jarayoniga sarmoya kiritish kadrlar almashinuvini kamaytiradi, sug\'urta mukofotlarini pasaytiradi va kompaniyaning xavfsizlik reytingini (CSA ballari) himoya qiladi.'
  },
  updateFieldDesc: {
    en: 'In the fast-paced world of logistics, information is just as important as the physical cargo. The "Update" function is the heartbeat of supply chain visibility, providing critical data points throughout the lifecycle of a shipment:\n\n• Real-Time Tracking: Utilizing GPS and ELD data to provide precise location coordinates of the vehicle.\n• Status Milestones: Automated or manual notifications for key events like "Arrived at Shipper," "Loaded," "In Transit," and "Delivered."\n• ETA Management: Constantly recalculating the Estimated Time of Arrival based on traffic, weather, and driver hours of service.\n• Exception Reporting: Immediate notification of delays, breakdowns, or accidents, allowing for proactive contingency planning.\n• Documentation: Digital updates often include the uploading of Bill of Lading (BOL) or Proof of Delivery (POD) documents.\n\nConsistent and accurate updates build trust with customers, reduce "where is my truck" inquiries, and allow for better planning at both the shipping and receiving docks.',
    ru: 'В быстро меняющемся мире логистики информация так же важна, как и сам груз. Функция «Обновление» — это сердце прозрачности цепочки поставок, предоставляющая критически важные данные на протяжении всего жизненного цикла груза:\n\n• Отслеживание в реальном времени: Использование данных GPS и ELD для предоставления точных координат местоположения транспортного средства.\n• Статусные вехи: Автоматические или ручные уведомления о ключевых событиях, таких как «Прибыл к отправителю», «Загружен», «В пути» и «Доставлен».\n• Управление ETA: Постоянный пересчет расчетного времени прибытия ����а основе трафика, погоды и часов работы водителя.\n• Отчетность об исключениях: Немедленное уведомление о задержках, поломках или авариях, что позволяет заблаговременно планировать действия в чрезвычайных ситуациях.\n��� ������оку��ентация: Цифровые обновления часто включают загрузку коносамента (BOL) или подтверждения доставки (POD).\n\nПоследовательные и точные обновления укрепляют доверие клиентов, сокращают количество запросов «где мой грузовик» и позволяют лучше планировать работу как на погрузочных, так и на разгрузочных платформах.',
    uz: 'Logistikaning shiddatli dunyosida ma\'lumot jismoniy yuk kabi muhimdir. "Yangilanish" funktsiyasi ta\'minot zanjiri ko\'rinishining yuragi bo\'lib, yukning butun hayot aylanishi davomida muhim ma\'lumot nuqtalarini taqdim etadi:\n\n• Haqiqiy vaqtda kuzatish: Transport vositasining aniq joylashuv koordinatalarini taqdim etish uchun GPS va ELD ma\'lumotlaridan foydalanish.\n• Holat bosqichlari: "Yuk jo\'natuvchiga yetib keldi", "Yuklandi", "Tranzitda" va "Yetkazib berildi" kabi asosiy voqealar uchun avtomatlashtirilgan yoki qo\'lda bildirishnomalar.\n• ETA boshqaruvi: Trafik, ob-havo va haydovchining ish soatlari asosida taxminiy yetib kelish vaqtini (ETA) doimiy ravishda qayta hisoblash.\n• Istisno hisoboti: Kechikishlar, buzilishlar yoki baxtsiz hodisalar haqida darhol xabar berish, bu esa faol favqulodda rejalashtirish imkonini beradi.\n• Hujjatlashtirish: Raqamli yangilanishlar ko\'pincha yuk xati (BOL) yoki yetkazib berishni tasdiqlovchi hujjatlarni (POD) yuklashni o\'z ichiga oladi.\n\nDoimiy va aniq yangilanishlar mijozlar bilan ishonchni mustahkamlaydi, "yuk mashinam qayerda" degan so\'rovlarni kamaytiradi va yuk ortish hamda qabul qilish joylarida yaxshiroq rejalashtirish imkonini beradi.'
  },
  dispatchFieldDesc: {
    en: 'Dispatch is the nerve center of any trucking operation. It is the complex task of orchestrating the movement of assets and drivers to meet customer demands while maximizing efficiency. A professional dispatch operation covers:\n\n• Load Matching: Analyzing available freight and matching it with the right equipment and driver based on location and remaining hours of service.\n• Route Optimization: Planning the most efficient paths to minimize deadhead miles (empty miles) and reduce fuel consumption.\n• Driver Coordination: Maintaining constant communication with drivers to provide instructions, handle issues, and ensure safety compliance.\n• Customer Liaison: Serving as the primary point of contact for shippers and brokers, providing updates and resolving service issues.\n• Performance Monitoring: Tracking on-time pickup and delivery percentages to ensure service level agreements (SLAs) are met.\n\nEffective dispatching requires a unique blend of analytical thinking, geographical knowledge, and high-pressure communication skills to keep the fleet moving profitably.',
    ru: 'Диспетчеризация — это нервный центр любой автотранспортной операции. Это сложная задача по организации перемещения активов и водителей для удовлетворения требований клиентов при максимальной эффективности. Профессиональная диспетчерская деятельность охватывает:\n\n• Подбор грузов: Анализ доступных грузов и их сопоставление с подходящим оборудованием и водителем на основе местоположения и оставшихся часов работы.\n• Оптимизация маршрутов: Планирование наиболее эффективных путей для минимизации порожнего пробега (пустых миль) и снижения расхода топлива.\n• Координация водителей: Поддержание постоянной связи с водителями для предоставления инструкций, решения проблем и обеспечения соблюдения требований безопасности.\n• Связь с клиентами: Выполнение роли основного контактного лица для отправителей и брокеров, предоставление обновлений и решение проблем с обслуживанием.\n• Мониторинг эффективности: Отслеживание процента своевременного забора и доставки грузов для обеспечения соблюдения соглашений об уровне обслуживания (SLA).\n\nЭффективная диспетчеризация требует уникального сочетания аналитического мышления, географических знаний и навыков общения в условиях высокого давления, чтобы автопарк работал прибыльно.',
    uz: 'Dispetcherlik har qanday yuk tashish operatsiyasining asab markazidir. Bu samaradorlikni maksimal darajada oshirish bilan birga mijozlar talablarini qondirish uchun aktivlar va haydovchilar harakatini muvofiqlashtirishning murakkab vazifasidir. Professional dispetcherlik operatsiyasi quyidagilarni qamrab oladi:\n\n• Yuklarni moslashtirish: Mavjud yuklarni tahlil qilish va ularni joylashuvi hamda qolgan ish soatlari asosida to\'g\'ri uskuna va haydovchi bilan moslashtirish.\n• Yo\'nalishni optimallashtirish: Bo\'sh yurishni (bo\'sh millarni) minimallashtirish va yoqilg\'i sarfini kamaytirish uchun eng samarali yo\'llarni rejalashtirish.\n• Haydovchilarni muvofiqlashtirish: Ko\'rsatmalar berish, muammolarni hal qilish va xavfsizlikka rioya qilishni ta\'minlash uchun haydovchilar bilan doimiy aloqada bo\'lish.\n• Mijozlar bilan aloqa: Yuk jo\'natuvchilar va brokerlar uchun asosiy aloqa nuqtasi bo\'lib xizmat qilish, yangilanishlarni taqdim etish va xizmat ko\'rsatish muammolarini hal qilish.\n• Unumdorlik monitoringi: Xizmat ko\'rsatish darajasi to\'g\'risidagi bitimlar (SLA) bajarilishini ta\'minlash uchun o\'z vaqtida yuk olish va yetkazib berish foizlarini kuzatish.\n\nSamarali dispetcherlik parkning foyda bilan harakatlanishini ta\'minlash uchun tahliliy fikrlash, geografik bilim va yuqori bosim ostida muloqot qilish qobiliyatlarining noyob uyg\'unligini talab qiladi.'
  },
  next: { en: 'Next', ru: 'Далее', uz: 'Keyingi' },
  previous: { en: 'Previous', ru: 'Назад', uz: 'Oldingi' },
  finish: { en: 'Finish', ru: 'Завершить', uz: 'Tugatish' },
  question: { en: 'Question', ru: 'Вопрос', uz: 'Savol' },
  of: { en: 'of', ru: 'из', uz: 'dan' },
  correct: { en: 'Correct!', ru: 'Верно!', uz: 'To\'g\'ri!' },
  incorrect: { en: 'Incorrect', ru: 'Неверно', uz: 'Noto\'g\'ri' },
  testResults: { en: 'Test Results', ru: 'Результаты теста', uz: 'Test natijalari' },
  score: { en: 'Score', ru: 'Балл', uz: 'Ball' },
  tryAgain: { en: 'Try Again', ru: 'Попробовать снова', uz: 'Yana urinib ko\'ring' },
  backToLevels: { en: 'Back to Levels', ru: 'Назад к уровням', uz: 'Darajalarga qaytish' },
  congratulations: { en: 'Congratulations!', ru: 'Поздравляем!', uz: 'Tabriklaymiz!' },
  keepLearning: { en: 'Keep learning to unlock the next level.', ru: 'Продолжайт�� учиться, что��ы ра��блокировать следующий уровень.', uz: 'Keyingi darajani ochish uchun o\'rganishda davom eting.' },
  safetyBasicsTitle: { en: 'Get Road Smart', ru: 'Будьте умнее на дороге', uz: 'Yo\'lda aqlli bo\'ling' },
  safetyBasicsSub: { 
    en: 'Understand the 7 Behavior Analysis and Safety Improvement Categories (BASICs) to ensure safety and compliance.', 
    ru: 'Поймите 7 категорий анализа поведения и повышения безопасности (BASIC), чтобы обеспечить безопасность и соблюдение нормативных требований.', 
    uz: 'Xavfsizlik va muvofiqlikni ta\'minlash uchun 7 ta xatti-harakatni tahlil qilish va xavfsizlikni yaxshilash toifalarini (BASIC) tushunib oling.' 
  },
  whatAreBasics: { en: 'What are the BASICs?', ru: 'Что такое BASIC?', uz: 'BASIC nima?' },
  basicsDefinition: {
    en: 'The Federal Motor Carrier Safety Administration (FMCSA) uses seven Behavior Analysis and Safety Improvement Categories—BASICs—to determine a motor carrier\'s safety performance and compliance relative to other carriers. Five BASICs are publicly available online in the Safety Measurement System (SMS). Crash Indicator and Hazardous Materials (HM) Compliance are only available to motor carriers that log into their own safety profile, or enforcement personnel.',
    ru: 'Федеральное управление безопасности автоперевозчиков (FMCSA) использует семь категорий анализа поведения и повышения безопасности — BASIC — для определения показателей безопасности и соответствия автоперевозчика требованиям по сравнению с другими перевозчиками. Пять BASIC доступны онлайн в Системе измерения безопасности (SMS). Индикатор аварийности и соблюдение требований по перевозке опасных грузов (HM) доступны только автоперевозчикам, которые входят в свой собственный профиль безопасности, или сотрудникам правоохранительных органов.',
    uz: 'Federal avtotashuvchilar xavfsizligi ma\'muriyati (FMCSA) avtotashuvchining xavfsizlik ko\'rsatkichlari va boshqa tashuvchilarga nisbatan muvofiqligini aniqlash uchun ettita xatti-harakatni tahlil qilish va xavfsizlikni yaxshilash toifalaridan — BASICdan foydalanadi. Beshta BASIC onlayn tarzda Xavfsizlikni o\'lchash tizimida (SMS) ochiq holda mavjud. To\'qnashuv indikatori va xavfli materiallar (HM) muvofiqligi faqat o\'zlarining xavfsizlik profiliga kirgan avtotashuvchilar yoki huquqni muhofaza qilish organlari xodimlari uchun mavjud.'
  },
  unsafeDriving: { en: 'Unsafe Driving', ru: 'Небезопасное вождение', uz: 'Xavfli haydash' },
  unsafeDrivingDesc: { en: 'Follow traffic safety laws to help make the Nation\'s highways safer for everyone.', ru: 'Соблюдайте правила дорожного движения, чтобы сделать автомагистрали страны безопаснее для всех.', uz: 'Mamlakat magistrallarini hamma uchun xavfsizroq qilishga yordam berish uchun yo\'l harakati xavfsizligi qoidalariga rioya qiling.' },
  crashIndicator: { en: 'Crash Indicator', ru: 'Индикатор аварийности', uz: 'To\'qnashuv indikatori' },
  crashIndicatorDesc: { en: 'Understand crash patterns to help identify and address safety problems.', ru: 'Понимайте закономерности аварий, чтобы помочь выявить и решить проблемы безопасности.', uz: 'Xavfsizlik muammolarini aniqlash va hal qilishga yordam berish uchun to\'qnashuv naqshlarini tushunib oling.' },
  hosCompliance: { en: 'HOS Compliance', ru: 'Соблюдение HOS', uz: 'HOS muvofiqligi' },
  hosComplianceDesc: { en: 'Be sure you know the HOS regulations and when it\'s time for a break. Don\'t drive fatigued.', ru: 'Убедитесь, что вы знаете правила HOS и когда пора сделать перерыв. Не водите в состоянии усталости.', uz: 'HOS qoidalarini va qachon tanaffus qilish vaqti kelganini bilishingizga ishonch hosil qiling. Charchagan holda haydamang.' },
  vehicleMaintenance: { en: 'Vehicle Maintenance', ru: 'Техническое обслуживание', uz: 'Texnik xizmat ko\'rsatish' },
  vehicleMaintenanceDesc: { en: 'Keep your vehicle properly maintained to ensure your safety and the safety of others.', ru: 'Поддерживайте свой автомобиль в надлежащем состоянии, чтобы обеспечить свою безопасность и безопасность окружающих.', uz: 'O\'zingiz va boshqalarning xavfsizligini ta\'minlash uchun transport vositangizni to\'g\'ri saqlang.' },
  substancesAlcohol: { en: 'Controlled Substances/Alcohol', ru: 'Контролируемые вещества/Алкоголь', uz: 'Nazorat qilinadigan moddalar/Alkogol' },
  substancesAlcoholDesc: { en: 'Don\'t misuse drugs or alcohol while driving; it\'s dangerous and illegal.', ru: 'Не злоупотребляйте наркотиками или алкоголем во время вождения; это опасно и незаконно.', uz: 'Haydash paytida giyohvand moddalar yoki alkogoldan noto\'g\'ri foydanmang; bu xavfli va noqonuniy.' },
  driverFitness: { en: 'Driver Fitness', ru: 'Пригодность водителя', uz: 'Haydovchining yaroqliligi' },
  driverFitnessDesc: { en: 'Keep your driving records complete and up to date to help your company perform well.', ru: 'Ведите свои записи о вождении в полном объеме и обновляйте их, чтобы помочь вашей компании работать хорошо.', uz: 'Kompaniyangizga yaxshi natijalarga erishishda yordam berish uchun haydovchilik yozuvlaringizni to\'liq va dolzarb holda saqlang.' },
  hmCompliance: { en: 'HM Compliance', ru: 'Соблюдение HM', uz: 'HM muvofiqligi' },
  hmComplianceDesc: { en: 'Take special care when transporting HM to help make the Nation\'s highways safer.', ru: 'Соблюдайте особую осторожность при транспортировке опасных грузов, чтобы сделать автомагистрали страны безопаснее.', uz: 'Mamlakat magistrallarini xavfsizroq qilishga yordam berish uchun xavfli materiallarni tashishda alohida ehtiyot bo\'ling.' },
  hosComplianceTitle: { en: 'Hours of Service (HOS) Compliance', ru: 'Соблюдение режима труда и отдыха (HOS)', uz: 'Xizmat soatlari (HOS) muvofiqligi' },
  hosComplianceSub: { en: 'Critical regulations governing commercial driving hours to prevent fatigue-related accidents.', ru: 'Критически важные правила, регулирующие часы коммерческого вождения для предотвращения аварий, связанных с усталостью.', uz: 'Charchoq bilan bog\'liq baxtsiz hodisalarning oldini olish uchun tijorat haydovchilik soatlarini tartibga soluvchi muhim qoidalar.' },
  hosRulesTitle: { en: 'Key HOS Rules', ru: 'Основные правила HOS', uz: 'Asosiy HOS qoidalari' },
  hosRulesDesc: { en: 'The FMCSA enforces strict limits on driving and working hours for commercial motor vehicle (CMV) drivers.', ru: 'FMCSA вводит строгие ограничения на часы вождения и работы для водителей коммерческих транспортных средств (CMV).', uz: 'FMCSA tijorat avtotransport vositalari (CMV) haydovchilari uchun haydash va ish soatlariga qat\'iy cheklovlar qo\'yadi.' },
  hosBestPracticesTitle: { en: 'HOS Best Practices', ru: 'Лучшие практики HOS', uz: 'HOS bo\'yicha eng yaxshi amaliyotlar' },
  hosBestPracticesDesc: { en: 'Strategies to maintain compliance and ensure driver safety.', ru: 'Стратегии по соблюдению требований и обеспечению безопасности водителей.', uz: 'Muvofiqlikni saqlash va haydovchilar xavfsizligini ta\'minlash strategiyalari.' },
  fmcsaLinksTitle: { en: 'Official FMCSA Resources', ru: 'Официальные ресурсы FMCSA', uz: 'Rasmiy FMCSA resurslari' },
  fmcsaLinksDesc: { en: 'Access the latest regulations and guidance directly from the source.', ru: 'Получите доступ к последним правилам и рекомендациям непосредственно из первоисточника.', uz: 'Eng so\'nggi qoidalar va ko\'rsatmalarga bevosita manbadan kiring.' },
  hosRule1: { en: '11-Hour Driving Limit: May drive a maximum of 11 hours after 10 consecutive hours off duty.', ru: '11-часовой лимит вождения: Можно управлять автомобилем максимум 11 часов после 10 часов отдыха подряд.', uz: '11 soatlik haydash chegarasi: 10 soatlik ketma-ket dam olishdan keyin maksimal 11 soat haydash mumkin.' },
  hosRule2: { en: '14-Hour Limit: May not drive beyond the 14th consecutive hour after coming on duty.', ru: '14-часовой лимит: Нельзя управлять автомобилем после 14-го часа подряд после выхода на смену.', uz: '14 soatlik chegara: Ishga kirishgandan keyin ketma-ket 14-soatdan keyin haydash mumkin emas.' },
  hosRule3: { en: '30-Minute Break: Drivers must take a 30-minute break after 8 cumulative hours of driving.', ru: '30-минутный перерыв: Водители должны сделать 30-минутный перерыв после 8 часов вождения в совокупности.', uz: '30 daqiqalik tanaffus: Haydovchilar jami 8 soatlik haydashdan keyin 30 daqiqalik tanaffus olishlari kerak.' },
  hosRule4: { en: '60/70-Hour Limit: May not drive after 60/70 hours on duty in 7/8 consecutive days.', ru: '60/70-часовой лимит: Нельзя управлять автомобилем после 60/70 часов работы за 7/8 дней подряд.', uz: '60/70 soatlik chegara: Ketma-ket 7/8 kun ichida 60/70 soat ishdan keyin haydash mumkin emas.' },
  hosPractice1: { en: 'Pre-Trip Planning: Always map out your route and potential rest stops before starting.', ru: 'Предварительное планирование поездки: Всегда планируйте свой маршрут и возможные остановки для отдыха перед началом.', uz: 'Sayohatdan oldin rejalashtirish: Boshlashdan oldin har doim yo\'nalishingizni va potentsial dam olish joylarini belgilab oling.' },
  hosPractice2: { en: 'Monitor Clocks: Regularly check your ELD clocks to avoid accidental violations.', ru: 'Мониторинг часов: Регулярно проверяйте свои часы ELD, чтобы избежать случайных нарушений.', uz: 'Soatlarni kuzatib boring: Tasodifiy qoidabuzarliklarning oldini olish uchun ELD soatlaringizni muntazam tekshirib turing.' },
  hosPractice3: { en: 'Clear Communication: Notify dispatch immediately if delays threaten your HOS limits.', ru: 'Четкая связь: Немедленно уведомляйте диспетчера, если задержки угрожают вашим лимитам HOS.', uz: 'Aniq muloqot: Agar kechikishlar HOS cheklovlaringizga tahdid solsa, darhol dispetcherga xabar bering.' },
  hosPractice4: { en: 'Accurate Logging: Ensure all duty status changes are recorded in real-time.', ru: 'Точное ведение журнала: Убедитесь, что все изменения статуса дежурства записываются в режиме реального времени.', uz: 'Aniq jurnalga yozish: Barcha ish holati o\'zgarishlari real vaqt rejimida qayd etilishini ta\'minlang.' },
  notPublic: { en: 'Not Public', ru: 'Не публично', uz: 'Ommaviy emas' },
  federalRegulations: { en: 'Federal Regulations', ru: 'Федеральные правила', uz: 'Federal qoidalar' },
  eldTitle: { en: 'Electronic Logging Devices (ELD)', ru: 'Электронные устройства регистрации (ELD)', uz: 'Elektron jurnal qurilmasi (ELD)' },
  eldSub: { en: 'Understand the federally mandated electronic system for accurate Hours of Service tracking and compliance.', ru: 'Поймите федерально предписанную электронную систему для точного отслеживания часов работы и соблюдения требований.', uz: 'Xizmat ko\'rsatish soatlarini aniq kuzatish va muvofiqlikni ta\'minlash uchun federal mandatli elektron tizimni tushunib oling.' },
  eldOverview: { en: 'ELD Overview', ru: 'Обзор ELD', uz: 'ELD sharhi' },
  eldOverviewDesc: { en: 'The primary purpose of an ELD is to improve road safety, reduce driver fatigue, and ensure accurate tracking of driving time. By automating HOS tracking, ELDs enhance safety, reduce paperwork, and promote accountability across the transportation industry.', ru: 'Основная цель ELD — повысить безопасность дорожного движения, снизить утомляемость водителей и обеспечить точное отслеживание времени вождения. Автоматизируя отслеживание HOS, ELD повышают безопасность, сокращают бумажную работу и способствуют подотчетности в транспортной отрасли.', uz: 'ELDning asosiy maqsadi yo\'l harakati xavfsizligini yaxshilash, haydovchilar charchoqini kamaytirish va haydash vaqtini aniq kuzatishni ta\'minlashdir. HOS kuzatuvini avtomatlashtirish orqali ELDlar xavfsizlikni oshiradi, qog\'ozbozlikni kamaytiradi va transport sohasida javobgarlikni kuchaytiradi.' },
  eldHardwareUnit: { en: 'ELD Hardware Unit', ru: 'Аппаратный блок ELD', uz: 'ELD apparat bloki' },
  eldHardwareDesc: { en: 'PT30 device with QR code - physically connects to vehicle ECM via cable', ru: 'Устройство PT30 с QR-кодом - физически подключается к ЭБУ автомобиля через кабель', uz: 'QR-kodli PT30 qurilmasi - kabel orqali avtomobil ECM-ga jismoniy ulanadi' },
  eldSoftwareApp: { en: 'ELD Software Application', ru: 'Программное приложение ELD', uz: 'ELD dasturiy ilovasi' },
  eldSoftwareDesc: { en: 'Mobile/tablet dashboard for real-time duty status tracking and HOS monitoring', ru: 'Панель управления для мобильных устройств/планшетов для отслеживания статуса дежурства и мониторинга HOS в реальном времени', uz: 'Haqiqiy vaqtda navbatchilik holatini kuzatish va HOS monitoringi uchun mobil/planshet paneli' },
  whatIsEld: { en: 'What is an ELD?', ru: 'Что такое ELD?', uz: 'ELD nima?' },
  whatIsEldSub: { en: 'Electronic logging device that replaces paper logbooks', ru: 'Электронное устройство регистрации, заменяющее бумажные журналы', uz: 'Qog\'oz jurnallarni almashtiradigan elektron qayd qurilmasi' },
  howEldsWork: { en: 'How ELDs Work', ru: 'Как работают ELD', uz: 'ELDlar qanday ishlaydi' },
  howEldsWorkSub: { en: 'Automatic recording and data synchronization', ru: 'Автоматическая запись и синхронизация данных', uz: 'Avtomatik yozib olish va ma\'lumotlarni sinxronlashtirish' },
  keyFeaturesTitle: { en: 'Key Features', ru: 'Ключев��е особенности', uz: 'Asosiy xususiyatlar' },
  keyFeaturesSub: { en: 'Essential ELD components and capabilities', ru: 'Основные компоненты и возможности ELD', uz: 'ELDning muhim komponentlari va imkoniyatlari' },
  regulatoryReqs: { en: 'Regulatory Requirements', ru: 'Нормативные требования', uz: 'Normativ talablar' },
  regulatoryReqsSub: { en: 'FMCSA mandate and compliance details', ru: 'Мандат FMCSA и детали соблюдения', uz: 'FMCSA mandati va muvofiqlik tafsilotlari' },
  benefitsTitle: { en: 'Benefits', ru: 'Преимущества', uz: 'Foydali jihatlari' },
  benefitsSub: { en: 'Safety, operational, and compliance advantages', ru: 'Преимущества в области безопасности, эксплуатации и соблюдения требований', uz: 'Xavfsizlik, operatsion va muvofiqlik afzalliklari' },
  exemptionsTitle: { en: 'Exemptions', ru: 'Исключения', uz: 'Istisnolar' },
  exemptionsSub: { en: 'Who may not need an ELD', ru: 'Кому может не понадобиться ELD', uz: 'Kimga ELD kerak bo\'lmasligi mumkin' },
  driverCarrierResp: { en: 'Driver & Carrier Responsibilities', ru: 'Обязанности водителя и перевозчика', uz: 'Haydovchi va tashuvchining majburiyatlari' },
  driverResp: { en: 'Driver Responsibilities', ru: 'Обязанности водителя', uz: 'Haydovchining majburiyatlari' },
  carrierResp: { en: 'Carrier Responsibilities', ru: 'Обязанности перевозчика', uz: 'Tashuvchining majburiyatlari' },
  dataTransferCompliance: { en: 'Data Transfer & Compliance', ru: 'Передача данных и соблюдение требований', uz: 'Ma\'lumotlarni uzatish va muvofiqlik' },
  dataTransferDesc: { en: 'During roadside inspections, drivers must be able to transfer ELD data to enforcement officers upon request. ELD records must be accurate, uneditable for driving time, and retained by the motor carrier for at least 6 months.', ru: 'Во время придорожных проверок водители должны иметь возможность передать данные ELD сотрудникам правоохранительных органов по запросу. Записи ELD должны быть точными, не подлежащими редактированию в отношении времени вождения и храниться автоперевозчиком не менее 6 месяцев.', uz: 'Yo\'l bo\'yidagi tekshiruvlar paytida haydovchilar so\'rov bo\'yicha ELD ma\'lumotlarini huquqni muhofaza qilish organlari xodimlariga o\'tkazishlari kerak. ELD yozuvlari aniq bo\'lishi, haydash vaqti uchun tahrirlanmasligi va avtotashuvchi tomonidan kamida 6 oy davomida saqlanishi kerak.' },
  eldWhatIsBullet1: { en: 'Automatically records driving time', ru: 'Автоматически записывает время вождения', uz: 'Haydash vaqtini avtomatik ravishda yozib oladi' },
  eldWhatIsBullet2: { en: 'Connects to vehicle engine control module (ECM)', ru: 'Подключается к модулю управления двигателем автомобиля (ECM)', uz: 'Avtomobil dvigatelini boshqarish moduliga (ECM) ulanadi' },
  eldWhatIsBullet3: { en: 'Tamper-resistant and accurate', ru: 'Защищено от несанкционированного доступа и точно', uz: 'Ruxsatsiz aralashishdan himoyalangan va aniq' },
  eldHowWorksBullet1: { en: 'Automatic recording and data synchronization', ru: 'Автоматическая запись и синхронизация данных', uz: 'Avtomatik yozib olish va ma\'lumotlarni sinxronlashtirish' },
  eldHowWorksBullet2: { en: 'Four duty status categories: Off Duty, Sleeper Berth, Driving (auto), On Duty (not Driving)', ru: 'Четыре категории статуса дежурства: Вне службы, Спальное место, Вождение (авто), На службе (не вождение)', uz: 'To\'rtta navbatchilik holati toifasi: Xizmatdan tashqari, Yotoq joyi, Haydash (avto), Xizmatda (haydamasdan)' },
  eldHowWorksBullet3: { en: 'Location tracking accurate within 1 mile while driving', ru: 'Отслеживание местоположения с точностью до 1 мили во время вождения', uz: 'Haydash paytida 1 mil ichida aniq joylashuvni kuzatish' },
  eldKeyFeaturesBullet1: { en: 'Engine synchronization - automatic recording of driving time', ru: 'Синхронизация двигателя - автоматическая запись времени вождения', uz: 'Dvigatel sinxronizatsiyasi - haydash vaqtini avtomatik yozib olish' },
  eldKeyFeaturesBullet2: { en: 'Driver identification - login credentials for each driver', ru: 'Идентификация водителя - учетные данные для входа для каждого водителя', uz: 'Haydovchini identifikatsiya qilish - har bir haydovchi uchun kirish ma\'lumotlari' },
  eldKeyFeaturesBullet3: { en: 'Vehicle identification - VIN and unit number', ru: 'Идентификация автомобиля - VIN и номер агрегата', uz: 'Avtomobilni identifikatsiya qilish - VIN va blok raqami' },
  eldRegulatoryBullet1: { en: 'Mandatory for most interstate commercial drivers', ru: 'Обязательно для большинства коммерческих водителей, осуществляющих перевозки между штатами', uz: 'Ko\'pgina shtatlararo tijorat haydovchilari uchun majburiy' },
  eldRegulatoryBullet2: { en: 'Applies to vehicles with GWR of 10,001 lbs or more', ru: 'Применяется к транспортным средствам с полной массой 10 001 фунт и более', uz: 'GWR 10,001 funt yoki undan ortiq bo\'lgan transport vositalariga tegishli' },
  eldRegulatoryBullet3: { en: 'Enforced under 49 CFR Part 395', ru: 'Применяется в соответствии с 49 CFR Part 395', uz: '49 CFR Part 395 bo\'yicha amalga oshiriladi' },
  eldBenefitsBullet1: { en: 'Reduces driver fatigue and promotes safer driving behavior', ru: 'Снижает утомляемость водителей и способствует более безопасному вождению', uz: 'Haydovchilar charchoqini kamaytiradi va xavfsizroq haydash xatti-harakatlarini rag\'batlantiradi' },
  eldBenefitsBullet2: { en: 'Eliminates paper logs and reduces administrative workload', ru: 'Исключает бумажные журналы и снижает административную нагрузку', uz: 'Qog\'oz jurnallarni yo\'q qiladi va ma\'muriy ish yukini kamaytiradi' },
  eldBenefitsBullet3: { en: 'Improves fleet visibility and planning', ru: 'Улучшает видимость автопарка и планирование', uz: 'Parkning ko\'rinishini va rejalashtirishni yaxshilaydi' },
  eldExemptionsBullet1: { en: 'Drivers using paper logs for no more than 8 days in 30-day period', ru: 'Водители, использующие бумажные журналы не более 8 дней в течение 30-дневного периода', uz: '30 kunlik muddat ichida 8 kundan ortiq bo\'lmagan qog\'oz jurnallardan foydalanadigan haydovchilar' },
  eldExemptionsBullet2: { en: 'Short-haul drivers operating within limited radius', ru: 'Водители, осуществляющие перевозки на короткие расстояния в ограниченном радиусе', uz: 'Cheklangan radiusda ishlaydigan qisqa masofali haydovchilar' },
  eldExemptionsBullet3: { en: 'Vehicles with engines manufactured before year 2000', ru: 'Транспортные средства с двигателями, выпущенными до 2000 года', uz: 'Dvigatellari 2000-yildan oldin ishlab chiqarilgan transport vositalari' },
  driverRespBullet1: { en: 'Log in to the ELD each day', ru: 'Входите в ELD каждый день', uz: 'Har kuni ELD-ga kiring' },
  driverRespBullet2: { en: 'Certify records at the end of each shift', ru: 'Заверяйте записи в конце каждой смены', uz: 'Har bir smena oxirida yozuvlarni tasdiqlang' },
  driverRespBullet3: { en: 'Report malfunctions immediately', ru: 'Немедленно сообщайте о неисправностях', uz: 'Nosozliklar haqida darhol xabar bering' },
  driverRespBullet4: { en: 'Carry user manuals in the vehicle', ru: 'Имейте руководства пользователя в автомобиле', uz: 'Avtomobilda foydalanuvchi qo\'llanmalarini olib yuring' },
  carrierRespBullet1: { en: 'Ensure ELD compliance', ru: 'Обеспечьте соблюдение требований ELD', uz: 'ELD muvofiqligini ta\'minlang' },
  carrierRespBullet2: { en: 'Maintain ELD records for 6 months', ru: 'Храните записи ELD в течение 6 месяцев', uz: 'ELD yozuvlarini 6 oy davomida saqlang' },
  carrierRespBullet3: { en: 'Provide driver training and support', ru: 'Обеспечьте обучение и поддержку водител��й', uz: 'Haydovchilarni o\'qitish va qo\'llab-quvvatlashni ta\'minlang' },
  carrierRespBullet4: { en: 'Monitor and correct HOS violations', ru: 'Контролируйте и исправляйте нарушения HOS', uz: 'HOS buzilishlarini kuzatib boring va tuzating' },
  fleetManagementTitle: { en: 'Fleet Management', ru: 'Управление автопарком', uz: 'Parkni boshqarish' },
  fleetManagementSub: { en: 'Master the systematic process of overseeing, coordinating, and optimizing your fleet operations for safety, compliance, and efficiency.', ru: 'Освойте систематический процесс надзора, координации и оптимизации операций вашего автопарка для обеспечения безопасности, соблюдения требований и эффективности.', uz: 'Xavfsizlik, muvofiqlik va samaradorlik uchun park operatsiyalarini nazorat qilish, muvofiqlashtirish va optimallashtirishning tizimli jarayonini o\'zlashtiring.' },
  whatIsFleetManagement: { en: 'What is Fleet Management?', ru: 'Что такое управление автопарком?', uz: 'Parkni boshqarish nima?' },
  fleetManagementDef: { en: 'Fleet management is the systematic process of overseeing, coordinating, and optimizing a group of vehicles (fleet) used by an organization to conduct its operations. The goal is to ensure that vehicles are safe, compliant, cost-effective, efficient, and available when needed, while minimizing operational risks and expenses.', ru: 'Управление автопарком — это систематический процесс надзора, координации и оптимизации группы транспортных средств (автопарка), используемых организацией для ведения своей деятельности. Цель состоит в том, чтобы обеспечить безопасность, соответствие требованиям, экономичность, эффективность и доступность транспортных средств в случае необходимости при минимизации операционных рисков и расходов.', uz: 'Parkni boshqarish - bu tashkilot tomonidan o\'z faoliyatini yuritish uchun foydaniladigan transport vositalari guruhini (parkni) nazorat qilish, muvofiqlashtirish va optimallashtirishning tizimli jarayonidir. Maqsad - operatsion xavf va xarajatlarni minimallashtirish bilan birga transport vositalarining xavfsiz, muvofiq, tejamkor, samarali va kerak bo\'lganda tayyor bo\'lishini ta\'minlashdir.' },
  fleetManagementApplies: { en: 'Fleet management applies to industries such as transportation, logistics, construction, utilities, emergency services, and government operations.', ru: 'Управление автопарком применяется в таких отраслях, как транспорт, логистика, строительство, коммунальные услуги, аварийно-спасательные службы и государственные операции.', uz: 'Parkni boshqarish transport, logistika, qurilish, kommunal xizmatlar, favqulodda xizmatlar va davlat operatsiyalari kabi sohalarda qo\'llaniladi.' },
  coreObjectives: { en: 'Core Objectives', ru: 'Основные цели', uz: 'Asosiy maqsadlar' },
  objSafety: { en: 'Ensuring driver and public safety', ru: 'Обеспечение безопасности водителей и населения', uz: 'Haydovchi va jamoat xavfsizligini ta\'minlash' },
  objCompliance: { en: 'Maintaining regulatory compliance', ru: 'Соблюдение нормативных требований', uz: 'Normativ muvofiqlikni saqlash' },
  objCosts: { en: 'Reducing operational and maintenance costs', ru: 'Снижение эксплуатационных расходов и затрат на обслуживание', uz: 'Operatsion va texnik xizmat ko\'rsatish xarajatlarini kamaytirish' },
  objUtilization: { en: 'Improving vehicle utilization and productivity', ru: 'Повышение коэффициента использования и производительности транспорта', uz: 'Transport vositalaridan foydalanish va unumdorlikni oshirish' },
  objLifeCycle: { en: 'Extending vehicle life cycles', ru: 'Продление жизненного цикла транспортных средств', uz: 'Transport vositalarining ishlash muddatini uzaytirish' },
  objFuel: { en: 'Enhancing fuel efficiency', ru: 'Повышение топливной эффективности', uz: 'Yoqilg\'i samaradorligini oshirish' },
  objData: { en: 'Supporting data-driven decision-making', ru: 'Поддержка принятия решений на основе данных', uz: 'Ma\'lumotlarga asoslangan qaror qabul qilishni qo\'llab-quvvatlash' },
  vehicleAcquisition: { en: 'Vehicle Acquisition & Lifecycle Management', ru: 'Приобретение транспорта и управление жизненным циклом', uz: 'Transport vositalarini sotib olish va hayot aylanishini boshqarish' },
  driverManagement: { en: 'Driver Management & Safety', ru: 'Управление водителями и безопасность', uz: 'Haydovchilarni boshqarish va xavfsizlik' },
  maintenanceAsset: { en: 'Maintenance & Asset Management', ru: 'Техническое обслуживание и управление активами', uz: 'Texnik xizmat ko\'rsatish va aktivlarni boshqarish' },
  fuelManagement: { en: 'Fuel Management', ru: 'Управление топливом', uz: 'Yoqilg\'ini boshqarish' },
  complianceRegulatory: { en: 'Compliance & Regulatory Management', ru: 'Соблюдение требований и нормативное управление', uz: 'Muvofiqlik va normativ boshqaruv' },
  telematicsTech: { en: 'Telematics & Technology Integration', ru: 'Телематика и технологическая интеграция', uz: 'Telematika va texnologik integratsiya' },
  routePlanning: { en: 'Route Planning & Dispatching', ru: 'Планирование маршрутов и диспетчеризация', uz: 'Yo\'nalishni rejalashtirish va dispetcherlik' },
  environmentalSustainability: { en: 'Environmental & Sustainability', ru: 'Экология и устойчивое развитие', uz: 'Atrof-muhit va barqarorlik' },
  fleetPerformance: { en: 'Fleet Performance Monitoring & Analytics', ru: 'Мониторинг и аналитика эффективности автопарка', uz: 'Park unumdorligini monitoring qilish va tahlil qilish' },
  fleetPerformanceDesc: { en: 'Data collected from vehicles and drivers is analyzed to measure KPIs, identify inefficiencies, detect patterns and trends, support strategic planning, and improve safety and compliance.', ru: 'Данные, собранные с транспортных средств и от водителей, анализируются для измерения KPI, выявления неэффективности, обнаружения закономерностей и тенденций, поддержки стратегического планирования и повышения безопасности и соблюдения требований.', uz: 'KPI ko\'rsatkichlarini o\'lchash, samarasizlikni aniqlash, naqsh va tendentsiyalarni aniqlash, strategik rejalashtirishni qo\'llab-quvvatlash hamda xavfsizlik va muvofiqlikni yaxshilash uchun transport vositalari va haydovchilardan to\'plangan ma\'lumotlar tahlil qilinadi.' },
  costPerMile: { en: 'Cost per Mile', ru: 'Стоимость мили', uz: 'Bir mil narxi' },
  costPerMileDesc: { en: 'Total operational costs divided by miles driven', ru: 'Общие эксплуатационные расходы, деленные на пройденные мили', uz: 'Umumiy operatsion xarajatlar bosib o\'tilgan millarga bo\'lingan' },
  fuelEfficiency: { en: 'Fuel Efficiency', ru: 'Топливная экономичность', uz: 'Yoqilg\'i samaradorligi' },
  fuelEfficiencyDesc: { en: 'Miles per gallon across the fleet', ru: 'Мили на галлон по всему автопарку', uz: 'Butun park bo\'ylab bir gallonga to\'g\'ri keladigan millar' },
  vehicleUtilization: { en: 'Vehicle Utilization Rate', ru: 'Коэффициент использования транспорта', uz: 'Transportdan foydalanish darajasi' },
  vehicleUtilizationDesc: { en: 'Percentage of available vehicle capacity used', ru: 'Процент используемой доступной мощности транспорта', uz: 'Mavjud transport quvvatidan foydalanish foizi' },
  maintenanceCostPerVehicle: { en: 'Maintenance Cost per Vehicle', ru: 'Стоимость обслуживания одного автомобиля', uz: 'Har bir transport vositasi uchun texnik xizmat ko\'rsatish narxi' },
  maintenanceCostPerVehicleDesc: { en: 'Average annual maintenance expenses', ru: 'Среднегодовые расходы на техническое обслуживание', uz: 'O\'rtacha yillik texnik xizmat ko\'rsatish xarajatlari' },
  driverSafetyScores: { en: 'Driver Safety Scores', ru: 'Показатели безопасности водителей', uz: 'Haydovchilar xavfsizligi ballari' },
  driverSafetyScoresDesc: { en: 'Performance metrics for driver safety compliance', ru: 'Метрики эффективности соблюдения безопасности водителями', uz: 'Haydovchilar xavfsizligi muvofiqligi uchun unumdorlik ko\'rsatkichlari' },
  onTimeDelivery: { en: 'On-Time Delivery Rate', ru: 'Процент своевременной доставки', uz: 'O\'z vaqtida yetkazib berish darajasi' },
  onTimeDeliveryDesc: { en: 'Percentage of deliveries completed on schedule', ru: 'Процент доставок, выполненных по графику', uz: 'Jadval bo\'yicha yakunlangan yetkazib berish foizi' },
  riskManagement: { en: 'Risk Management & Accident Handling', ru: 'Управление рисками и обработка аварий', uz: 'Xavfni boshqarish va baxtsiz hodisalarni ko\'rib chiqish' },
  riskManagementDesc: { en: 'Fleet management includes minimizing risks related to accidents and injuries, vehicle theft or misuse, equipment failure, and legal and insurance claims.', ru: 'Управление автопарком включает минимизацию рисков, связанных с авариями и травмами, кражей или нецелевым использованием транспорта, поломкой оборудования, а также юридическими и страховыми претензиями.', uz: 'Parkni boshqarish baxtsiz hodisalar va jarohatlar, transport vositalarini o\'g\'irlash yoki noto\'g\'ri foydalanish, uskunaning ishdan chiqishi hamda huquqiy va sug\'urta da\'volari bilan bog\'liq xavflarni minimallashtirishni o\'z ichiga oladi.' },
  roleFleetManager: { en: 'Role of the Fleet Manager', ru: 'Роль менеджера автопарка', uz: 'Park menejerining roli' },
  strategicPlanning: { en: 'Strategic planning and forecasting', ru: 'Стратегическое планирование и прогнозирование', uz: 'Strategik rejalashtirish va prognozlash' },
  dailyOperations: { en: 'Daily operations oversight', ru: 'Надзор за ежедневными операциями', uz: 'Kundalik operatsiyalarni nazorat qilish' },
  policyEnforcement: { en: 'Policy enforcement and compliance', ru: 'Обеспечение соблюдения политик и требований', uz: 'Siyosatni amalga oshirish va muvofiqlik' },
  vendorManagement: { en: 'Vendor management and negotiation', ru: 'Управление поставщиками и переговоры', uz: 'Sotuvchilarni boshqarish va muzokaralar' },
  performanceAnalysis: { en: 'Performance analysis and reporting', ru: 'Анализ эффективности и отчетность', uz: 'Samaradorlikni tahlil qilish va hisobot berish' },
  continuousImprovement: { en: 'Continuous improvement initiatives', ru: 'Инициативы по непрерывному совершенствованию', uz: 'Doimiy takomillashtirish tashabbuslari' },
  fleetConclusion: { en: 'Fleet management is a multidisciplinary function that integrates operations, safety, compliance, technology, and financial control. When managed effectively, it enhances safety, reduces costs, improves efficiency, and supports long-term organizational success. Fleet managers serve as the crucial link between drivers, management, vendors, and regulators—ensuring that all parties work together toward common operational goals.', ru: 'Управление автопарком — это междисциплинарная функция, объединяющая операции, безопасность, соблюдение требований, технологии и финансовый контроль. При эффективном управлении оно повышает безопасность, снижает затраты, повышает эффективность и поддерживает долгосрочн��й успех организации. Менеджеры автопарка служат важным связующим звеном между водителями, руководством, поставщиками и регулирующими органами, обеспечивая совместную работу всех сторон для достижения общих операционных целей.', uz: 'Parkni boshqarish - bu operatsiyalar, xavfsizlik, muvofiqlik, texnologiya va moliyaviy nazoratni birlashtirgan ko\'p tarmoqli funktsiyadir. Samarali boshqarilganda, u xavfsizlikni oshiradi, xarajatlarni kamaytiradi, samaradorlikni yaxshilaydi va tashkilotning uzoq muddatli muvaffaqiyatini qo\'llab-quvvatlaydi. Park menejerlari haydovchilar, rahbariyat, sotuvchilar va tartibga soluvchilar o\'rtasidagi muhim bo\'g\'in bo\'lib xizmat qiladi - barcha tomonlarning umumiy operatsion maqsadlar yo\'lida birgalikda ishlashini ta\'minlaydi.' },
  conclusion: { en: 'Conclusion', ru: 'Заключение', uz: 'Xulosa' },
};

const LanguageContext = createContext<{
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key,
});

// --- Components ---

const Navbar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const { lang, setLang, t } = useContext(LanguageContext);
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.lang-selector')) {
        setIsLangOpen(false);
      }
      if (!target.closest('.nav-dropdown')) {
        setActiveDropdown(null);
      }
      if (!target.closest('.profile-menu')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'ru', label: 'Русский', short: 'РУ' },
    { code: 'uz', label: 'O\'zbek', short: 'O\'Z' },
  ];

  const tabs = user?.role === 'admin' ? [
    { id: 'students', label: 'Students', dropdown: false },
    { id: 'progress', label: 'Progress', dropdown: false },
    { id: 'settings', label: 'Settings', dropdown: false },
  ] : [
    { id: 'home', label: t('home'), dropdown: false },
    { id: 'tests', label: t('tests'), dropdown: false },
    { 
      id: 'dictionary', 
      label: t('dictionary'), 
      dropdown: true,
      subItems: [
        { id: 'terms', label: t('terms') },
        { id: 'glossary', label: t('glossary') },
        { id: 'abbreviations', label: t('abbreviations') },
      ]
    },
    { 
      id: 'safety', 
      label: t('safety'), 
      dropdown: true,
      subItems: [
        { id: 'safetyBasics', label: t('safetyBasics') },
        { id: 'eld', label: t('eld') },
        { id: 'fleetManagement', label: t('fleetManagement') },
        { id: 'csaPoints', label: t('csaPoints') },
      ]
    },
    { 
      id: 'tools', 
      label: t('tools'), 
      dropdown: true,
      subItems: [
        { id: 'mapTimeZones', label: t('mapTimeZones') },
        { id: 'truckTypes', label: t('truckTypes') },
        { id: 'mappingGame', label: t('mappingGame') },
        { id: 'typingGame', label: t('typingGame') },
      ]
    },
    { 
      id: 'other', 
      label: t('other'), 
      dropdown: true,
      subItems: [
        { id: 'accounting', label: t('accounting') },
        { id: 'driverHiring', label: t('driverHiring') },
        { id: 'update', label: t('update') },
        { id: 'dispatch', label: t('dispatch') },
      ]
    },
  ];

  return (
    <nav className="bg-white border-zinc-200 border-b sticky top-0 z-50 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 px-6">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer group gap-2" 
              onClick={() => setActiveTab(user?.role === 'admin' ? 'students' : 'home')}
            >
              <img 
                src="/logistmate-logo.png" 
                alt="Logistmate Logo" 
                className="h-10 w-auto"
              />
              <span className="text-lg font-bold text-zinc-900 hidden sm:inline">Logistmate</span>
            </div>
          </div>

          {/* Navigation Items - Centered */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-4">
            <div className="flex items-center gap-2">
              {tabs.map((tab) => (
                <div 
                  key={tab.id} 
                  className="relative group nav-dropdown"
                  onMouseEnter={() => tab.dropdown && setActiveDropdown(tab.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => !tab.dropdown && setActiveTab(tab.id)}
                    className={`px-6 py-2.5 rounded-full text-[14px] font-semibold transition-all flex items-center gap-2 relative ${
                      activeTab === tab.id || activeTab.startsWith(`${tab.id}:`)
                        ? 'bg-[#0099FF] text-white shadow-lg'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    {tab.label}
                    {tab.dropdown && (
                      <ChevronRight 
                        size={14} 
                        className={`transition-transform duration-300 ${activeDropdown === tab.id ? 'rotate-90' : 'rotate-0'} ${activeTab === tab.id || activeTab.startsWith(`${tab.id}:`) ? 'text-white' : 'text-zinc-400'}`} 
                      />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {tab.dropdown && activeDropdown === tab.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 w-64 bg-white border border-zinc-100 shadow-2xl rounded-2xl py-2.5 mt-3 z-50 overflow-hidden"
                      >
                        <div className="px-4 py-2 mb-1 border-b border-zinc-50">
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{tab.label}</p>
                        </div>
                        {tab.subItems ? tab.subItems.map((sub) => (
                          <button 
                            key={sub.id}
                            onClick={() => {
                              setActiveTab(`${tab.id}:${sub.id}`);
                              setActiveDropdown(null);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm font-semibold transition-all flex items-center justify-between group mx-2 rounded-xl w-[calc(100%-1rem)] ${
                              activeTab === `${tab.id}:${sub.id}`
                                ? 'bg-[#000080] text-white shadow-sm'
                                : 'text-zinc-600 hover:bg-indigo-50/50 hover:text-[#000080]'
                            }`}
                          >
                            <span>{sub.label}</span>
                          </button>
                        )) : (
                          <div className="px-4 py-2 text-sm text-zinc-400 italic">No options</div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
          
          {/* Actions Section - Right Aligned */}
          <div className="flex items-center justify-end flex-shrink-0 gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0099FF] to-[#0077CC] rounded-2xl">
              <img 
                src="/bigi-study-logo.jpg" 
                alt="BIG-I STUDY" 
                className="h-8 w-auto"
              />
            </div>
            {user?.role !== 'admin' && (
              <div className="hidden sm:flex items-center gap-3 relative lang-selector">
                <button 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-transparent hover:border-zinc-100 hover:bg-zinc-50 transition-all text-zinc-600 hover:text-[#000080]"
                >
                  <Globe size={18} />
                  <span className="text-sm font-bold uppercase tracking-tight">{lang === 'uz' ? 'O\'Z' : lang === 'ru' ? 'РУ' : 'EN'}</span>
                  <ChevronRight size={14} className={`transition-transform duration-300 ${isLangOpen ? '-rotate-90' : 'rotate-90'} text-zinc-400`} />
                </button>

                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-zinc-100 py-2 z-50 overflow-hidden"
                    >
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => {
                            setLang(l.code as Language);
                            setIsLangOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                            lang === l.code 
                              ? 'bg-indigo-50/50 text-[#000080] font-bold' 
                              : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-8 font-bold ${lang === l.code ? 'text-[#000080]' : 'text-zinc-400'}`}>
                              {l.short}
                            </span>
                            <span>{l.label}</span>
                          </div>
                          {lang === l.code && <Check size={16} className="text-[#000080]" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {user ? (
              <div className="relative profile-menu">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl border border-zinc-100 hover:bg-zinc-50 transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#000080] flex items-center justify-center text-white overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={16} />
                    )}
                  </div>
                  <span className="text-sm font-bold text-zinc-700 hidden sm:block">
                    {user.displayName?.split(' ')[0] || 'User'}
                  </span>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-zinc-100 py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-zinc-50">
                        <p className="text-sm font-bold text-zinc-900 truncate">{user.displayName || 'User'}</p>
                        <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                      </div>
                      {user?.role !== 'admin' && (
                        <button 
                          onClick={() => {
                            setActiveTab('dashboard');
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-600 hover:bg-zinc-50 transition-colors font-bold"
                        >
                          <Activity size={16} />
                          {t('dashboard')}
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-bold"
                      >
                        <LogOut size={16} />
                        {t('signOut')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : null}
            
            <button className="lg:hidden p-2 text-zinc-600" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialMode={authMode} />
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b overflow-hidden transition-colors duration-500 bg-white border-zinc-100"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {tabs.map((tab) => (
                <div key={tab.id} className="space-y-1">
                  <button
                    onClick={() => {
                      if (!tab.dropdown) {
                        setActiveTab(tab.id);
                        setIsOpen(false);
                      } else {
                        setActiveDropdown(activeDropdown === tab.id ? null : tab.id);
                      }
                    }}
                    className={`w-full text-left px-5 py-4 rounded-2xl text-base font-bold flex items-center justify-between transition-all ${
                      activeTab === tab.id || activeTab.startsWith(`${tab.id}:`)
                        ? 'bg-[#000080] text-white shadow-lg'
                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-[#000080]'
                    }`}
                  >
                    {tab.label}
                    {tab.dropdown && (
                      <ChevronRight 
                        size={18} 
                        className={`transition-transform duration-300 ${activeDropdown === tab.id ? 'rotate-90' : ''} ${activeTab === tab.id || activeTab.startsWith(`${tab.id}:`) ? 'text-white' : 'text-zinc-300'}`} 
                      />
                    )}
                  </button>
                  
                  {tab.dropdown && activeDropdown === tab.id && tab.subItems && (
                    <div className="pl-4 space-y-1">
                      {tab.subItems.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setActiveTab(`${tab.id}:${sub.id}`);
                            setIsOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm font-medium rounded-lg ${
                            activeTab === `${tab.id}:${sub.id}`
                              ? 'bg-[#000080] text-white'
                              : 'text-zinc-500 hover:text-zinc-900'
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {user?.role !== 'admin' && (
                <div className="pt-4 flex items-center justify-between px-4">
                  <span className="text-sm font-medium text-zinc-500">Language</span>
                  <div className="flex gap-2">
                    {languages.map((l) => (
                      <button 
                        key={l.code} 
                        onClick={() => setLang(l.code as Language)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${lang === l.code ? 'bg-[#000080] text-white' : 'bg-zinc-100 text-zinc-600'}`}
                      >
                        {l.short}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Pages ---

const HomePage = () => {
  const { t } = useContext(LanguageContext);
  
  return (
    <div className="space-y-32 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -right-24 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-40"
        />
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold"
            >
              <Zap size={16} className="animate-pulse" />
              {t('welcome')}
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-[#000033] leading-[1.1] tracking-tight">
              {t('heroTitle')}
            </h1>
            <p className="text-xl text-zinc-600 leading-relaxed max-w-xl">
              {t('heroSub')}
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-[#000080] text-white text-lg font-bold rounded-xl hover:bg-[#000066] transition-all shadow-lg shadow-blue-900/20"
            >
              {t('getStarted')}
            </motion.button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-blue-600/10 blur-3xl rounded-full -z-10" />
            <div className="bg-slate-100 rounded-[40px] overflow-hidden shadow-2xl min-h-[400px] flex items-center justify-center border border-white/20">
              <img 
                src="/american-truck.jpg" 
                alt="Front view of a professional American logistics semi-truck" 
                className="w-full h-full object-cover aspect-[4/3]"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4 text-center space-y-16">
        <div className="space-y-6 max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl font-bold text-[#000033]"
          >
            {t('whatIsLogistmate')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-600 leading-relaxed"
          >
            {t('logistmateDesc')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: t('whyCreated'), desc: t('whyCreatedDesc'), icon: ClipboardList },
            { title: t('howItWorks'), desc: t('howItWorksDesc'), icon: BookOpen },
            { title: t('whoBenefits'), desc: t('whoBenefitsDesc'), icon: ShieldCheck },
          ].map((card, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="p-10 bg-white rounded-[32px] border border-zinc-100 shadow-sm text-left space-y-6 hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center text-[#000080]">
                <card.icon size={28} />
              </div>
              <h3 className="text-2xl font-bold text-[#000033]">{card.title}</h3>
              <p className="text-zinc-600 leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Key Benefits */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-zinc-50 rounded-[48px] p-12 md:p-20 space-y-16">
          <h2 className="text-4xl font-bold text-[#000033]">{t('keyBenefits')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
            {[
              { title: t('benefit1Title'), desc: t('benefit1Desc') },
              { title: t('benefit2Title'), desc: t('benefit2Desc') },
              { title: t('benefit3Title'), desc: t('benefit3Desc') },
              { title: t('benefit4Title'), desc: t('benefit4Desc') },
            ].map((benefit, i) => (
              <div key={i} className="flex gap-6">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-[#000033]">{benefit.title}</h4>
                  <p className="text-zinc-600 leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="max-w-3xl mx-auto px-4 text-center space-y-12">
        <div className="space-y-4">
          <div className="flex justify-center text-[#000080] mb-4">
            <ClipboardList size={40} />
          </div>
          <h2 className="text-4xl font-bold text-[#000033]">{t('feedbackTitle')}</h2>
          <p className="text-zinc-600">{t('feedbackSub')}</p>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-zinc-100 shadow-xl space-y-6 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#000033]">{t('nameLabel')}</label>
              <input type="text" placeholder="Your name" className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#000033]">{t('emailLabel')}</label>
              <input type="email" placeholder="your@email.com" className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#000033]">{t('messageLabel')}</label>
            <textarea rows={4} placeholder="Please share your thoughts..." className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none resize-none" />
          </div>
          <button className="w-full py-5 bg-[#000080] text-white font-bold rounded-xl hover:bg-[#000066] transition-all">
            {t('submitFeedback')}
          </button>
        </div>
      </section>
    </div>
  );
};

const SafetyBasicsPage = () => {
  const { t } = useContext(LanguageContext);

  const basics = [
    {
      id: 'unsafeDriving',
      title: t('unsafeDriving'),
      desc: t('unsafeDrivingDesc'),
      icon: AlertTriangle,
      color: 'blue',
      regs: '49 CFR Parts 392 and 397',
      details: [
        'Texting',
        'Speeding',
        'Using a hand-held cell phone',
        'Careless driving',
        'Improper lane change',
        'Inattention'
      ]
    },
    {
      id: 'crashIndicator',
      title: t('crashIndicator'),
      desc: t('crashIndicatorDesc'),
      icon: AlertTriangle,
      color: 'red',
      isPrivate: true,
      regs: '49 CFR Part 390',
      longDesc: 'State-reported crashes from the last two years are recorded in this BASIC to help identify patterns of high crash involvement and the behavior or set of behaviors that contributed to the crash.'
    },
    {
      id: 'hosCompliance',
      title: t('hosCompliance'),
      desc: t('hosComplianceDesc'),
      icon: Lock,
      color: 'indigo',
      regs: '49 CFR Parts 392 and 395',
      longDesc: 'The HOS regulations make roads safer by requiring rest for all large truck and bus drivers to ensure that they are alert, awake, and able to respond quickly.'
    },
    {
      id: 'vehicleMaintenance',
      title: t('vehicleMaintenance'),
      desc: t('vehicleMaintenanceDesc'),
      icon: Wrench,
      color: 'emerald',
      regs: '49 CFR Parts 392, 393, and 396',
      longDesc: 'Conduct pre- and post-trip inspections, record/service defects, and repair them prior to operating the vehicle.'
    },
    {
      id: 'substancesAlcohol',
      title: t('substancesAlcohol'),
      desc: t('substancesAlcoholDesc'),
      icon: Info,
      color: 'amber',
      regs: '49 CFR Parts 382 and 392',
      longDesc: 'Alcohol, illegal drugs, and over-the-counter and prescription medication misuse impair driving abilities and endanger your safety and the safety of those on the road with you. Having containers of alcoholic beverages in your cab, whether open or not, is a violation.'
    },
    {
      id: 'driverFitness',
      title: t('driverFitness'),
      desc: t('driverFitnessDesc'),
      icon: ShieldCheck,
      color: 'sky',
      regs: '49 CFR Parts 383 and 391',
      longDesc: 'Motor carriers are responsible for making sure driver qualification files are complete and current. Required files for each and every driver include valid commercial driver\'s licenses (CDLs), medical certificates, State driving records, annual reviews of driving records, and employment applications.'
    },
    {
      id: 'hmCompliance',
      title: t('hmCompliance'),
      desc: t('hmComplianceDesc'),
      icon: AlertTriangle,
      color: 'orange',
      isPrivate: true,
      regs: '49 CFR Part 397',
      longDesc: 'HM regulations are in place to ensure that HM is managed, stored, and transported safely. Violations in this BASIC include failing to properly mark or label HM, leaking containers, and failing to secure HM properly.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-16">
      {/* Hero */}
      <div className="bg-[#1e293b] rounded-[32px] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-6 max-w-2xl">
          <h1 className="text-5xl font-bold tracking-tight">{t('safetyBasicsTitle')}</h1>
          <p className="text-xl text-zinc-300 leading-relaxed">
            {t('safetyBasicsSub')}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <ShieldCheck size={400} className="translate-x-1/4 -translate-y-1/4" />
        </div>
      </div>

      {/* What are Basics */}
      <div className="bg-white rounded-[32px] p-10 border border-zinc-100 shadow-sm space-y-6">
        <h2 className="text-3xl font-bold text-[#000033]">{t('whatAreBasics')}</h2>
        <p className="text-lg text-zinc-600 leading-relaxed">
          {t('basicsDefinition')}
        </p>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {basics.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[24px] border border-zinc-200 shadow-sm overflow-hidden flex flex-col"
          >
            <div className={`p-8 bg-gradient-to-br ${
              item.color === 'blue' ? 'from-blue-600 to-blue-800' :
              item.color === 'red' ? 'from-red-600 to-red-800' :
              item.color === 'indigo' ? 'from-indigo-600 to-indigo-800' :
              item.color === 'emerald' ? 'from-emerald-600 to-emerald-800' :
              item.color === 'amber' ? 'from-amber-600 to-amber-800' :
              item.color === 'sky' ? 'from-sky-600 to-sky-800' :
              'from-orange-600 to-orange-800'
            } text-white relative`}>
              {item.isPrivate && (
                <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {t('notPublic')}
                </span>
              )}
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <item.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-tight">{item.title}</h3>
            </div>
            
            <div className="p-8 space-y-6 flex-1 flex flex-col">
              <div className="space-y-4 flex-1">
                <p className="font-bold text-zinc-900 leading-snug">{item.desc}</p>
                {item.longDesc && (
                  <p className="text-sm text-zinc-500 leading-relaxed">{item.longDesc}</p>
                )}
                {item.details && (
                  <ul className="space-y-2">
                    {item.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-zinc-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div className="pt-6 border-t border-zinc-100">
                <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  {t('federalRegulations')}
                </div>
                <p className="text-[11px] text-zinc-400 mt-1 font-medium">{item.regs}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ELDPage = () => {
  const { t } = useContext(LanguageContext);

  const features = [
    {
      id: 'whatIsEld',
      title: t('whatIsEld'),
      sub: t('whatIsEldSub'),
      icon: Clock,
      bullets: [t('eldWhatIsBullet1'), t('eldWhatIsBullet2'), t('eldWhatIsBullet3')]
    },
    {
      id: 'howEldsWork',
      title: t('howEldsWork'),
      sub: t('howEldsWorkSub'),
      icon: Info,
      bullets: [t('eldHowWorksBullet1'), t('eldHowWorksBullet2'), t('eldHowWorksBullet3')]
    },
    {
      id: 'keyFeatures',
      title: t('keyFeaturesTitle'),
      sub: t('keyFeaturesSub'),
      icon: CheckCircle2,
      bullets: [t('eldKeyFeaturesBullet1'), t('eldKeyFeaturesBullet2'), t('eldKeyFeaturesBullet3')]
    },
    {
      id: 'regulatoryReqs',
      title: t('regulatoryReqs'),
      sub: t('regulatoryReqsSub'),
      icon: ClipboardList,
      bullets: [t('eldRegulatoryBullet1'), t('eldRegulatoryBullet2'), t('eldRegulatoryBullet3')]
    },
    {
      id: 'benefits',
      title: t('benefitsTitle'),
      sub: t('benefitsSub'),
      icon: Trophy,
      bullets: [t('eldBenefitsBullet1'), t('eldBenefitsBullet2'), t('eldBenefitsBullet3')]
    },
    {
      id: 'exemptions',
      title: t('exemptionsTitle'),
      sub: t('exemptionsSub'),
      icon: ShieldCheck,
      bullets: [t('eldExemptionsBullet1'), t('eldExemptionsBullet2'), t('eldExemptionsBullet3')]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-16">
      {/* Hero */}
      <div className="bg-[#1e293b] rounded-[32px] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-6 max-w-2xl">
          <h1 className="text-5xl font-bold tracking-tight">{t('eldTitle')}</h1>
          <p className="text-xl text-zinc-300 leading-relaxed">
            {t('eldSub')}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <Lock size={400} className="translate-x-1/4 -translate-y-1/4" />
        </div>
      </div>

      {/* Overview Section */}
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-[#000033]">{t('eldOverview')}</h2>
          <p className="text-lg text-zinc-600 leading-relaxed max-w-4xl">
            {t('eldOverviewDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-zinc-50 rounded-[32px] p-8 space-y-6 flex flex-col items-center text-center">
            <div className="w-full aspect-video bg-white rounded-2xl flex items-center justify-center border border-zinc-100 shadow-sm overflow-hidden">
               <div className="flex flex-col items-center gap-4 text-zinc-400">
                 <Wrench size={64} />
                 <span className="text-xs font-bold uppercase tracking-widest">Hardware Unit</span>
               </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-zinc-900">{t('eldHardwareUnit')}</h3>
              <p className="text-zinc-500 text-sm">{t('eldHardwareDesc')}</p>
            </div>
          </div>

          <div className="bg-zinc-50 rounded-[32px] p-8 space-y-6 flex flex-col items-center text-center">
            <div className="w-full aspect-video bg-white rounded-2xl flex items-center justify-center border border-zinc-100 shadow-sm overflow-hidden">
               <div className="flex flex-col items-center gap-4 text-zinc-400">
                 <Globe size={64} />
                 <span className="text-xs font-bold uppercase tracking-widest">Software Application</span>
               </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-zinc-900">{t('eldSoftwareApp')}</h3>
              <p className="text-zinc-500 text-sm">{t('eldSoftwareDesc')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[24px] border border-zinc-100 shadow-sm overflow-hidden flex flex-col"
          >
            <div className="p-6 bg-[#000080] text-white flex items-center justify-center">
              <feature.icon size={32} />
            </div>
            <div className="p-8 space-y-6 flex-1 flex flex-col">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-zinc-900">{feature.title}</h3>
                <p className="text-sm italic text-zinc-500">{feature.sub}</p>
              </div>
              <ul className="space-y-3 flex-1">
                {feature.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-zinc-600 leading-relaxed">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Responsibilities */}
      <div className="bg-blue-50/50 rounded-[32px] p-10 border border-blue-100 space-y-10">
        <h2 className="text-3xl font-bold text-[#000033]">{t('driverCarrierResp')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <Info size={18} />
              </div>
              {t('driverResp')}
            </h3>
            <ul className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <li key={i} className="flex items-center gap-3 text-zinc-700">
                  <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                  <span className="font-medium">{t(`driverRespBullet${i}`)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <Globe size={18} />
              </div>
              {t('carrierResp')}
            </h3>
            <ul className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <li key={i} className="flex items-center gap-3 text-zinc-700">
                  <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                  <span className="font-medium">{t(`carrierRespBullet${i}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Data Transfer */}
      <div className="bg-[#151619] rounded-[32px] p-12 text-white space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">{t('dataTransferCompliance')}</h2>
          <p className="text-zinc-400 leading-relaxed max-w-4xl">
            {t('dataTransferDesc')}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Web Services', 'Email', 'USB', 'Bluetooth'].map(method => (
            <div key={method} className="py-4 px-6 rounded-xl border border-white/10 bg-white/5 text-center font-bold text-sm hover:bg-white/10 transition-colors cursor-default">
              {method}
            </div>
          ))}
        </div>
      </div>

      {/* HOS Compliance Section */}
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black text-[#000033] tracking-tight">{t('hosComplianceTitle')}</h2>
          <p className="text-zinc-600 text-lg max-w-2xl mx-auto">
            {t('hosComplianceSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* HOS Rules */}
          <div className="bg-white rounded-[40px] border border-zinc-100 shadow-xl p-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#000080]">
                <Scale size={24} />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900">{t('hosRulesTitle')}</h3>
            </div>
            <p className="text-zinc-500">{t('hosRulesDesc')}</p>
            <ul className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <li key={i} className="flex gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <div className="w-6 h-6 rounded-full bg-[#000080] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    {i}
                  </div>
                  <p className="text-zinc-700 font-medium text-sm leading-relaxed">
                    {t(`hosRule${i}`)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Best Practices */}
          <div className="bg-[#000033] rounded-[40px] shadow-2xl p-10 text-white space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400">
                <Lightbulb size={24} />
              </div>
              <h3 className="text-2xl font-bold">{t('hosBestPracticesTitle')}</h3>
            </div>
            <p className="text-zinc-400">{t('hosBestPracticesDesc')}</p>
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <ShieldCheck size={20} />
                  </div>
                  <p className="text-zinc-300 font-medium text-sm leading-relaxed pt-1">
                    {t(`hosPractice${i}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FMCSA Links */}
        <div className="bg-emerald-50 rounded-[40px] border border-emerald-100 p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-2xl font-bold text-emerald-900">{t('fmcsaLinksTitle')}</h3>
            <p className="text-emerald-700/80 max-w-xl">
              {t('fmcsaLinksDesc')}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://www.fmcsa.dot.gov/regulations/hours-of-service" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-emerald-700 font-bold rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 border border-emerald-100"
            >
              HOS Regulations <ExternalLink size={16} />
            </a>
            <a 
              href="https://www.fmcsa.dot.gov/hours-service/elds/electronic-logging-devices" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all flex items-center gap-2"
            >
              ELD Guidance <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const FleetManagementPage = () => {
  const { t } = useContext(LanguageContext);

  const objectives = [
    'objSafety', 'objCompliance', 'objCosts', 'objUtilization', 
    'objLifeCycle', 'objFuel', 'objData'
  ];

  const sections = [
    {
      id: 'acquisition',
      title: t('vehicleAcquisition'),
      icon: Truck,
      color: 'blue',
      bullets: [
        'Vehicle selection based on payload, fuel type, durability, and cost',
        'Financing or leasing decisions',
        'Tracking depreciation and scheduling replacement',
        'Ensuring optimal return on investment (ROI)'
      ]
    },
    {
      id: 'driver',
      title: t('driverManagement'),
      icon: Users,
      color: 'emerald',
      bullets: [
        'Driver onboarding and qualification verification',
        'Training on safe driving practices',
        'Monitoring driving behavior (speeding, harsh braking, idling)',
        'Managing hours of service (HOS) compliance',
        'Implementing safety policies and incentive programs'
      ]
    },
    {
      id: 'maintenance',
      title: t('maintenanceAsset'),
      icon: Wrench,
      color: 'orange',
      bullets: [
        'Preventive maintenance scheduling',
        'Inspection tracking and repair documentation',
        'Managing breakdowns and roadside assistance',
        'Parts and inventory control',
        'DOT inspection compliance management'
      ]
    },
    {
      id: 'fuel',
      title: t('fuelManagement'),
      icon: Fuel,
      color: 'amber',
      bullets: [
        'Monitoring fuel consumption and identifying inefficiencies',
        'Reducing idling and fuel theft',
        'Route optimization to reduce fuel usage',
        'Comparing fuel efficiency across vehicles and drivers',
        'Implementing fuel cards and telematics-based tracking'
      ]
    },
    {
      id: 'compliance',
      title: t('complianceRegulatory'),
      icon: FileText,
      color: 'red',
      bullets: [
        'Full regulatory compliance to avoid fines and operational disruption',
        'Managing permits, licenses, and registrations',
        'Ensuring adherence to HOS and ELD mandates',
        'Maintaining accurate records for audits',
        'Staying updated on changing transportation laws'
      ]
    },
    {
      id: 'telematics',
      title: t('telematicsTech'),
      icon: Activity,
      color: 'indigo',
      bullets: [
        'Real-time visibility and data-driven decision making',
        'GPS tracking and geofencing',
        'Vehicle diagnostics and remote monitoring',
        'Integration with fleet management software (FMS)',
        'Automated reporting and alerts'
      ]
    },
    {
      id: 'route',
      title: t('routePlanning'),
      icon: MapPin,
      color: 'sky',
      bullets: [
        'Optimized routing for improved productivity and customer satisfaction',
        'Route optimization to reduce distance and time',
        'Real-time traffic monitoring and adjustments',
        'Dynamic dispatching capabilities',
        'Load planning and delivery scheduling',
        'On-time performance tracking'
      ]
    },
    {
      id: 'environmental',
      title: t('environmentalSustainability'),
      icon: Leaf,
      color: 'green',
      bullets: [
        'Modern focus on reducing emissions and environmental impact',
        'Emissions reduction strategies',
        'Implementation of alternative fuel vehicles',
        'Carbon footprint monitoring',
        'Fuel efficiency improvement initiatives',
        'Environmental standards compliance'
      ]
    }
  ];

  const kpis = [
    { title: t('costPerMile'), desc: t('costPerMileDesc') },
    { title: t('fuelEfficiency'), desc: t('fuelEfficiencyDesc') },
    { title: t('vehicleUtilization'), desc: t('vehicleUtilizationDesc') },
    { title: t('maintenanceCostPerVehicle'), desc: t('maintenanceCostPerVehicleDesc') },
    { title: t('driverSafetyScores'), desc: t('driverSafetyScoresDesc') },
    { title: t('onTimeDelivery'), desc: t('onTimeDeliveryDesc') }
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-16">
      {/* Hero */}
      <div className="bg-[#1e293b] rounded-[32px] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-6 max-w-2xl">
          <h1 className="text-5xl font-bold tracking-tight">{t('fleetManagementTitle')}</h1>
          <p className="text-xl text-zinc-300 leading-relaxed">
            {t('fleetManagementSub')}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <Truck size={400} className="translate-x-1/4 -translate-y-1/4" />
        </div>
      </div>

      {/* What is Fleet Management */}
      <div className="bg-white rounded-[32px] p-10 border border-zinc-100 shadow-sm space-y-6">
        <h2 className="text-3xl font-bold text-[#000033]">{t('whatIsFleetManagement')}</h2>
        <div className="space-y-4 text-lg text-zinc-600 leading-relaxed">
          <p>{t('fleetManagementDef')}</p>
          <p>{t('fleetManagementApplies')}</p>
        </div>
      </div>

      {/* Core Objectives */}
      <div className="bg-white rounded-[32px] p-10 border border-zinc-100 shadow-sm space-y-8">
        <h2 className="text-3xl font-bold text-[#000033]">{t('coreObjectives')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {objectives.map(obj => (
            <div key={obj} className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
              <span className="text-sm font-medium text-zinc-700">{t(obj)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, i) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[32px] border border-zinc-100 shadow-sm p-8 space-y-8"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              section.color === 'blue' ? 'bg-blue-50 text-blue-600' :
              section.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
              section.color === 'orange' ? 'bg-orange-50 text-orange-600' :
              section.color === 'amber' ? 'bg-amber-50 text-amber-600' :
              section.color === 'red' ? 'bg-red-50 text-red-600' :
              section.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
              section.color === 'sky' ? 'bg-sky-50 text-sky-600' :
              'bg-green-50 text-green-600'
            }`}>
              <section.icon size={28} />
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-zinc-900">{section.title}</h3>
              <ul className="space-y-3">
                {section.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-zinc-600 leading-relaxed">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Performance Monitoring */}
      <div className="bg-white rounded-[32px] p-10 border border-zinc-100 shadow-sm space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-[#000033]">{t('fleetPerformance')}</h2>
          <p className="text-lg text-zinc-600 leading-relaxed max-w-4xl">
            {t('fleetPerformanceDesc')}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpis.map(kpi => (
            <div key={kpi.title} className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-2">
              <h4 className="font-bold text-zinc-900">{kpi.title}</h4>
              <p className="text-sm text-zinc-500">{kpi.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Management */}
      <div className="bg-white rounded-[32px] p-10 border border-zinc-100 shadow-sm space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-[#000033]">{t('riskManagement')}</h2>
          <p className="text-lg text-zinc-600 leading-relaxed">
            {t('riskManagementDesc')}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            'Accident response procedures',
            'Incident investigation protocols',
            'Claims management coordination',
            'Insurance coordination',
            'Driver retraining programs'
          ].map(item => (
            <div key={item} className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
              <span className="text-sm font-medium text-zinc-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Role of Manager */}
      <div className="bg-[#1e293b] rounded-[32px] p-12 text-white space-y-10">
        <h2 className="text-3xl font-bold">{t('roleFleetManager')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            'strategicPlanning', 'dailyOperations', 'policyEnforcement', 
            'vendorManagement', 'performanceAnalysis', 'continuousImprovement'
          ].map(role => (
            <div key={role} className="flex items-center gap-4">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check size={14} className="text-white" />
              </div>
              <span className="font-medium text-zinc-200">{t(role)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Conclusion */}
      <div className="bg-zinc-50 rounded-[32px] p-10 border border-zinc-200 space-y-6">
        <h2 className="text-3xl font-bold text-[#000033]">{t('conclusion')}</h2>
        <p className="text-lg text-zinc-600 leading-relaxed">
          {t('fleetConclusion')}
        </p>
      </div>
    </div>
  );
};

const CsaPointsPage = () => {
  const { t } = useContext(LanguageContext);
  
  const severityTable = [
    { category: 'Unsafe Driving', examples: 'Speeding, reckless driving, improper lane change', points: '1-10' },
    { category: 'HOS Compliance', examples: 'Driving over hours, falsifying logs', points: '1-10' },
    { category: 'Vehicle Maintenance', examples: 'Brakes, lights, tires, load securement', points: '1-10' },
    { category: 'Driver Fitness', examples: 'Invalid CDL, expired medical card', points: '1-10' },
    { category: 'Drugs/Alcohol', examples: 'Possession or use while on duty', points: '10' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-16">
      {/* Hero */}
      <div className="bg-[#000033] rounded-[32px] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-6 max-w-2xl">
          <h1 className="text-5xl font-bold tracking-tight">CSA Points System</h1>
          <p className="text-xl text-zinc-300 leading-relaxed">
            Understanding how violations impact your safety record and the Compliance, Safety, Accountability (CSA) score.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <BarChart3 size={400} className="translate-x-1/4 -translate-y-1/4" />
        </div>
      </div>

      {/* Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-zinc-900">How Points are Calculated</h2>
          <p className="text-zinc-600 leading-relaxed">
            The CSA program uses a Safety Measurement System (SMS) to track violations. Each violation is assigned a <strong>severity weight</strong> based on its crash risk, and a <strong>time weight</strong> based on how recently it occurred.
          </p>
          <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100 space-y-4">
            <h4 className="font-bold text-zinc-900">Time Weights:</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-12 h-8 bg-rose-100 text-rose-600 rounded flex items-center justify-center font-bold">3x</div>
                <span className="text-zinc-600">Violations within the last 6 months</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-12 h-8 bg-amber-100 text-amber-600 rounded flex items-center justify-center font-bold">2x</div>
                <span className="text-zinc-600">Violations between 6 and 12 months ago</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-12 h-8 bg-emerald-100 text-emerald-600 rounded flex items-center justify-center font-bold">1x</div>
                <span className="text-zinc-600">Violations between 12 and 24 months ago</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-zinc-900">Severity Weights</h2>
          <p className="text-zinc-600 leading-relaxed">
            Violations are weighted from 1 to 10. A weight of 10 represents the highest crash risk, while a weight of 1 represents the lowest.
          </p>
          <div className="overflow-hidden border border-zinc-200 rounded-2xl shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">BASIC Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {severityTable.map((row, i) => (
                  <tr key={i} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-zinc-900">{row.category}</p>
                      <p className="text-xs text-zinc-500">{row.examples}</p>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-rose-600">{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <div className="bg-amber-50 border border-amber-100 rounded-[32px] p-10 flex flex-col md:flex-row gap-10 items-center">
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center flex-shrink-0">
          <AlertCircle size={40} />
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-amber-900">Why CSA Scores Matter</h3>
          <p className="text-amber-800 leading-relaxed">
            High CSA scores can lead to increased FMCSA interventions, roadside inspections, and higher insurance premiums. For drivers, it can impact employability, as many carriers screen for clean safety records.
          </p>
        </div>
      </div>
    </div>
  );
};

const MapTimeZonesPage = () => {
  const { t } = useContext(LanguageContext);
  
  const timeZones = [
    { name: 'Eastern Time (ET)', offset: 'UTC -5/-4', states: 'New York, Florida, Georgia, etc.', color: 'bg-blue-600', desc: 'The most populous time zone, covering the entire Atlantic coast and the Appalachian Mountains. Major logistics hubs: NYC, Atlanta, Miami.' },
    { name: 'Central Time (CT)', offset: 'UTC -6/-5', states: 'Texas, Illinois, Tennessee, etc.', color: 'bg-indigo-600', desc: 'Covers the Gulf Coast, Mississippi Valley, and most of the Great Plains. Critical for North-South logistics corridor. Major hubs: Chicago, Dallas, Memphis.' },
    { name: 'Mountain Time (MT)', offset: 'UTC -7/-6', states: 'Colorado, Arizona, Utah, etc.', color: 'bg-emerald-600', desc: 'Spans the Rocky Mountains and the Southwest. Known for long distances between major cities and challenging winter terrain. Major hubs: Denver, Phoenix, Salt Lake City.' },
    { name: 'Pacific Time (PT)', offset: 'UTC -8/-7', states: 'California, Washington, Oregon, etc.', color: 'bg-amber-600', desc: 'Includes the entire West Coast. Home to the busiest ports in the US (LA/Long Beach). Major hubs: Los Angeles, Seattle, San Francisco.' },
    { name: 'Alaska Time (AKT)', offset: 'UTC -9/-8', states: 'Alaska', color: 'bg-rose-600', desc: 'Covers almost all of the state of Alaska. Logistics here often involves air and sea transport due to limited road infrastructure.' },
    { name: 'Hawaii-Aleutian (HAT)', offset: 'UTC -10', states: 'Hawaii', color: 'bg-sky-600', desc: 'Covers Hawaii and the Aleutian Islands. Primarily dependent on maritime and air logistics.' },
  ];

  const regions = [
    { 
      name: 'Northeast', 
      states: 'ME, NH, VT, MA, RI, CT, NY, PA, NJ', 
      desc: 'High population density, complex urban logistics, and frequent snow in winter. Home to the "Megalopolis" corridor.',
      icon: Globe
    },
    { 
      name: 'Midwest', 
      states: 'OH, IN, IL, MI, WI, MN, IA, MO, ND, SD, NE, KS', 
      desc: 'The "Heartland" of US manufacturing and agriculture. Chicago is the primary rail and trucking hub of North America.',
      icon: Activity
    },
    { 
      name: 'South', 
      states: 'DE, MD, VA, WV, KY, NC, SC, TN, GA, FL, AL, MS, AR, LA, OK, TX', 
      desc: 'Rapidly growing industrial base. Texas and Florida are major entry points for international trade.',
      icon: Zap
    },
    { 
      name: 'West', 
      states: 'MT, ID, WY, CO, NM, AZ, UT, NV, WA, OR, CA, AK, HI', 
      desc: 'Diverse geography from deserts to rainforests. Port of LA/Long Beach handles 40% of US containerized imports.',
      icon: MapPin
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-16">
      <div className="bg-[#1e293b] rounded-[32px] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-6 max-w-2xl">
          <h1 className="text-5xl font-bold tracking-tight">US Geography & Time Zones</h1>
          <p className="text-xl text-zinc-300 leading-relaxed">
            Mastering the geography of North America and the critical timing required for cross-country logistics.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <Globe size={400} className="translate-x-1/4 -translate-y-1/4" />
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-zinc-900">US Time Zone Map</h2>
            <p className="text-zinc-500">A visual guide to the six primary time zones across the United States.</p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest">
            {Object.entries({
              'Eastern': 'bg-blue-600',
              'Central': 'bg-indigo-600',
              'Mountain': 'bg-emerald-600',
              'Pacific': 'bg-amber-600',
              'Alaska': 'bg-rose-600',
              'Hawaii': 'bg-sky-600'
            }).map(([name, color]) => (
              <div key={name} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </div>
        <USTimeZoneMap />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-zinc-900">Time Zones Detailed</h2>
          <div className="grid grid-cols-1 gap-4">
            {timeZones.map((tz) => (
              <div key={tz.name} className="p-6 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${tz.color}`} />
                    <h4 className="font-bold text-zinc-900">{tz.name}</h4>
                  </div>
                  <span className="px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full text-xs font-mono font-bold">
                    {tz.offset}
                  </span>
                </div>
                <p className="text-sm text-zinc-600 leading-relaxed">{tz.desc}</p>
                <div className="pt-2 border-t border-zinc-50">
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">Key States</p>
                  <p className="text-xs text-zinc-500">{tz.states}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-zinc-900">US Logistics Regions</h2>
          <p className="text-zinc-600 leading-relaxed">
            The US is often divided into four major census regions, each with its own unique logistics profile and infrastructure challenges.
          </p>
          <div className="grid grid-cols-1 gap-6">
            {regions.map((region) => (
              <div key={region.name} className="group p-8 bg-zinc-50 rounded-[2rem] border border-transparent hover:border-zinc-200 hover:bg-white transition-all duration-300">
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <region.icon size={28} className="text-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-zinc-900">{region.name} Region</h4>
                    <p className="text-sm text-zinc-600 leading-relaxed">{region.desc}</p>
                    <div className="inline-block px-3 py-1 bg-white border border-zinc-100 rounded-lg text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      {region.states}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-[3rem] p-12 text-white">
        <div className="max-w-3xl space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">Logistics Geography Pro-Tips</h2>
            <p className="text-zinc-400 text-lg">Essential knowledge for every dispatcher and driver operating in the US market.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center">
                <Clock size={20} />
              </div>
              <h4 className="font-bold">The 11-Hour Rule</h4>
              <p className="text-sm text-zinc-500">When planning cross-country routes, remember that drivers can only drive 11 hours after 10 consecutive hours off-duty. Time zone changes can make this calculation tricky.</p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 bg-emerald-600/20 text-emerald-400 rounded-lg flex items-center justify-center">
                <Truck size={20} />
              </div>
              <h4 className="font-bold">The "Golden Triangle"</h4>
              <p className="text-sm text-zinc-500">The area between Chicago, New York, and Atlanta contains over 50% of the US population and generates the highest volume of LTL and TL freight.</p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 bg-amber-600/20 text-amber-400 rounded-lg flex items-center justify-center">
                <AlertTriangle size={20} />
              </div>
              <h4 className="font-bold">Mountain Passes</h4>
              <p className="text-sm text-zinc-500">Donner Pass (I-80) and Vail Pass (I-70) are critical bottlenecks. Winter weather in Mountain and Pacific zones can shut down logistics for days.</p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 bg-rose-600/20 text-rose-400 rounded-lg flex items-center justify-center">
                <MapPin size={20} />
              </div>
              <h4 className="font-bold">Port Congestion</h4>
              <p className="text-sm text-zinc-500">West Coast ports (LA/Long Beach) often face congestion. Savvy dispatchers sometimes route cargo to East Coast ports (Savannah, NY/NJ) despite longer transit times.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DispatcherToolsPage = () => {
  const { t } = useContext(LanguageContext);
  
  const tools = [
    { 
      title: 'Load Boards', 
      desc: 'Platforms like DAT and Truckstop where dispatchers find freight for their trucks and carriers find trucks for their freight.',
      icon: ClipboardList,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      title: 'TMS (Transportation Management System)', 
      desc: 'Software used to manage the entire lifecycle of a shipment, from booking to invoicing and tracking.',
      icon: Activity,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    },
    { 
      title: 'ELD & Telematics', 
      desc: 'Real-time tracking of truck location, speed, and driver hours of service (HOS) to ensure compliance.',
      icon: Lock,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    { 
      title: 'Communication Tools', 
      desc: 'Slack, specialized phone systems, and email are used for constant contact with drivers and brokers.',
      icon: Users,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    { 
      title: 'Routing & Fuel Optimization', 
      desc: 'Tools like PC*Miler or Google Maps for Trucks to plan the most efficient and safe routes.',
      icon: MapPin,
      color: 'text-rose-600',
      bg: 'bg-rose-50'
    },
    { 
      title: 'Accounting & Factoring', 
      desc: 'Systems to manage payments, fuel cards, and factoring services to maintain cash flow.',
      icon: Calculator,
      color: 'text-sky-600',
      bg: 'bg-sky-50'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-16">
      <div className="bg-[#000033] rounded-[32px] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-6 max-w-2xl">
          <h1 className="text-5xl font-bold tracking-tight">Dispatcher Tools</h1>
          <p className="text-xl text-zinc-300 leading-relaxed">
            The digital arsenal of a modern dispatcher. Efficiency in logistics is driven by the right software and real-time data.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <Wrench size={400} className="translate-x-1/4 -translate-y-1/4" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool) => (
          <div key={tool.title} className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 ${tool.bg} ${tool.color} rounded-2xl flex items-center justify-center`}>
              <tool.icon size={28} />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">{tool.title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{tool.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const TrucksPage = () => {
  const { t } = useContext(LanguageContext);
  
  const trucks = [
    { 
      type: 'Dry Van', 
      img: 'https://images.unsplash.com/photo-1586191582113-52ee20ad777b?auto=format&fit=crop&q=80&w=800', 
      desc: 'The most common type of trailer. It is a simple, enclosed box used to transport non-perishable goods.',
      specs: '53ft length, up to 45,000 lbs capacity.'
    },
    { 
      type: 'Reefer (Refrigerated)', 
      img: 'https://images.unsplash.com/photo-1616432043562-3671ea2e5242?auto=format&fit=crop&q=80&w=800', 
      desc: 'Equipped with a cooling system to transport temperature-sensitive goods like food or pharmaceuticals.',
      specs: '53ft length, temperature controlled.'
    },
    { 
      type: 'Flatbed', 
      img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800', 
      desc: 'An open trailer with no sides or roof. Used for oversized loads, construction materials, and machinery.',
      specs: 'Versatile loading, requires strapping/tarping.'
    },
    { 
      type: 'Step Deck', 
      img: 'https://images.unsplash.com/photo-1591768793355-74d74b262bb4?auto=format&fit=crop&q=80&w=800', 
      desc: 'Similar to a flatbed but with a lower deck to accommodate taller loads that would exceed height limits.',
      specs: 'Two-level deck, ideal for tall machinery.'
    },
    { 
      type: 'Box Truck', 
      img: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=800', 
      desc: 'A smaller, integrated truck and cargo area. Used for local deliveries and "last-mile" logistics.',
      specs: '12ft-26ft length, non-CDL options.'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold text-zinc-900">Truck Types & Equipment</h1>
        <p className="text-xl text-zinc-500">Choosing the right equipment for the right load is the first step in successful dispatching.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {trucks.map((truck) => (
          <div key={truck.type} className="group space-y-6">
            <div className="aspect-video rounded-[32px] overflow-hidden border border-zinc-200 shadow-lg">
              <img 
                src={truck.img} 
                alt={truck.type} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="space-y-2 px-4">
              <h3 className="text-2xl font-bold text-zinc-900">{truck.type}</h3>
              <p className="text-zinc-600 leading-relaxed">{truck.desc}</p>
              <div className="pt-2">
                <span className="inline-block px-4 py-1 bg-zinc-100 text-zinc-500 rounded-full text-xs font-bold uppercase tracking-wider">
                  {truck.specs}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TypingGamePage = () => {
  const { t } = useContext(LanguageContext);
  const [words, setWords] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isFinished, setIsFinished] = useState(false);
  const [stats, setStats] = useState({ 
    wpm: 0, 
    accuracy: 0, 
    timeSpent: 0,
    characters: { correct: 0, incorrect: 0, extra: 0, missed: 0 },
    consistency: 0
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioCtx = useRef<AudioContext | null>(null);
  const keystrokes = useRef<{ time: number, correct: boolean }[]>([]);

  const playSound = (type: 'correct' | 'error' | 'finish') => {
    if (!soundEnabled) return;
    
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioCtx.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'error') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'finish') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  };

  const logisticsWords = [
    'logistics', 'dispatcher', 'freight', 'carrier', 'broker', 'shipper', 'consignee',
    'bill of lading', 'deadhead', 'detention', 'layover', 'dry van', 'reefer', 'flatbed',
    'step deck', 'box truck', 'load board', 'tracking', 'telematics', 'compliance',
    'hours of service', 'logbook', 'manifest', 'intermodal', 'last mile', 'supply chain',
    'warehousing', 'inventory', 'distribution', 'pallet', 'container', 'chassis',
    'bobtail', 'deadhead', 'backhaul', 'headhaul', 'capacity', 'rate confirmation',
    'lumper', 'tarping', 'strapping', 'oversized', 'hazmat', 'eld', 'dot', 'fmcsa'
  ];

  const generateWords = () => {
    const shuffled = [...logisticsWords].sort(() => Math.random() - 0.5);
    setWords(shuffled.slice(0, 40));
  };

  useEffect(() => {
    generateWords();
  }, []);

  useEffect(() => {
    let timer: any;
    if (startTime && timeLeft > 0 && !isFinished) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      playSound('finish');
      calculateResults();
    }
    return () => clearInterval(timer);
  }, [startTime, timeLeft, isFinished]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;
    if (!startTime) setStartTime(Date.now());
    
    const newValue = e.target.value;
    const lastCharIndex = newValue.length - 1;
    
    if (newValue.length > userInput.length) {
      // Character added
      const charTyped = newValue[lastCharIndex];
      const expectedChar = targetText[lastCharIndex];
      const isCorrect = charTyped === expectedChar;
      
      keystrokes.current.push({ time: Date.now(), correct: isCorrect });

      if (isCorrect) {
        playSound('correct');
      } else {
        playSound('error');
      }
    }
    
    setUserInput(newValue);
  };

  const calculateResults = () => {
    setIsFinished(true);
    const totalChars = userInput.length;
    const targetChars = targetText.length;
    
    let correctChars = 0;
    let incorrectChars = 0;
    
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === targetText[i]) {
        correctChars++;
      } else {
        incorrectChars++;
      }
    }

    const missedChars = Math.max(0, targetChars - userInput.length);
    const extraChars = Math.max(0, userInput.length - targetChars);
    
    const timeElapsed = (60 - timeLeft) || 1;
    const wpm = Math.round((correctChars / 5) / (timeElapsed / 60));
    const accuracy = Math.round((correctChars / totalChars) * 100) || 0;

    // Consistency calculation based on keystroke intervals
    let consistency = 0;
    if (keystrokes.current.length > 2) {
      const intervals: number[] = [];
      for (let i = 1; i < keystrokes.current.length; i++) {
        if (keystrokes.current[i].correct) {
          intervals.push(keystrokes.current[i].time - keystrokes.current[i-1].time);
        }
      }
      
      if (intervals.length > 0) {
        const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const variance = intervals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / intervals.length;
        const stdDev = Math.sqrt(variance);
        // Map CV to a percentage (0.5 CV -> 50% consistency, roughly)
        consistency = Math.max(0, Math.min(100, Math.round(100 - (stdDev / mean * 50))));
      }
    }

    setStats({ 
      wpm, 
      accuracy, 
      timeSpent: timeElapsed,
      characters: { correct: correctChars, incorrect: incorrectChars, extra: extraChars, missed: missedChars },
      consistency
    });

    // Save stats
    const savedStats = localStorage.getItem('logistmate_stats');
    const statsData = savedStats ? JSON.parse(savedStats) : {};
    
    const newStats = {
      ...statsData,
      typingBestWPM: Math.max(statsData.typingBestWPM || 0, wpm),
      lastActivity: {
        type: 'typing_game',
        score: `${wpm} WPM`,
        time: new Date().toISOString()
      }
    };
    
    localStorage.setItem('logistmate_stats', JSON.stringify(newStats));
  };

  const restart = () => {
    setUserInput('');
    setStartTime(null);
    setTimeLeft(60);
    setIsFinished(false);
    keystrokes.current = [];
    generateWords();
    inputRef.current?.focus();
  };

  const targetText = words.join(' ');
  const targetChars = useMemo(() => targetText.split(''), [targetText]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#323437] text-[#646669] font-mono p-8 md:p-16 rounded-[48px] shadow-2xl border border-white/5 transition-all duration-500 my-12 mx-4">
      <div className="max-w-7xl w-full space-y-16">
        {!isFinished ? (
          <>
            <div className="flex justify-between items-end text-[#e2b714]">
              <div className="flex gap-16">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase opacity-30 tracking-[0.2em] mb-2 font-bold">time</span>
                  <motion.span 
                    key={timeLeft}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-bold text-4xl leading-none"
                  >
                    {timeLeft}
                  </motion.span>
                </div>
              </div>
            </div>

            <div 
              className="relative text-2xl md:text-3xl leading-[1.6] select-none cursor-text min-h-[240px] outline-none"
              onClick={() => inputRef.current?.focus()}
            >
              <input
                ref={inputRef}
                type="text"
                className="absolute opacity-0 pointer-events-none"
                value={userInput}
                onChange={handleInput}
                autoFocus
              />
              <div className="flex flex-wrap content-start">
                {targetChars.map((char, i) => {
                  const isTyped = i < userInput.length;
                  const isCorrect = isTyped && userInput[i] === char;
                  const isCurrent = i === userInput.length;
                  
                  return (
                    <motion.span 
                      key={i} 
                      initial={false}
                      animate={{ 
                        color: isTyped ? (isCorrect ? '#d1d0c5' : '#ca4754') : '#646669',
                      }}
                      transition={{ duration: 0 }}
                      className={`relative whitespace-pre ${char === ' ' ? 'w-[0.5em]' : ''}`}
                    >
                      {isCurrent && (
                        <motion.span 
                          layoutId="caret"
                          className="absolute left-0 top-[15%] w-[1.5px] h-[70%] bg-[#e2b714] rounded-full z-10"
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ 
                            opacity: { repeat: Infinity, duration: 0.8, ease: "linear" },
                            default: { type: "spring", stiffness: 3500, damping: 140, mass: 0.1 }
                          }}
                        />
                      )}
                      {char}
                    </motion.span>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center">
              <button 
                onClick={restart}
                className="p-4 hover:text-[#d1d0c5] transition-colors"
                title="Restart"
              >
                <RotateCcw size={24} />
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-16 animate-in fade-in zoom-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12">
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="text-[#646669] uppercase text-sm tracking-[0.2em] font-bold">wpm</div>
                  <div className="text-8xl text-[#e2b714] font-black leading-none">{stats.wpm}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-[#646669] uppercase text-sm tracking-[0.2em] font-bold">acc</div>
                  <div className="text-8xl text-[#e2b714] font-black leading-none">{stats.accuracy}%</div>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-x-12 gap-y-8 w-full">
                <div className="space-y-1">
                  <div className="text-[#646669] uppercase text-xs tracking-widest font-bold">test type</div>
                  <div className="text-[#d1d0c5] text-xl font-medium">time 60</div>
                  <div className="text-[#646669] text-xs">logistics vocabulary</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[#646669] uppercase text-xs tracking-widest font-bold">characters</div>
                  <div className="text-[#d1d0c5] text-xl font-medium">
                    {stats.characters.correct}/
                    <span className="text-[#ca4754]">{stats.characters.incorrect}</span>/
                    <span className="text-[#ca4754]">{stats.characters.extra}</span>/
                    <span className="text-[#ca4754]">{stats.characters.missed}</span>
                  </div>
                  <div className="text-[#646669] text-xs">correct/incorrect/extra/missed</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[#646669] uppercase text-xs tracking-widest font-bold">consistency</div>
                  <div className="text-[#d1d0c5] text-xl font-medium">{stats.consistency}%</div>
                  <div className="text-[#646669] text-xs">based on keystroke variance</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[#646669] uppercase text-xs tracking-widest font-bold">time</div>
                  <div className="text-[#d1d0c5] text-xl font-medium">{stats.timeSpent}s</div>
                  <div className="text-[#646669] text-xs">total duration</div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center pt-8">
              <button 
                onClick={restart}
                className="group flex flex-col items-center gap-4 text-[#646669] hover:text-[#d1d0c5] transition-all"
              >
                <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
                  <RotateCcw size={32} />
                </div>
                <span className="text-xs uppercase tracking-[0.3em] font-bold">Restart Test</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DictionaryPage = ({ subPage }: { subPage?: string }) => {
  const { t, lang } = useContext(LanguageContext);
  const [search, setSearch] = useState('');

  const title = subPage ? t(subPage) : t('dictionary');

  const getData = () => {
    switch (subPage) {
      case 'terms':
        return TERMS;
      case 'glossary':
        return GLOSSARY;
      case 'abbreviations':
        return ABBREVIATIONS;
      default:
        return [...TERMS, ...GLOSSARY, ...ABBREVIATIONS];
    }
  };

  const data = getData();

  const filteredData = data.filter(item => 
    item.en.toLowerCase().includes(search.toLowerCase()) ||
    item.ru.toLowerCase().includes(search.toLowerCase()) ||
    item.uz.toLowerCase().includes(search.toLowerCase()) ||
    item.desc[lang].toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#000033]">{title}</h2>
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
        />
      </div>

      <div className="space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white rounded-2xl border border-zinc-200 shadow-sm hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-zinc-900">{item[lang]}</h3>
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">{item.en}</span>
              </div>
              <p className="text-zinc-600 leading-relaxed">{item.desc[lang]}</p>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 text-zinc-500">
            No results found for "{search}"
          </div>
        )}
      </div>
    </div>
  );
};

const TestsPage = () => {
  const { t, lang } = useContext(LanguageContext);
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [scores, setScores] = useState<Record<number, number>>(() => {
    const saved = localStorage.getItem('logistmate_scores');
    return saved ? JSON.parse(saved) : { 1: 0, 2: 0, 3: 0, 4: 0 };
  });

  const saveScore = (level: number, score: number) => {
    const newScores = { ...scores, [level]: Math.max(scores[level], score) };
    setScores(newScores);
    localStorage.setItem('logistmate_scores', JSON.stringify(newScores));

    // Save activity
    const savedStats = localStorage.getItem('logistmate_stats');
    const statsData = savedStats ? JSON.parse(savedStats) : {};
    const newStats = {
      ...statsData,
      lastActivity: {
        type: 'test',
        level,
        score: `${score}%`,
        time: new Date().toISOString()
      }
    };
    localStorage.setItem('logistmate_stats', JSON.stringify(newStats));
  };

  const startTest = (levelId: number) => {
    setActiveLevel(levelId);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setIsFinished(false);
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < 9) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const levelQuestions = QUESTIONS[activeLevel!];
      let correctCount = 0;
      userAnswers.forEach((answer, index) => {
        if (answer === levelQuestions[index].correctAnswer) {
          correctCount++;
        }
      });
      const finalScore = (correctCount / 10) * 100;
      saveScore(activeLevel!, finalScore);
      setIsFinished(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const resetTest = () => {
    startTest(activeLevel!);
  };

  const exitTest = () => {
    setActiveLevel(null);
    setIsFinished(false);
  };

  const isLevelLocked = (levelId: number) => {
    if (levelId === 1) return false;
    return scores[levelId - 1] < 90;
  };

  const levels = [
    { id: 1, title: t('level1Title'), desc: t('level1Desc') },
    { id: 2, title: t('level2Title'), desc: t('level2Desc') },
    { id: 3, title: t('level3Title'), desc: t('level3Desc') },
    { id: 4, title: t('level4Title'), desc: t('level4Desc') },
  ];

  const averageScore = Math.round((Object.values(scores) as number[]).reduce((a, b) => a + b, 0) / 4);
  const completedLevels = (Object.values(scores) as number[]).filter(s => s >= 90).length;

  if (activeLevel && !isFinished) {
    const question = QUESTIONS[activeLevel][currentQuestionIndex];
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 space-y-8">
        <div className="flex items-center justify-between">
          <button onClick={exitTest} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">{t('backToLevels')}</span>
          </button>
          <div className="text-sm font-bold text-[#000080] bg-blue-50 px-4 py-2 rounded-full">
            {t('level' + activeLevel + 'Title')}
          </div>
        </div>

        <div className="bg-white rounded-[40px] border border-zinc-100 shadow-xl p-10 space-y-10">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                {t('question')} {currentQuestionIndex + 1} {t('of')} 10
              </span>
              <span className="text-sm font-bold text-[#000033]">{Math.round(((currentQuestionIndex + 1) / 10) * 100)}%</span>
            </div>
            <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestionIndex + 1) / 10) * 100}%` }}
                className="h-full bg-[#000080]"
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#000033] leading-tight">
            {question.text[lang]}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                  userAnswers[currentQuestionIndex] === idx
                    ? 'border-[#000080] bg-blue-50/50 text-[#000080]'
                    : 'border-zinc-100 hover:border-zinc-200 text-zinc-600'
                }`}
              >
                <span className="font-medium">{option[lang]}</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  userAnswers[currentQuestionIndex] === idx
                    ? 'border-[#000080] bg-[#000080]'
                    : 'border-zinc-200 group-hover:border-zinc-300'
                }`}>
                  {userAnswers[currentQuestionIndex] === idx && <Check size={14} className="text-white" />}
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-6">
            <button
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                currentQuestionIndex === 0 ? 'text-zinc-300 cursor-not-allowed' : 'text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              <ArrowLeft size={20} />
              {t('previous')}
            </button>
            <button
              onClick={nextQuestion}
              disabled={userAnswers[currentQuestionIndex] === undefined}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${
                userAnswers[currentQuestionIndex] === undefined
                  ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                  : 'bg-[#000080] text-white hover:bg-[#000066] shadow-lg shadow-blue-900/20'
              }`}
            >
              {currentQuestionIndex === 9 ? t('finish') : t('next')}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const levelQuestions = QUESTIONS[activeLevel!];
    let correctCount = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === levelQuestions[index].correctAnswer) {
        correctCount++;
      }
    });
    const currentScore = (correctCount / 10) * 100;
    const passed = currentScore >= 90;

    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-[48px] border border-zinc-100 shadow-2xl p-12 space-y-10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${passed ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                {passed ? <Trophy size={40} /> : <AlertTriangle size={40} />}
              </div>
              <div className="text-left space-y-1">
                <h2 className="text-3xl font-bold text-[#000033]">
                  {passed ? t('congratulations') : t('testResults')}
                </h2>
                <p className="text-zinc-500 font-medium">
                  {passed ? t('level' + activeLevel + 'Title') + ' ' + t('completed') : t('keepLearning')}
                </p>
              </div>
            </div>
            <div className="bg-zinc-50 px-10 py-6 rounded-3xl text-center min-w-[180px]">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">{t('score')}</span>
              <div className={`text-5xl font-black ${passed ? 'text-green-600' : 'text-[#000033]'}`}>
                {currentScore}%
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <h3 className="text-xl font-bold text-[#000033]">Detailed Breakdown</h3>
              <div className="flex gap-4 text-sm font-bold">
                <span className="text-green-600 flex items-center gap-1.5">
                  <CheckCircle2 size={16} /> {correctCount} Correct
                </span>
                <span className="text-rose-500 flex items-center gap-1.5">
                  <XCircle size={16} /> {10 - correctCount} Incorrect
                </span>
              </div>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {levelQuestions.map((q, idx) => {
                const isCorrect = userAnswers[idx] === q.correctAnswer;
                return (
                  <div key={idx} className={`p-6 rounded-2xl border transition-all ${isCorrect ? 'bg-green-50/30 border-green-100' : 'bg-rose-50/30 border-rose-100'}`}>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Question {idx + 1}</span>
                        <p className="font-bold text-[#000033] leading-tight">{q.text[lang]}</p>
                      </div>
                      {isCorrect ? (
                        <div className="bg-green-100 text-green-600 p-1.5 rounded-full">
                          <Check size={16} />
                        </div>
                      ) : (
                        <div className="bg-rose-100 text-rose-600 p-1.5 rounded-full">
                          <X size={16} />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-2 mb-4">
                      {q.options.map((opt, optIdx) => {
                        const isUserAnswer = userAnswers[idx] === optIdx;
                        const isCorrectAnswer = q.correctAnswer === optIdx;
                        
                        let statusClass = 'text-zinc-500 border-zinc-100';
                        if (isCorrectAnswer) statusClass = 'bg-green-500 text-white border-green-500';
                        else if (isUserAnswer && !isCorrect) statusClass = 'bg-rose-500 text-white border-rose-500';

                        return (
                          <div key={optIdx} className={`px-4 py-2.5 rounded-xl border text-sm font-medium flex items-center justify-between ${statusClass}`}>
                            <span>{opt[lang]}</span>
                            {isCorrectAnswer && <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Correct</span>}
                            {isUserAnswer && !isCorrect && <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Your Answer</span>}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className={`p-4 rounded-xl text-sm ${isCorrect ? 'bg-green-100/50 text-green-800' : 'bg-rose-100/50 text-rose-800'}`}>
                        <p className="font-bold mb-1 flex items-center gap-2">
                          <Info size={14} />
                          Explanation
                        </p>
                        <p className="opacity-90">{q.explanation[lang]}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-zinc-100">
            <button 
              onClick={resetTest}
              className="flex items-center justify-center gap-2 py-5 bg-zinc-100 text-zinc-900 font-bold rounded-2xl hover:bg-zinc-200 transition-all"
            >
              <RotateCcw size={20} />
              {t('tryAgain')}
            </button>
            <button 
              onClick={exitTest}
              className="flex items-center justify-center gap-2 py-5 bg-[#000080] text-white font-bold rounded-2xl hover:bg-[#000066] shadow-xl shadow-blue-900/20 transition-all"
            >
              {t('backToLevels')}
              <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-12 bg-zinc-50/50 min-h-screen">
      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-4">
          <span className="text-sm font-medium text-zinc-500">{t('averageScore')}</span>
          <div className="space-y-1">
            <div className="text-4xl font-bold text-[#000033]">{averageScore}%</div>
            <div className="text-xs text-zinc-400 font-medium">{completedLevels} / 4 {t('levelsCompleted')}</div>
          </div>
        </div>
        {[1, 2, 3, 4].map((lvl) => (
          <div key={lvl} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-4">
            <span className="text-sm font-medium text-zinc-500">{t('level' + lvl + 'Score')}</span>
            <div className="space-y-1">
              <div className="text-4xl font-bold text-[#000033]">{scores[lvl]}%</div>
              <div className="text-xs text-zinc-400 font-medium">
                {isLevelLocked(lvl) ? t('locked') : scores[lvl] >= 90 ? t('completed') : t('inProgress')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Level Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {levels.map((level) => {
          const locked = isLevelLocked(level.id);
          const score = scores[level.id];
          
          return (
            <div 
              key={level.id} 
              className={`bg-white rounded-[32px] border border-zinc-100 shadow-sm p-8 flex flex-col justify-between transition-all ${locked ? 'opacity-80' : 'ring-2 ring-blue-600/5'}`}
            >
              <div className="space-y-8">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${locked ? 'bg-zinc-100 text-zinc-400' : 'bg-[#000080] text-white'}`}>
                  {locked ? <Lock size={24} /> : score >= 90 ? <CheckCircle2 size={24} /> : <ClipboardList size={24} />}
                </div>
                
                <div className="space-y-4">
                  <h3 className={`text-2xl font-bold ${locked ? 'text-zinc-400' : 'text-[#000033]'}`}>{level.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{level.desc}</p>
                </div>

                {!locked && (
                  <div className="bg-zinc-50 p-6 rounded-2xl space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{t('yourScore')}</span>
                      <span className="text-2xl font-bold text-[#000033]">{score}%</span>
                    </div>
                    <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        className="h-full bg-blue-600 transition-all duration-1000" 
                      />
                    </div>
                  </div>
                )}

                {locked && (
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                    <p className="text-xs font-medium text-amber-700 leading-relaxed">
                      {t('unlockLevel' + level.id)}
                    </p>
                  </div>
                )}
              </div>

              <button 
                disabled={locked}
                onClick={() => startTest(level.id)}
                className={`mt-12 w-full py-4 rounded-xl font-bold transition-all ${
                  locked 
                    ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed text-xs px-4 leading-tight' 
                    : 'bg-[#000080] text-white hover:bg-[#000066] shadow-lg shadow-blue-900/20'
                }`}
              >
                {locked ? t('lockedButton') : t('startLevel' + level.id)}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SafetyPage = ({ subPage, setActiveTab }: { subPage?: string, setActiveTab: (tab: string) => void }) => {
  const { t } = useContext(LanguageContext);

  const title = subPage ? t(subPage) : t('safety');

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-zinc-900">{title}</h2>
        <p className="text-zinc-600">Professional tools to ensure operational safety and compliance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Safety Basics Link */}
        <div 
          onClick={() => setActiveTab('safety:safetyBasics')}
          className="bg-[#1e293b] p-8 rounded-3xl shadow-xl space-y-6 cursor-pointer hover:scale-[1.02] transition-all group md:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <ShieldCheck size={32} />
              <h3 className="text-2xl font-bold">{t('safetyBasics')}</h3>
            </div>
            <ArrowRight className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-zinc-400 text-lg">
            Master the 7 Behavior Analysis and Safety Improvement Categories (BASICs) used by the FMCSA to ensure road safety and compliance.
          </p>
        </div>

        {/* ELD Link */}
        <div 
          onClick={() => setActiveTab('safety:eld')}
          className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6 cursor-pointer hover:border-blue-500 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-blue-600">
              <Lock size={28} />
              <h3 className="text-2xl font-bold text-zinc-900">{t('eld')}</h3>
            </div>
            <ArrowRight className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-zinc-500">
            Understand the federally mandated electronic system for accurate Hours of Service tracking and compliance.
          </p>
        </div>

        {/* Fleet Management Link */}
        <div 
          onClick={() => setActiveTab('safety:fleetManagement')}
          className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6 cursor-pointer hover:border-blue-500 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-indigo-600">
              <Truck size={28} />
              <h3 className="text-2xl font-bold text-zinc-900">{t('fleetManagementTitle')}</h3>
            </div>
            <ArrowRight className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-zinc-500">
            Master the systematic process of overseeing, coordinating, and optimizing your fleet operations for safety and efficiency.
          </p>
        </div>

        {/* CSA Points Link */}
        <div 
          onClick={() => setActiveTab('safety:csaPoints')}
          className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6 cursor-pointer hover:border-emerald-500 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-emerald-600">
              <BarChart3 size={28} />
              <h3 className="text-2xl font-bold text-zinc-900">{t('csaPoints')}</h3>
            </div>
            <ArrowRight className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-zinc-500">
            Learn how the Compliance, Safety, Accountability (CSA) points system works and how it affects your safety record.
          </p>
        </div>

        {/* Checklist Placeholder */}
        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6 md:col-span-2">
          <div className="flex items-center gap-3 text-amber-600">
            <AlertTriangle size={28} />
            <h3 className="text-2xl font-bold text-zinc-900">{t('safetyChecklist')}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Vehicle inspection completed',
              'Load properly secured',
              'Driver rest hours verified',
              'Hazardous materials labeled',
              'Emergency contact list updated',
              'Route risk assessment done',
            ].map((item, i) => (
              <label key={i} className="flex items-center gap-3 p-3 hover:bg-zinc-50 rounded-xl cursor-pointer transition-colors">
                <input type="checkbox" className="w-5 h-5 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-zinc-700 font-medium">{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolsPage = ({ subPage }: { subPage?: string }) => {
  const { t } = useContext(LanguageContext);
  const title = subPage ? t(subPage) : t('tools');

  if (subPage === 'mappingGame') {
    return <MappingGame />;
  }
  
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-center space-y-6">
      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
        <Wrench size={40} />
      </div>
      <h2 className="text-3xl font-bold text-zinc-900">{title}</h2>
      <p className="text-zinc-600 max-w-lg mx-auto">
        This tool is currently under development. Logistmate is working hard to bring you professional-grade resources for logistics management.
      </p>
      <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-white border border-zinc-100 rounded-3xl shadow-sm text-left space-y-2">
          <h4 className="font-bold text-zinc-900">Coming Soon</h4>
          <p className="text-sm text-zinc-500">Interactive features and data-driven insights for {title.toLowerCase()}.</p>
        </div>
        <div className="p-6 bg-zinc-50 border border-dashed border-zinc-200 rounded-3xl flex items-center justify-center text-zinc-400 font-medium">
          Feature Placeholder
        </div>
      </div>
    </div>
  );
};

const OtherPage = ({ subPage }: { subPage?: string }) => {
  const { t } = useContext(LanguageContext);
  const title = subPage ? t(subPage) : t('other');
  
  const getDescription = () => {
    if (subPage === 'accounting') return t('accountingDesc');
    if (subPage === 'driverHiring') return t('driverHiringDesc');
    if (subPage === 'update') return t('updateFieldDesc');
    if (subPage === 'dispatch') return t('dispatchFieldDesc');
    return `Additional resources, partner links, and platform information for ${title.toLowerCase()} will be available here soon. Stay tuned for updates on Logistmate.`;
  };

  const renderFormattedDescription = (text: string) => {
    return text.split('\n\n').map((paragraph, pIdx) => {
      if (paragraph.includes('•') || paragraph.match(/^\d\./m)) {
        const items = paragraph.split('\n');
        return (
          <ul key={pIdx} className="space-y-4 my-6">
            {items.map((item, iIdx) => {
              const cleanItem = item.replace(/^[•\d\.]\s*/, '');
              const [boldPart, ...rest] = cleanItem.split(': ');
              return (
                <li key={iIdx} className="flex gap-4 text-left">
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-[#000080] flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                    {iIdx + 1}
                  </div>
                  <p className="text-zinc-600 leading-relaxed">
                    {rest.length > 0 ? (
                      <>
                        <span className="font-bold text-zinc-900">{boldPart}:</span> {rest.join(': ')}
                      </>
                    ) : cleanItem}
                  </p>
                </li>
              );
            })}
          </ul>
        );
      }
      return (
        <p key={pIdx} className="text-zinc-600 text-lg leading-relaxed text-left mb-6">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 space-y-12">
      <div className="text-center space-y-6">
        <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center mx-auto text-[#000080] shadow-inner">
          {subPage === 'accounting' && <Calculator size={48} />}
          {subPage === 'driverHiring' && <Users size={48} />}
          {subPage === 'update' && <Activity size={48} />}
          {subPage === 'dispatch' && <Truck size={48} />}
          {!subPage && <Info size={48} />}
        </div>
        <div className="space-y-4">
          <h2 className="text-5xl font-black text-[#000033] tracking-tight">{title}</h2>
          <div className="h-1.5 w-24 bg-[#000080] mx-auto rounded-full" />
        </div>
      </div>

      <div className="bg-white rounded-[48px] border border-zinc-100 shadow-2xl p-8 md:p-16">
        <div className="prose prose-zinc max-w-none">
          {renderFormattedDescription(getDescription())}
        </div>

        {subPage && (
          <div className="mt-16 pt-12 border-t border-zinc-100">
            <div className="bg-zinc-50 p-10 rounded-[40px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
              <h4 className="font-bold text-[#000033] text-xl mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600">
                  <ShieldCheck size={24} />
                </div>
                Professional Insight
              </h4>
              <p className="text-zinc-600 text-lg leading-relaxed">
                Mastering {title.toLowerCase()} is key to operational excellence in the logistics industry. 
                Keep studying and practicing with our interactive tools to build your expertise and advance your career.
              </p>
            </div>
          </div>
        )}
      </div>

      {!subPage && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['About Us', 'Contact', 'Privacy', 'Terms'].map(link => (
            <button key={link} className="p-6 bg-white border border-zinc-100 rounded-[24px] text-zinc-600 font-bold hover:border-[#000080] hover:text-[#000080] hover:shadow-xl hover:shadow-blue-900/5 transition-all">
              {link}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminProtectedPage = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { t } = useContext(LanguageContext);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center space-y-8">
        <div className="w-24 h-24 bg-red-50 rounded-[32px] flex items-center justify-center mx-auto text-red-600 shadow-inner">
          <Shield size={48} />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-[#000033] tracking-tight">Access Denied</h2>
          <p className="text-zinc-600 text-lg max-w-lg mx-auto">
            You do not have the required permissions to view this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const ProtectedPage = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { t } = useContext(LanguageContext);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center space-y-8">
        <div className="w-24 h-24 bg-amber-50 rounded-[32px] flex items-center justify-center mx-auto text-amber-600 shadow-inner">
          <Lock size={48} />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-[#000033] tracking-tight">{t('authRequired')}</h2>
          <p className="text-zinc-600 text-lg max-w-lg mx-auto">
            {t('authRequiredDesc')}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => {
              setAuthMode('login');
              setIsAuthModalOpen(true);
            }}
            className="px-8 py-4 bg-[#000080] text-white font-bold rounded-2xl hover:bg-[#000066] transition-all shadow-xl shadow-blue-900/20"
          >
            {t('signIn')}
          </button>
          <button 
            onClick={() => {
              setAuthMode('signup');
              setIsAuthModalOpen(true);
            }}
            className="px-8 py-4 bg-white border border-zinc-200 text-zinc-900 font-bold rounded-2xl hover:bg-zinc-50 transition-all"
          >
            {t('signUp')}
          </button>
        </div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialMode={authMode} />
      </div>
    );
  }

  return <>{children}</>;
};

const DashboardPage = () => {
  const { t } = useContext(LanguageContext);
  const { user } = useAuth();
  
  const [scores, setScores] = useState<Record<number, number>>(() => {
    const saved = localStorage.getItem('logistmate_scores');
    return saved ? JSON.parse(saved) : { 1: 0, 2: 0, 3: 0, 4: 0 };
  });

  const [statsData, setStatsData] = useState<any>(() => {
    const saved = localStorage.getItem('logistmate_stats');
    return saved ? JSON.parse(saved) : {};
  });

  const completedTests = (Object.values(scores) as number[]).filter(s => s > 0).length;
  const avgScore = completedTests > 0 
    ? Math.round((Object.values(scores) as number[]).reduce((a: number, b: number) => a + b, 0) / completedTests) 
    : 0;
  
  const progress = Math.round((completedTests / 4) * 100);

  const achievements = [];
  if (completedTests >= 1) achievements.push({ title: 'First Step', desc: 'Completed your first test', icon: Zap });
  if (completedTests === 4) achievements.push({ title: 'Test Master', desc: 'Completed all levels', icon: Trophy });
  if ((statsData.mappingHighScore || 0) > 0) achievements.push({ title: 'Geography Expert', desc: 'Played Mapping Game', icon: Globe });
  if ((statsData.typingBestWPM || 0) > 60) achievements.push({ title: 'Typing Pro', desc: 'Reached 60+ WPM', icon: Activity });

  const stats = [
    { label: t('yourProgress'), value: `${progress}%`, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: t('achievements'), value: achievements.length.toString(), icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Avg. Test Score', value: `${avgScore}%`, icon: ClipboardList, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const lastActivity = statsData.lastActivity ? [
    { 
      title: statsData.lastActivity.type === 'test' 
        ? `Completed Level ${statsData.lastActivity.level} Test` 
        : statsData.lastActivity.type === 'mapping_game' 
          ? 'Played Mapping Game' 
          : 'Played Typing Game',
      time: formatTime(statsData.lastActivity.time),
      score: statsData.lastActivity.score
    }
  ] : [];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-12">
      <div className="bg-[#1e293b] rounded-[32px] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <h1 className="text-4xl font-black tracking-tight">{t('welcomeBack')}, {user?.displayName || 'User'}!</h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Track your learning progress, review your test scores, and continue your journey to becoming a logistics professional.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <UserIcon size={400} className="translate-x-1/4 -translate-y-1/4" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm flex items-center gap-6">
            <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-zinc-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white rounded-[32px] border border-zinc-100 shadow-sm p-10 space-y-8">
          <h2 className="text-2xl font-bold text-[#000033] flex items-center gap-3">
            <Activity size={24} className="text-blue-600" />
            {t('recentActivity')}
          </h2>
          <div className="space-y-6">
            {lastActivity.length > 0 ? lastActivity.map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-zinc-50 rounded-2xl transition-colors border border-transparent hover:border-zinc-100">
                <div className="space-y-1">
                  <p className="font-bold text-zinc-900">{activity.title}</p>
                  <p className="text-xs text-zinc-400">{activity.time}</p>
                </div>
                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                  {activity.score}
                </span>
              </div>
            )) : (
              <div className="text-center py-12 text-zinc-400">
                No recent activity. Start learning to see your progress!
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-zinc-100 shadow-sm p-10 space-y-8">
          <h2 className="text-2xl font-bold text-[#000033] flex items-center gap-3">
            <Trophy size={24} className="text-amber-600" />
            {t('achievements')}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {achievements.length > 0 ? achievements.map((achievement, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-amber-600">
                  <achievement.icon size={24} />
                </div>
                <div>
                  <p className="font-bold text-zinc-900">{achievement.title}</p>
                  <p className="text-xs text-zinc-400">{achievement.desc}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 text-zinc-400">
                Complete tests and games to earn achievements!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const AppContent = () => {
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState('home');
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
  const { user } = useAuth();
  const prevUserRole = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (user?.role === 'admin' && prevUserRole.current !== 'admin') {
      setActiveTab('students');
    }
    prevUserRole.current = user?.role;
  }, [user]);

  const t = (key: string) => {
    return translations[key]?.[lang] || key;
  };

  const renderContent = () => {
    // Strict separation: Admins only see the Admin Portal
    if (user?.role === 'admin') {
      const adminTab = ['students', 'progress', 'settings'].includes(activeTab) ? activeTab : 'students';
      return <AdminProtectedPage><AdminPortal activeTab={adminTab as any} /></AdminProtectedPage>;
    }

    // Main website content for regular users
    if (activeTab.startsWith('dictionary:')) {
      const sub = activeTab.split(':')[1];
      return <DictionaryPage subPage={sub} />;
    }
    if (activeTab.startsWith('safety:')) {
      const sub = activeTab.split(':')[1];
      if (sub === 'safetyBasics') return <SafetyBasicsPage />;
      if (sub === 'eld') return <ELDPage />;
      if (sub === 'fleetManagement') return <FleetManagementPage />;
      if (sub === 'csaPoints') return <CsaPointsPage />;
      return <SafetyPage subPage={sub} setActiveTab={setActiveTab} />;
    }
    if (activeTab.startsWith('tools:')) {
      const sub = activeTab.split(':')[1];
      if (sub === 'mapTimeZones') return <MapTimeZonesPage />;
      if (sub === 'truckTypes') return <TrucksPage />;
      if (sub === 'mappingGame') return <MappingGame />;
      if (sub === 'typingGame') return <TypingGamePage />;
      return <ToolsPage subPage={sub} />;
    }
    if (activeTab.startsWith('other:')) {
      const sub = activeTab.split(':')[1];
      return <OtherPage subPage={sub} />;
    }
    switch (activeTab) {
      case 'home': return <HomePage />;
      case 'tests': return <TestsPage />;
      case 'dashboard': return <ProtectedPage><DashboardPage /></ProtectedPage>;
      case 'dictionary': return <DictionaryPage />;
      case 'safety': return <SafetyPage setActiveTab={setActiveTab} />;
      case 'tools': return <ToolsPage />;
      case 'other': return <OtherPage />;
      default: return <HomePage />;
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <div className={`min-h-screen transition-colors duration-500 ${activeTab === 'tools:typingGame' ? 'bg-[#323437]' : 'bg-white'} font-sans text-zinc-900`}>
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        {user?.role !== 'admin' && (
          <footer className={`transition-colors duration-500 ${activeTab === 'tools:typingGame' ? 'bg-[#2c2e31]' : 'bg-[#000033]'} text-white py-24`}>
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="space-y-6">
                <div className="flex items-center">
                  <span className="text-xl font-black tracking-tight">
                    LOGIST<span className="text-blue-400">MATE</span>
                  </span>
                </div>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  {t('aboutText')}
                </p>
              </div>
              <div className="space-y-6">
                <h4 className="text-lg font-bold tracking-widest">{t('quickLinks')}</h4>
                <ul className="space-y-4 text-sm text-zinc-400">
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setActiveTab('tests')}>{t('tests')}</li>
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setActiveTab('dictionary')}>{t('glossary')}</li>
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setActiveTab('safety:safetyBasics')}>{t('safetyBasics')}</li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-lg font-bold tracking-widest">{t('contact')}</h4>
                <ul className="space-y-4 text-sm text-zinc-400">
                  <li>+998 95 727 00 17</li>
                  <li>+998 90 553 90 95</li>
                  <li>studybigi@gmail.com</li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-lg font-bold tracking-widest">{t('learning')}</h4>
                <ul className="space-y-4 text-sm text-zinc-400">
                  <li>{t('difficultyLevels')}</li>
                  <li>Interactive Tests</li>
                  <li>Comprehensive Glossary</li>
                  <li>Multilingual Support</li>
                </ul>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-white/10 text-center">
              <p className="text-xs text-zinc-500">© {new Date().getFullYear()} Logistmate Platform. All rights reserved.</p>
            </div>
          </footer>
        )}
        {/* AI Assistant Sidebar */}
        <AnimatePresence>
          {isAISidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAISidebarOpen(false)}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
              />
              {/* Sidebar */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
              >
                <div className="flex-1 overflow-hidden flex flex-col">
                  <AIChatAssistant 
                    mode="widget" 
                    onClose={() => setIsAISidebarOpen(false)} 
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Floating AI Button */}
        {user?.role !== 'admin' && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsAISidebarOpen(true)}
            className="fixed bottom-8 right-8 w-16 h-16 bg-[#000080] text-white rounded-2xl shadow-2xl flex items-center justify-center z-50 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Bot size={32} className="relative z-10" />
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-white/10 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500"
            />
          </motion.button>
        )}
      </div>
    </LanguageContext.Provider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
