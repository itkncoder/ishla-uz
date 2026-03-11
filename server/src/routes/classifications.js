import { Router } from 'express'

const router = Router()

const INDUSTRIES = [
  { id: 'construction', label: 'Строительство', labelEn: 'Construction', labelUz: 'Qurilish' },
  { id: 'manufacturing', label: 'Производство', labelEn: 'Manufacturing', labelUz: 'Ishlab chiqarish' },
  { id: 'hospitality', label: 'Гостиничный бизнес', labelEn: 'Hospitality', labelUz: 'Mehmonxona biznesi' },
  { id: 'agriculture', label: 'Сельское хозяйство', labelEn: 'Agriculture', labelUz: 'Qishloq xo\'jaligi' },
  { id: 'healthcare', label: 'Здравоохранение', labelEn: 'Healthcare', labelUz: 'Sog\'liqni saqlash' },
  { id: 'logistics', label: 'Логистика', labelEn: 'Logistics', labelUz: 'Logistika' },
  { id: 'it', label: 'Информационные технологии', labelEn: 'IT', labelUz: 'Axborot texnologiyalari' },
  { id: 'retail', label: 'Розничная торговля', labelEn: 'Retail', labelUz: 'Chakana savdo' },
]

const SPECIALIZATIONS = {
  construction: [
    { label: 'Каменщик', labelEn: 'Bricklayer', labelUz: 'G\'isht teruvchi' },
    { label: 'Электрик', labelEn: 'Electrician', labelUz: 'Elektrik' },
    { label: 'Сварщик', labelEn: 'Welder', labelUz: 'Payvandchi' },
    { label: 'Плотник', labelEn: 'Carpenter', labelUz: 'Duradgor' },
    { label: 'Маляр', labelEn: 'Painter', labelUz: 'Bo\'yoqchi' },
    { label: 'Сантехник', labelEn: 'Plumber', labelUz: 'Santexnik' },
  ],
  manufacturing: [
    { label: 'Оператор станка', labelEn: 'Machine Operator', labelUz: 'Stanok operatori' },
    { label: 'Сборщик', labelEn: 'Assembler', labelUz: 'Yig\'uvchi' },
    { label: 'Контролёр качества', labelEn: 'Quality Inspector', labelUz: 'Sifat nazoratchisi' },
    { label: 'Упаковщик', labelEn: 'Packer', labelUz: 'Qadoqlovchi' },
  ],
  hospitality: [
    { label: 'Повар', labelEn: 'Cook', labelUz: 'Oshpaz' },
    { label: 'Официант', labelEn: 'Waiter', labelUz: 'Ofitsiant' },
    { label: 'Горничная', labelEn: 'Housekeeper', labelUz: 'Xizmatkor' },
    { label: 'Администратор', labelEn: 'Receptionist', labelUz: 'Administrator' },
    { label: 'Бармен', labelEn: 'Bartender', labelUz: 'Barmen' },
  ],
  agriculture: [
    { label: 'Фермер', labelEn: 'Farmer', labelUz: 'Fermer' },
    { label: 'Тракторист', labelEn: 'Tractor Driver', labelUz: 'Traktorchi' },
    { label: 'Сборщик урожая', labelEn: 'Harvester', labelUz: 'Hosil yig\'uvchi' },
    { label: 'Садовник', labelEn: 'Gardener', labelUz: 'Bog\'bon' },
  ],
  healthcare: [
    { label: 'Медсестра', labelEn: 'Nurse', labelUz: 'Hamshira' },
    { label: 'Санитар', labelEn: 'Orderly', labelUz: 'Sanitar' },
    { label: 'Лаборант', labelEn: 'Lab Technician', labelUz: 'Laborant' },
    { label: 'Фармацевт', labelEn: 'Pharmacist', labelUz: 'Farmatsevt' },
  ],
  logistics: [
    { label: 'Водитель', labelEn: 'Driver', labelUz: 'Haydovchi' },
    { label: 'Грузчик', labelEn: 'Loader', labelUz: 'Yukchi' },
    { label: 'Кладовщик', labelEn: 'Warehouse Keeper', labelUz: 'Omborchi' },
    { label: 'Экспедитор', labelEn: 'Freight Forwarder', labelUz: 'Ekspeditor' },
  ],
  it: [
    { label: 'Программист', labelEn: 'Programmer', labelUz: 'Dasturchi' },
    { label: 'Тестировщик', labelEn: 'QA Tester', labelUz: 'Tester' },
    { label: 'Системный администратор', labelEn: 'System Admin', labelUz: 'Tizim administratori' },
  ],
  retail: [
    { label: 'Продавец', labelEn: 'Salesperson', labelUz: 'Sotuvchi' },
    { label: 'Кассир', labelEn: 'Cashier', labelUz: 'Kassir' },
    { label: 'Мерчандайзер', labelEn: 'Merchandiser', labelUz: 'Merchandayzer' },
  ],
}

const SKILLS = [
  'Сварка', 'Электромонтаж', 'Кладка', 'Штукатурка', 'Покраска',
  'Готовка', 'Обслуживание клиентов', 'Вождение', 'Первая помощь',
  'MS Office', 'Английский язык', 'Русский язык', 'Арабский язык',
  'Управление техникой', 'Уборка', 'Организация склада',
]

const LANGUAGES = [
  { id: 'uz', label: 'Узбекский', labelEn: 'Uzbek', labelUz: 'O\'zbek tili' },
  { id: 'ru', label: 'Русский', labelEn: 'Russian', labelUz: 'Rus tili' },
  { id: 'en', label: 'Английский', labelEn: 'English', labelUz: 'Ingliz tili' },
  { id: 'ar', label: 'Арабский', labelEn: 'Arabic', labelUz: 'Arab tili' },
  { id: 'ko', label: 'Корейский', labelEn: 'Korean', labelUz: 'Koreys tili' },
  { id: 'tr', label: 'Турецкий', labelEn: 'Turkish', labelUz: 'Turk tili' },
  { id: 'de', label: 'Немецкий', labelEn: 'German', labelUz: 'Nemis tili' },
  { id: 'ja', label: 'Японский', labelEn: 'Japanese', labelUz: 'Yapon tili' },
]

const LANGUAGE_LEVELS = [
  { value: 'basic', label: 'Начальный', labelEn: 'Basic', labelUz: 'Boshlang\'ich' },
  { value: 'intermediate', label: 'Средний', labelEn: 'Intermediate', labelUz: 'O\'rta' },
  { value: 'advanced', label: 'Продвинутый', labelEn: 'Advanced', labelUz: 'Yuqori' },
  { value: 'fluent', label: 'Свободный', labelEn: 'Fluent', labelUz: 'Erkin' },
]

const COUNTRIES = [
  { id: 'af', label: 'Афганистан', labelEn: 'Afghanistan', labelUz: 'Afgʻoniston' },
  { id: 'al', label: 'Албания', labelEn: 'Albania', labelUz: 'Albaniya' },
  { id: 'dz', label: 'Алжир', labelEn: 'Algeria', labelUz: 'Jazoir' },
  { id: 'ad', label: 'Андорра', labelEn: 'Andorra', labelUz: 'Andorra' },
  { id: 'ao', label: 'Ангола', labelEn: 'Angola', labelUz: 'Angola' },
  { id: 'ar', label: 'Аргентина', labelEn: 'Argentina', labelUz: 'Argentina' },
  { id: 'am', label: 'Армения', labelEn: 'Armenia', labelUz: 'Armaniston' },
  { id: 'au', label: 'Австралия', labelEn: 'Australia', labelUz: 'Avstraliya' },
  { id: 'at', label: 'Австрия', labelEn: 'Austria', labelUz: 'Avstriya' },
  { id: 'az', label: 'Азербайджан', labelEn: 'Azerbaijan', labelUz: 'Ozarbayjon' },
  { id: 'bh', label: 'Бахрейн', labelEn: 'Bahrain', labelUz: 'Bahrayn' },
  { id: 'bd', label: 'Бангладеш', labelEn: 'Bangladesh', labelUz: 'Bangladesh' },
  { id: 'by', label: 'Беларусь', labelEn: 'Belarus', labelUz: 'Belarus' },
  { id: 'be', label: 'Бельгия', labelEn: 'Belgium', labelUz: 'Belgiya' },
  { id: 'br', label: 'Бразилия', labelEn: 'Brazil', labelUz: 'Braziliya' },
  { id: 'bn', label: 'Бруней', labelEn: 'Brunei', labelUz: 'Bruney' },
  { id: 'bg', label: 'Болгария', labelEn: 'Bulgaria', labelUz: 'Bolgariya' },
  { id: 'kh', label: 'Камбоджа', labelEn: 'Cambodia', labelUz: 'Kambodja' },
  { id: 'ca', label: 'Канада', labelEn: 'Canada', labelUz: 'Kanada' },
  { id: 'cl', label: 'Чили', labelEn: 'Chile', labelUz: 'Chili' },
  { id: 'cn', label: 'Китай', labelEn: 'China', labelUz: 'Xitoy' },
  { id: 'co', label: 'Колумбия', labelEn: 'Colombia', labelUz: 'Kolumbiya' },
  { id: 'hr', label: 'Хорватия', labelEn: 'Croatia', labelUz: 'Xorvatiya' },
  { id: 'cu', label: 'Куба', labelEn: 'Cuba', labelUz: 'Kuba' },
  { id: 'cy', label: 'Кипр', labelEn: 'Cyprus', labelUz: 'Kipr' },
  { id: 'cz', label: 'Чехия', labelEn: 'Czech Republic', labelUz: 'Chexiya' },
  { id: 'dk', label: 'Дания', labelEn: 'Denmark', labelUz: 'Daniya' },
  { id: 'eg', label: 'Египет', labelEn: 'Egypt', labelUz: 'Misr' },
  { id: 'ee', label: 'Эстония', labelEn: 'Estonia', labelUz: 'Estoniya' },
  { id: 'et', label: 'Эфиопия', labelEn: 'Ethiopia', labelUz: 'Efiopiya' },
  { id: 'fi', label: 'Финляндия', labelEn: 'Finland', labelUz: 'Finlandiya' },
  { id: 'fr', label: 'Франция', labelEn: 'France', labelUz: 'Fransiya' },
  { id: 'ge', label: 'Грузия', labelEn: 'Georgia', labelUz: 'Gruziya' },
  { id: 'de', label: 'Германия', labelEn: 'Germany', labelUz: 'Germaniya' },
  { id: 'gh', label: 'Гана', labelEn: 'Ghana', labelUz: 'Gana' },
  { id: 'gr', label: 'Греция', labelEn: 'Greece', labelUz: 'Gretsiya' },
  { id: 'hk', label: 'Гонконг', labelEn: 'Hong Kong', labelUz: 'Gonkong' },
  { id: 'hu', label: 'Венгрия', labelEn: 'Hungary', labelUz: 'Vengriya' },
  { id: 'is', label: 'Исландия', labelEn: 'Iceland', labelUz: 'Islandiya' },
  { id: 'in', label: 'Индия', labelEn: 'India', labelUz: 'Hindiston' },
  { id: 'id', label: 'Индонезия', labelEn: 'Indonesia', labelUz: 'Indoneziya' },
  { id: 'ir', label: 'Иран', labelEn: 'Iran', labelUz: 'Eron' },
  { id: 'iq', label: 'Ирак', labelEn: 'Iraq', labelUz: 'Iroq' },
  { id: 'ie', label: 'Ирландия', labelEn: 'Ireland', labelUz: 'Irlandiya' },
  { id: 'il', label: 'Израиль', labelEn: 'Israel', labelUz: 'Isroil' },
  { id: 'it', label: 'Италия', labelEn: 'Italy', labelUz: 'Italiya' },
  { id: 'jp', label: 'Япония', labelEn: 'Japan', labelUz: 'Yaponiya' },
  { id: 'jo', label: 'Иордания', labelEn: 'Jordan', labelUz: 'Iordaniya' },
  { id: 'kz', label: 'Казахстан', labelEn: 'Kazakhstan', labelUz: 'Qozogʻiston' },
  { id: 'ke', label: 'Кения', labelEn: 'Kenya', labelUz: 'Keniya' },
  { id: 'kr', label: 'Южная Корея', labelEn: 'South Korea', labelUz: 'Janubiy Koreya' },
  { id: 'kw', label: 'Кувейт', labelEn: 'Kuwait', labelUz: 'Quvayt' },
  { id: 'kg', label: 'Кыргызстан', labelEn: 'Kyrgyzstan', labelUz: 'Qirgʻiziston' },
  { id: 'lv', label: 'Латвия', labelEn: 'Latvia', labelUz: 'Latviya' },
  { id: 'lb', label: 'Ливан', labelEn: 'Lebanon', labelUz: 'Livan' },
  { id: 'ly', label: 'Ливия', labelEn: 'Libya', labelUz: 'Liviya' },
  { id: 'lt', label: 'Литва', labelEn: 'Lithuania', labelUz: 'Litva' },
  { id: 'lu', label: 'Люксембург', labelEn: 'Luxembourg', labelUz: 'Lyuksemburg' },
  { id: 'my', label: 'Малайзия', labelEn: 'Malaysia', labelUz: 'Malayziya' },
  { id: 'mx', label: 'Мексика', labelEn: 'Mexico', labelUz: 'Meksika' },
  { id: 'md', label: 'Молдова', labelEn: 'Moldova', labelUz: 'Moldova' },
  { id: 'mn', label: 'Монголия', labelEn: 'Mongolia', labelUz: 'Moʻgʻuliston' },
  { id: 'me', label: 'Черногория', labelEn: 'Montenegro', labelUz: 'Chernogoriya' },
  { id: 'ma', label: 'Марокко', labelEn: 'Morocco', labelUz: 'Marokash' },
  { id: 'mm', label: 'Мьянма', labelEn: 'Myanmar', labelUz: 'Myanma' },
  { id: 'np', label: 'Непал', labelEn: 'Nepal', labelUz: 'Nepal' },
  { id: 'nl', label: 'Нидерланды', labelEn: 'Netherlands', labelUz: 'Niderlandiya' },
  { id: 'nz', label: 'Новая Зеландия', labelEn: 'New Zealand', labelUz: 'Yangi Zelandiya' },
  { id: 'ng', label: 'Нигерия', labelEn: 'Nigeria', labelUz: 'Nigeriya' },
  { id: 'no', label: 'Норвегия', labelEn: 'Norway', labelUz: 'Norvegiya' },
  { id: 'om', label: 'Оман', labelEn: 'Oman', labelUz: 'Ummon' },
  { id: 'pk', label: 'Пакистан', labelEn: 'Pakistan', labelUz: 'Pokiston' },
  { id: 'pa', label: 'Панама', labelEn: 'Panama', labelUz: 'Panama' },
  { id: 'pe', label: 'Перу', labelEn: 'Peru', labelUz: 'Peru' },
  { id: 'ph', label: 'Филиппины', labelEn: 'Philippines', labelUz: 'Filippin' },
  { id: 'pl', label: 'Польша', labelEn: 'Poland', labelUz: 'Polsha' },
  { id: 'pt', label: 'Португалия', labelEn: 'Portugal', labelUz: 'Portugaliya' },
  { id: 'qa', label: 'Катар', labelEn: 'Qatar', labelUz: 'Qatar' },
  { id: 'ro', label: 'Румыния', labelEn: 'Romania', labelUz: 'Ruminiya' },
  { id: 'ru', label: 'Россия', labelEn: 'Russia', labelUz: 'Rossiya' },
  { id: 'sa', label: 'Саудовская Аравия', labelEn: 'Saudi Arabia', labelUz: 'Saudiya Arabistoni' },
  { id: 'rs', label: 'Сербия', labelEn: 'Serbia', labelUz: 'Serbiya' },
  { id: 'sg', label: 'Сингапур', labelEn: 'Singapore', labelUz: 'Singapur' },
  { id: 'sk', label: 'Словакия', labelEn: 'Slovakia', labelUz: 'Slovakiya' },
  { id: 'si', label: 'Словения', labelEn: 'Slovenia', labelUz: 'Sloveniya' },
  { id: 'za', label: 'Южная Африка', labelEn: 'South Africa', labelUz: 'Janubiy Afrika' },
  { id: 'es', label: 'Испания', labelEn: 'Spain', labelUz: 'Ispaniya' },
  { id: 'lk', label: 'Шри-Ланка', labelEn: 'Sri Lanka', labelUz: 'Shri-Lanka' },
  { id: 'se', label: 'Швеция', labelEn: 'Sweden', labelUz: 'Shvetsiya' },
  { id: 'ch', label: 'Швейцария', labelEn: 'Switzerland', labelUz: 'Shveytsariya' },
  { id: 'sy', label: 'Сирия', labelEn: 'Syria', labelUz: 'Suriya' },
  { id: 'tw', label: 'Тайвань', labelEn: 'Taiwan', labelUz: 'Tayvan' },
  { id: 'tj', label: 'Таджикистан', labelEn: 'Tajikistan', labelUz: 'Tojikiston' },
  { id: 'tz', label: 'Танзания', labelEn: 'Tanzania', labelUz: 'Tanzaniya' },
  { id: 'th', label: 'Таиланд', labelEn: 'Thailand', labelUz: 'Tailand' },
  { id: 'tn', label: 'Тунис', labelEn: 'Tunisia', labelUz: 'Tunis' },
  { id: 'tr', label: 'Турция', labelEn: 'Turkey', labelUz: 'Turkiya' },
  { id: 'tm', label: 'Туркменистан', labelEn: 'Turkmenistan', labelUz: 'Turkmaniston' },
  { id: 'ua', label: 'Украина', labelEn: 'Ukraine', labelUz: 'Ukraina' },
  { id: 'ae', label: 'ОАЭ', labelEn: 'UAE', labelUz: 'BAA' },
  { id: 'gb', label: 'Великобритания', labelEn: 'United Kingdom', labelUz: 'Buyuk Britaniya' },
  { id: 'us', label: 'США', labelEn: 'United States', labelUz: 'AQSh' },
  { id: 'uz', label: 'Узбекистан', labelEn: 'Uzbekistan', labelUz: 'Oʻzbekiston' },
  { id: 've', label: 'Венесуэла', labelEn: 'Venezuela', labelUz: 'Venesuela' },
  { id: 'vn', label: 'Вьетнам', labelEn: 'Vietnam', labelUz: 'Vyetnam' },
  { id: 'ye', label: 'Йемен', labelEn: 'Yemen', labelUz: 'Yaman' },
]

const REGIONS_UZ = [
  { id: 'tashkent', label: 'Ташкент', labelEn: 'Tashkent', labelUz: 'Toshkent' },
  { id: 'samarkand', label: 'Самарканд', labelEn: 'Samarkand', labelUz: 'Samarqand' },
  { id: 'bukhara', label: 'Бухара', labelEn: 'Bukhara', labelUz: 'Buxoro' },
  { id: 'fergana', label: 'Фергана', labelEn: 'Fergana', labelUz: 'Farg\'ona' },
  { id: 'andijan', label: 'Андижан', labelEn: 'Andijan', labelUz: 'Andijon' },
  { id: 'namangan', label: 'Наманган', labelEn: 'Namangan', labelUz: 'Namangan' },
  { id: 'khorezm', label: 'Хорезм', labelEn: 'Khorezm', labelUz: 'Xorazm' },
  { id: 'navoi', label: 'Навои', labelEn: 'Navoi', labelUz: 'Navoiy' },
  { id: 'kashkadarya', label: 'Кашкадарья', labelEn: 'Kashkadarya', labelUz: 'Qashqadaryo' },
  { id: 'surkhandarya', label: 'Сурхандарья', labelEn: 'Surkhandarya', labelUz: 'Surxondaryo' },
  { id: 'jizzakh', label: 'Джизак', labelEn: 'Jizzakh', labelUz: 'Jizzax' },
  { id: 'syrdarya', label: 'Сырдарья', labelEn: 'Syrdarya', labelUz: 'Sirdaryo' },
  { id: 'karakalpakstan', label: 'Каракалпакстан', labelEn: 'Karakalpakstan', labelUz: 'Qoraqalpog\'iston' },
]

// GET /api/classifications
router.get('/', (req, res) => {
  res.json({
    industries: INDUSTRIES,
    specializations: SPECIALIZATIONS,
    skills: SKILLS,
    languages: LANGUAGES,
    languageLevels: LANGUAGE_LEVELS,
    countries: COUNTRIES,
    regions: REGIONS_UZ,
  })
})

router.get('/industries', (req, res) => res.json(INDUSTRIES))
router.get('/specializations', (req, res) => res.json(SPECIALIZATIONS))
router.get('/skills', (req, res) => res.json(SKILLS))
router.get('/languages', (req, res) => res.json(LANGUAGES))
router.get('/countries', (req, res) => res.json(COUNTRIES))
router.get('/regions', (req, res) => res.json(REGIONS_UZ))

export default router
