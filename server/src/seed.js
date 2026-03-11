import 'dotenv/config'
import prisma from './lib/prisma.js'

const USERS = [
  { name: 'Азиз Каримов', email: 'candidate@ishla.uz', role: 'candidate' },
  { name: 'Gulf Construction LLC', email: 'employer@ishla.uz', role: 'employer' },
  { name: 'Рустам Файзуллаев', email: 'recruiter@ishla.uz', role: 'recruiter' },
  { name: 'Бахтиёр Мирзаев', email: 'manager@ishla.uz', role: 'senior_manager' },
  { name: 'Дильноза Рахимова', email: 'visa@ishla.uz', role: 'visa_officer' },
  { name: 'Admin', email: 'admin@ishla.uz', role: 'admin' },
  { name: 'UzStaff Agency', email: 'agency@ishla.uz', role: 'agency' },
]

const CANDIDATES = [
  { displayId: 2847, name: 'Азизбек Каримов', email: 'aziz.karimov@mail.uz', phone: '+998901234567', dob: '1995-03-15', gender: 'male', region: 'Ташкент', district: 'Юнусабад', address: 'ул. Амира Темура, 45', industry: 'construction', specialization: 'Сварщик', experienceYears: 5, skills: ['Сварка', 'Электромонтаж', 'Управление техникой'], languages: [{ id: 'uz', level: 'fluent' }, { id: 'ru', level: 'advanced' }, { id: 'en', level: 'basic' }], education: [{ institution: 'Ташкентский политехнический университет', degree: 'Бакалавр', field: 'Машиностроение', year: 2017 }], workExperience: [{ company: 'СтройМастер ООО', position: 'Сварщик', startDate: '2017-06', endDate: '2020-08', description: 'Сварочные работы на строительных объектах' }, { company: 'МеталлПро', position: 'Старший сварщик', startDate: '2020-09', endDate: null, description: 'Руководство бригадой сварщиков' }], currentState: 'showcase', profileComplete: 85, matchScore: 92 },
  { displayId: 2848, name: 'Дилнора Усманова', email: 'dilnora.u@mail.uz', phone: '+998931234567', dob: '1998-07-22', gender: 'female', region: 'Самарканд', district: 'Центр', address: 'ул. Регистан, 12', industry: 'hospitality', specialization: 'Повар', experienceYears: 3, skills: ['Готовка', 'Обслуживание клиентов', 'Первая помощь'], languages: [{ id: 'uz', level: 'fluent' }, { id: 'ru', level: 'fluent' }, { id: 'en', level: 'intermediate' }], education: [{ institution: 'Самаркандский кулинарный колледж', degree: 'Среднее специальное', field: 'Кулинария', year: 2018 }], workExperience: [{ company: 'Ресторан «Плов»', position: 'Повар', startDate: '2018-09', endDate: '2021-05', description: 'Приготовление национальных блюд' }, { company: 'Hotel Grand', position: 'Шеф-повар', startDate: '2021-06', endDate: null, description: 'Управление кухней ресторана при отеле' }], currentState: 'assessment', profileComplete: 70, matchScore: 78 },
  { displayId: 2849, name: 'Бахтиёр Рахимов', email: 'bakhtyor.r@mail.uz', phone: '+998941234567', dob: '1992-01-10', gender: 'male', region: 'Фергана', district: 'Маргилан', address: 'ул. Истиклол, 78', industry: 'construction', specialization: 'Электрик', experienceYears: 8, skills: ['Электромонтаж', 'Кладка', 'Штукатурка', 'Управление техникой'], languages: [{ id: 'uz', level: 'fluent' }, { id: 'ru', level: 'intermediate' }, { id: 'ar', level: 'basic' }], education: [{ institution: 'Ферганский политехнический институт', degree: 'Бакалавр', field: 'Электротехника', year: 2014 }], workExperience: [{ company: 'ЭлектроСервис', position: 'Электрик', startDate: '2014-08', endDate: '2019-12', description: 'Монтаж электропроводки в жилых зданиях' }, { company: 'Al-Bina Construction (SA)', position: 'Электрик', startDate: '2020-02', endDate: '2023-06', description: 'Работа на строительных объектах в Саудовской Аравии' }], currentState: 'hard_lock', profileComplete: 95, matchScore: 96 },
  { displayId: 2850, name: 'Шахзод Мирзаев', email: 'shahzod.m@mail.uz', phone: '+998951234567', dob: '1997-05-30', gender: 'male', region: 'Бухара', district: 'Каган', address: 'ул. Навои, 33', industry: 'logistics', specialization: 'Водитель', experienceYears: 4, skills: ['Вождение', 'Организация склада', 'Первая помощь'], languages: [{ id: 'uz', level: 'fluent' }, { id: 'ru', level: 'advanced' }], education: [{ institution: 'Бухарский автодорожный колледж', degree: 'Среднее специальное', field: 'Автоперевозки', year: 2017 }], workExperience: [{ company: 'ТрансЛогистик', position: 'Водитель категории C', startDate: '2017-09', endDate: null, description: 'Международные грузоперевозки' }], currentState: 'registration', profileComplete: 45, matchScore: 65 },
  { displayId: 2851, name: 'Нодира Хасанова', email: 'nodira.h@mail.uz', phone: '+998971234567', dob: '1999-11-08', gender: 'female', region: 'Наманган', district: 'Центр', address: 'ул. Бобур, 56', industry: 'healthcare', specialization: 'Медсестра', experienceYears: 2, skills: ['Первая помощь', 'Обслуживание клиентов', 'Английский язык'], languages: [{ id: 'uz', level: 'fluent' }, { id: 'ru', level: 'fluent' }, { id: 'en', level: 'advanced' }], education: [{ institution: 'Ташкентский медицинский институт', degree: 'Бакалавр', field: 'Сестринское дело', year: 2021 }], workExperience: [{ company: 'Городская поликлиника №3', position: 'Медсестра', startDate: '2021-09', endDate: null, description: 'Работа в процедурном кабинете' }], currentState: 'contracting', profileComplete: 90, matchScore: 88 },
  { displayId: 2852, name: 'Улугбек Ташматов', email: 'ulugbek.t@mail.uz', phone: '+998911234567', dob: '1993-08-14', gender: 'male', region: 'Андижан', district: 'Центр', address: 'ул. Мустакиллик, 22', industry: 'manufacturing', specialization: 'Оператор станка', experienceYears: 7, skills: ['Управление техникой', 'Сварка', 'MS Office'], languages: [{ id: 'uz', level: 'fluent' }, { id: 'ru', level: 'advanced' }, { id: 'ko', level: 'intermediate' }], education: [{ institution: 'Андижанский машиностроительный институт', degree: 'Бакалавр', field: 'Машиностроение', year: 2015 }], workExperience: [{ company: 'UzAuto Motors', position: 'Оператор линии', startDate: '2015-07', endDate: '2020-12', description: 'Работа на сборочной линии' }, { company: 'Samsung Engineering', position: 'Оператор CNC', startDate: '2021-02', endDate: null, description: 'Работа на станке с ЧПУ' }], currentState: 'work_permit', profileComplete: 100, matchScore: 91 },
  { displayId: 2853, name: 'Зарина Абдуллаева', email: 'zarina.a@mail.uz', phone: '+998921234567', dob: '1996-04-20', gender: 'female', region: 'Хорезм', district: 'Ургенч', address: 'ул. Аль-Хорезми, 8', industry: 'hospitality', specialization: 'Горничная', experienceYears: 3, skills: ['Уборка', 'Обслуживание клиентов', 'Английский язык'], languages: [{ id: 'uz', level: 'fluent' }, { id: 'ru', level: 'intermediate' }, { id: 'en', level: 'intermediate' }, { id: 'tr', level: 'basic' }], education: [{ institution: 'Ургенчский колледж сервиса', degree: 'Среднее специальное', field: 'Гостиничное дело', year: 2016 }], workExperience: [{ company: 'Hilton Tashkent', position: 'Горничная', startDate: '2017-03', endDate: '2020-10', description: 'Обслуживание номеров' }, { company: 'Kempinski Hotel', position: 'Старшая горничная', startDate: '2020-11', endDate: null, description: 'Управление командой горничных' }], currentState: 'visa', profileComplete: 95, matchScore: 82 },
  { displayId: 2854, name: 'Жасур Нурматов', email: 'jasur.n@mail.uz', phone: '+998991234567', dob: '1994-12-05', gender: 'male', region: 'Кашкадарья', district: 'Карши', address: 'ул. Ислом Каримов, 100', industry: 'construction', specialization: 'Каменщик', experienceYears: 6, skills: ['Кладка', 'Штукатурка', 'Покраска'], languages: [{ id: 'uz', level: 'fluent' }, { id: 'ru', level: 'intermediate' }], education: [{ institution: 'Каршинский строительный колледж', degree: 'Среднее специальное', field: 'Строительство', year: 2014 }], workExperience: [{ company: 'СтройИнвест', position: 'Каменщик', startDate: '2014-06', endDate: '2019-08', description: 'Кладка стен, фундаментов' }, { company: 'Saudi Oger (SA)', position: 'Каменщик', startDate: '2019-10', endDate: '2022-04', description: 'Строительство жилых комплексов' }], currentState: 'deployment', profileComplete: 100, matchScore: 89 },
  { displayId: 2855, name: 'Мадина Юлдашева', email: 'madina.y@mail.uz', phone: '+998901234568', dob: '2000-02-18', gender: 'female', region: 'Навои', district: 'Центр', address: 'ул. Гагарин, 15', industry: 'retail', specialization: 'Продавец', experienceYears: 1, skills: ['Обслуживание клиентов', 'MS Office', 'Английский язык'], languages: [{ id: 'uz', level: 'fluent' }, { id: 'ru', level: 'fluent' }, { id: 'en', level: 'intermediate' }], education: [{ institution: 'Навоийский государственный университет', degree: 'Бакалавр', field: 'Экономика', year: 2022 }], workExperience: [{ company: 'Korzinka.uz', position: 'Продавец-консультант', startDate: '2022-08', endDate: null, description: 'Обслуживание покупателей' }], currentState: 'registration', profileComplete: 30, matchScore: 55 },
  { displayId: 2856, name: 'Отабек Султанов', email: 'otabek.s@mail.uz', phone: '+998931234568', dob: '1991-09-25', gender: 'male', region: 'Сурхандарья', district: 'Термез', address: 'ул. Навои, 44', industry: 'agriculture', specialization: 'Тракторист', experienceYears: 10, skills: ['Вождение', 'Управление техникой', 'Первая помощь'], languages: [{ id: 'uz', level: 'fluent' }, { id: 'ru', level: 'basic' }], education: [{ institution: 'Термезский аграрный колледж', degree: 'Среднее специальное', field: 'Механизация сельского хозяйства', year: 2011 }], workExperience: [{ company: 'Фермерское хозяйство «Баракат»', position: 'Тракторист', startDate: '2011-05', endDate: null, description: 'Обработка земли, уборка урожая' }], currentState: 'assessment', profileComplete: 60, matchScore: 72 },
  { displayId: 2857, name: 'Фаррух Исмаилов', email: 'farrukh.i@mail.uz', phone: '+998941234568', dob: '1996-06-12', gender: 'male', region: 'Джизак', district: 'Центр', address: 'ул. Шарк, 19', industry: 'construction', specialization: 'Плотник', experienceYears: 5, skills: ['Кладка', 'Штукатурка', 'Покраска', 'Электромонтаж'], languages: [{ id: 'uz', level: 'fluent' }, { id: 'ru', level: 'advanced' }, { id: 'tr', level: 'intermediate' }], education: [{ institution: 'Джизакский строительный колледж', degree: 'Среднее специальное', field: 'Строительство', year: 2016 }], workExperience: [{ company: 'TurkStroy Ltd (TR)', position: 'Плотник', startDate: '2018-03', endDate: '2022-11', description: 'Отделочные и плотницкие работы в Турции' }], currentState: 'showcase', profileComplete: 80, matchScore: 85 },
  { displayId: 2858, name: 'Гульнора Рахматова', email: 'gulnora.r@mail.uz', phone: '+998951234568', dob: '1997-10-03', gender: 'female', region: 'Ташкент', district: 'Мирзо Улугбек', address: 'ул. Мукими, 67', industry: 'it', specialization: 'Тестировщик', experienceYears: 2, skills: ['MS Office', 'Английский язык', 'Обслуживание клиентов'], languages: [{ id: 'uz', level: 'fluent' }, { id: 'ru', level: 'fluent' }, { id: 'en', level: 'advanced' }, { id: 'de', level: 'basic' }], education: [{ institution: 'INHA University Tashkent', degree: 'Бакалавр', field: 'Информатика', year: 2019 }], workExperience: [{ company: 'EPAM Systems', position: 'QA Engineer', startDate: '2019-10', endDate: null, description: 'Тестирование веб-приложений' }], currentState: 'contracting', profileComplete: 88, matchScore: 90 },
  { displayId: 2859, name: 'Рустам Хакимов', email: 'rustam.h@mail.uz', phone: '+998971234568', dob: '1990-03-28', gender: 'male', region: 'Сырдарья', district: 'Гулистан', address: 'ул. Амир Темур, 10', industry: 'manufacturing', specialization: 'Контролёр качества', experienceYears: 9, skills: ['Управление техникой', 'MS Office', 'Русский язык'], languages: [{ id: 'uz', level: 'fluent' }, { id: 'ru', level: 'fluent' }, { id: 'en', level: 'basic' }], education: [{ institution: 'Ташкентский химико-технологический институт', degree: 'Магистр', field: 'Управление качеством', year: 2013 }], workExperience: [{ company: 'Artel Electronics', position: 'Инженер ОТК', startDate: '2013-08', endDate: '2020-05', description: 'Контроль качества сборки бытовой техники' }, { company: 'Uztex Group', position: 'Начальник ОТК', startDate: '2020-06', endDate: null, description: 'Руководство отделом контроля качества' }], currentState: 'completed', profileComplete: 100, matchScore: 94 },
  { displayId: 2860, name: 'Лазиз Турсунов', email: 'laziz.t@mail.uz', phone: '+998911234568', dob: '1998-08-07', gender: 'male', region: 'Каракалпакстан', district: 'Нукус', address: 'ул. Дослик, 30', industry: 'construction', specialization: 'Маляр', experienceYears: 3, skills: ['Покраска', 'Штукатурка', 'Кладка'], languages: [{ id: 'uz', level: 'fluent' }, { id: 'ru', level: 'intermediate' }], education: [{ institution: 'Нукусский строительный колледж', degree: 'Среднее специальное', field: 'Отделочные работы', year: 2018 }], workExperience: [{ company: 'ОтделкаПлюс', position: 'Маляр', startDate: '2018-06', endDate: null, description: 'Малярные и отделочные работы' }], currentState: 'assessment', profileComplete: 55, matchScore: 68 },
  { displayId: 2861, name: 'Камола Нуриллаева', email: 'kamola.n@mail.uz', phone: '+998921234568', dob: '2001-01-15', gender: 'female', region: 'Ташкент', district: 'Чиланзар', address: 'ул. Бунёдкор, 5', industry: 'hospitality', specialization: 'Администратор', experienceYears: 1, skills: ['Обслуживание клиентов', 'MS Office', 'Английский язык', 'Арабский язык'], languages: [{ id: 'uz', level: 'fluent' }, { id: 'ru', level: 'fluent' }, { id: 'en', level: 'advanced' }, { id: 'ar', level: 'intermediate' }], education: [{ institution: 'Westminster International University', degree: 'Бакалавр', field: 'Туризм и гостеприимство', year: 2023 }], workExperience: [{ company: 'Marriott Tashkent', position: 'Администратор', startDate: '2023-06', endDate: null, description: 'Регистрация гостей, обработка бронирований' }], currentState: 'registration', profileComplete: 40, matchScore: 75 },
]

const JOB_ORDERS = [
  { title: { en: 'Construction workers for residential complex', ru: 'Строительные рабочие для жилого комплекса', uz: 'Turar-joy majmuasi uchun qurilish ishchilari' }, employer: { id: 'e001', name: 'Al-Bina Construction', country: 'sa' }, industry: 'construction', specialization: { en: 'Welder', ru: 'Сварщик', uz: 'Payvandchi' }, country: 'sa', city: { en: 'Riyadh', ru: 'Эр-Рияд', uz: 'Ar-Riyod' }, description: { en: 'Qualified welders needed for residential complex construction.', ru: 'Требуются квалифицированные сварщики для строительства жилого комплекса.', uz: 'Turar-joy majmuasi qurilishi uchun malakali payvandchilar kerak.' }, requirements: { experienceMin: 3, skills: ['Сварка', 'Электромонтаж'], languages: [{ id: 'ru', level: 'basic' }], gender: 'male', ageMin: 22, ageMax: 45 }, salary: { amount: 1500, currency: 'USD' }, benefits: { en: 'Accommodation, meals, health insurance, airfare', ru: 'Проживание, питание, медицинская страховка, авиабилеты', uz: "Turar joy, ovqatlanish, tibbiy sug'urta, aviachiptalar" }, status: 'active' },
  { title: { en: 'Chefs for hotel chain', ru: 'Повара для сети отелей', uz: "Mehmonxonalar tarmog'i uchun oshpazlar" }, employer: { id: 'e002', name: 'Emirates Hospitality Group', country: 'ae' }, industry: 'hospitality', specialization: { en: 'Chef', ru: 'Повар', uz: 'Oshpaz' }, country: 'ae', city: { en: 'Dubai', ru: 'Дубай', uz: 'Dubay' }, description: { en: 'Chefs for 5-star hotel restaurants.', ru: 'Повара для ресторанов при 5-звёздочных отелях.', uz: '5 yulduzli mehmonxona restoranlarida ishlash uchun oshpazlar.' }, requirements: { experienceMin: 2, skills: ['Готовка', 'Обслуживание клиентов'], languages: [{ id: 'en', level: 'intermediate' }], gender: null, ageMin: 21, ageMax: 40 }, salary: { amount: 1800, currency: 'USD' }, benefits: { en: 'Accommodation, health insurance, tips', ru: 'Проживание, медстраховка, чаевые', uz: "Turar joy, tibbiy sug'urta, choypul" }, status: 'active' },
  { title: { en: 'Electricians for industrial facility', ru: 'Электрики для промышленного объекта', uz: "Sanoat ob'ekti uchun elektriklar" }, employer: { id: 'e001', name: 'Al-Bina Construction', country: 'sa' }, industry: 'construction', specialization: { en: 'Electrician', ru: 'Электрик', uz: 'Elektrik' }, country: 'sa', city: { en: 'Jeddah', ru: 'Джидда', uz: 'Jidda' }, description: { en: 'Electricians needed for industrial facility.', ru: 'Требуются электрики для промышленного объекта.', uz: "Sanoat ob'ektida montaj ishlari uchun elektriklar kerak." }, requirements: { experienceMin: 5, skills: ['Электромонтаж', 'Управление техникой'], languages: [{ id: 'en', level: 'basic' }], gender: 'male', ageMin: 25, ageMax: 50 }, salary: { amount: 1700, currency: 'USD' }, benefits: { en: 'Accommodation, meals, transport, health insurance', ru: 'Проживание, питание, транспорт, медстраховка', uz: "Turar joy, ovqatlanish, transport, tibbiy sug'urta" }, status: 'active' },
  { title: { en: 'Nurses for clinic', ru: 'Медсёстры для клиники', uz: 'Klinika uchun hamshiralar' }, employer: { id: 'e003', name: 'German Medical Center', country: 'de' }, industry: 'healthcare', specialization: { en: 'Nurse', ru: 'Медсестра', uz: 'Hamshira' }, country: 'de', city: { en: 'Berlin', ru: 'Берлин', uz: 'Berlin' }, description: { en: 'Qualified nurses. German B1+ required.', ru: 'Квалифицированные медсёстры. Немецкий B1+.', uz: 'Malakali hamshiralar. Nemis tili B1+.' }, requirements: { experienceMin: 2, skills: ['Первая помощь'], languages: [{ id: 'de', level: 'intermediate' }, { id: 'en', level: 'intermediate' }], gender: null, ageMin: 22, ageMax: 45 }, salary: { amount: 2500, currency: 'EUR' }, benefits: { en: 'Housing, language courses, health insurance, pension', ru: 'Жильё, языковые курсы, медстраховка, пенсия', uz: "Uy-joy, til kurslari, tibbiy sug'urta, pensiya" }, status: 'active' },
  { title: { en: 'CNC Operators for Samsung factory', ru: 'Операторы CNC для завода Samsung', uz: 'Samsung zavodi uchun CNC operatorlari' }, employer: { id: 'e004', name: 'Samsung Engineering Korea', country: 'kr' }, industry: 'manufacturing', specialization: { en: 'Machine operator', ru: 'Оператор станка', uz: 'Stanok operatori' }, country: 'kr', city: { en: 'Seoul', ru: 'Сеул', uz: 'Seul' }, description: { en: 'CNC machine operators needed.', ru: 'Набор операторов CNC-станков.', uz: 'CNC stanok operatorlari yollanmoqda.' }, requirements: { experienceMin: 3, skills: ['Управление техникой'], languages: [{ id: 'ko', level: 'basic' }], gender: 'male', ageMin: 22, ageMax: 40 }, salary: { amount: 2000, currency: 'USD' }, benefits: { en: 'Accommodation, meals, airfare, bonuses', ru: 'Проживание, питание, авиабилеты, бонусы', uz: 'Turar joy, ovqatlanish, aviachiptalar, bonuslar' }, status: 'active' },
  { title: { en: 'Housekeepers for Kempinski Hotel', ru: 'Горничные для отеля Kempinski', uz: 'Kempinski mehmonxonasi uchun xona xizmatchilari' }, employer: { id: 'e005', name: 'Turkish Hotels Association', country: 'tr' }, industry: 'hospitality', specialization: { en: 'Housekeeper', ru: 'Горничная', uz: 'Xona xizmatchisi' }, country: 'tr', city: { en: 'Antalya', ru: 'Анталья', uz: 'Antaliya' }, description: { en: 'Housekeepers for resort hotels in Antalya.', ru: 'Горничные для курортных отелей Антальи.', uz: 'Antaliyaning kurort mehmonxonalarida xona xizmatchilari.' }, requirements: { experienceMin: 1, skills: ['Уборка', 'Обслуживание клиентов'], languages: [{ id: 'tr', level: 'basic' }], gender: 'female', ageMin: 20, ageMax: 35 }, salary: { amount: 800, currency: 'USD' }, benefits: { en: 'Accommodation, meals, uniform', ru: 'Проживание, питание, форма', uz: 'Turar joy, ovqatlanish, forma kiyim' }, status: 'active' },
  { title: { en: 'Drivers category C, D', ru: 'Водители категории C,D', uz: 'C, D toifali haydovchilar' }, employer: { id: 'e006', name: 'Qatar Logistics Co', country: 'qa' }, industry: 'logistics', specialization: { en: 'Driver', ru: 'Водитель', uz: 'Haydovchi' }, country: 'qa', city: { en: 'Doha', ru: 'Доха', uz: 'Doha' }, description: { en: 'Drivers C and D for cargo transportation.', ru: 'Водители C и D для грузоперевозок.', uz: 'Yuk tashish uchun C va D toifali haydovchilar.' }, requirements: { experienceMin: 3, skills: ['Вождение'], languages: [], gender: 'male', ageMin: 25, ageMax: 50 }, salary: { amount: 1200, currency: 'USD' }, benefits: { en: 'Accommodation, meals, health insurance', ru: 'Проживание, питание, медстраховка', uz: "Turar joy, ovqatlanish, tibbiy sug'urta" }, status: 'draft' },
  { title: { en: 'Harvest workers (seasonal)', ru: 'Сборщики урожая (сезон)', uz: "Hosil yig'uvchilar (mavsumiy)" }, employer: { id: 'e007', name: 'Polish Agriculture Ltd', country: 'pl' }, industry: 'agriculture', specialization: { en: 'Harvest worker', ru: 'Сборщик урожая', uz: "Hosil yig'uvchi" }, country: 'pl', city: { en: 'Warsaw', ru: 'Варшава', uz: 'Varshava' }, description: { en: 'Seasonal berry/vegetable picking. 3-month contract.', ru: 'Сезонный сбор ягод и овощей. 3 месяца.', uz: "Meva va sabzavotlarni yig'ish. 3 oylik shartnoma." }, requirements: { experienceMin: 0, skills: [], languages: [], gender: null, ageMin: 18, ageMax: 55 }, salary: { amount: 900, currency: 'EUR' }, benefits: { en: 'Accommodation, transport to farm', ru: 'Проживание, транспорт до фермы', uz: 'Turar joy, fermaga transport' }, status: 'active' },
]

const DOCUMENTS = [
  { type: 'passport', fileName: 'passport_karimov.pdf', status: 'approved', uploadedAt: '2025-11-02', reviewedAt: '2025-11-04', slaDeadline: '2025-11-09', _candidateIdx: 0 },
  { type: 'education', fileName: 'diploma_karimov.pdf', status: 'approved', uploadedAt: '2025-11-02', reviewedAt: '2025-11-05', slaDeadline: '2025-11-09', _candidateIdx: 0 },
  { type: 'medical', fileName: 'medical_karimov.pdf', status: 'approved', uploadedAt: '2025-11-03', reviewedAt: '2025-11-06', slaDeadline: '2025-11-10', _candidateIdx: 0 },
  { type: 'photo', fileName: 'photo_karimov.jpg', status: 'approved', uploadedAt: '2025-11-01', reviewedAt: '2025-11-02', slaDeadline: '2025-11-08', _candidateIdx: 0 },
  { type: 'resume', fileName: 'resume_karimov.pdf', status: 'approved', uploadedAt: '2025-11-02', reviewedAt: '2025-11-03', slaDeadline: '2025-11-09', _candidateIdx: 0 },
  { type: 'passport', fileName: 'passport_usmanova.pdf', status: 'uploaded', uploadedAt: '2025-11-16', slaDeadline: '2025-11-23', _candidateIdx: 1 },
  { type: 'education', fileName: 'diploma_usmanova.pdf', status: 'rejected', uploadedAt: '2025-11-16', reviewedAt: '2025-11-18', reviewNote: 'Скан плохого качества.', slaDeadline: '2025-11-23', _candidateIdx: 1 },
  { type: 'medical', status: 'not_uploaded', slaDeadline: '2025-11-30', _candidateIdx: 1 },
  { type: 'photo', fileName: 'photo_usmanova.jpg', status: 'under_review', uploadedAt: '2025-11-17', slaDeadline: '2025-11-24', _candidateIdx: 1 },
  { type: 'resume', status: 'not_uploaded', slaDeadline: '2025-12-01', _candidateIdx: 1 },
]

const ASSESSMENTS = [
  { type: 'skill', category: 'Сварочные работы', score: 92, maxScore: 100, passed: true, assessedAt: '2025-11-10', notes: 'Отличное владение аргонной и электродуговой сваркой.', _candidateIdx: 0 },
  { type: 'language', category: 'Русский язык', score: 85, maxScore: 100, passed: true, assessedAt: '2025-11-11', notes: 'Свободное владение устной речью.', _candidateIdx: 0 },
  { type: 'medical', category: 'Медицинский осмотр', score: null, maxScore: null, passed: true, assessedAt: '2025-11-12', notes: 'Годен к работе.', _candidateIdx: 0 },
  { type: 'skill', category: 'Кулинарные навыки', score: 78, maxScore: 100, passed: true, assessedAt: '2025-11-20', notes: 'Хорошие навыки приготовления.', _candidateIdx: 1 },
  { type: 'language', category: 'Английский язык', score: 65, maxScore: 100, passed: true, assessedAt: '2025-11-21', notes: 'Средний уровень.', _candidateIdx: 1 },
  { type: 'skill', category: 'Электромонтажные работы', score: 96, maxScore: 100, passed: true, assessedAt: '2025-10-25', notes: 'Высочайший уровень квалификации.', _candidateIdx: 2 },
  { type: 'interview', category: 'Собеседование', score: 88, maxScore: 100, passed: true, assessedAt: '2025-10-26', notes: 'Мотивирован, дисциплинирован.', _candidateIdx: 2 },
  { type: 'skill', category: 'Управление с/х техникой', score: 70, maxScore: 100, passed: true, assessedAt: '2025-12-01', notes: 'Хорошие навыки.', _candidateIdx: 9 },
  { type: 'skill', category: 'Малярные работы', score: 55, maxScore: 100, passed: false, assessedAt: '2025-11-25', notes: 'Недостаточный уровень.', _candidateIdx: 13 },
  { type: 'language', category: 'Корейский язык', score: 72, maxScore: 100, passed: true, assessedAt: '2025-10-01', notes: 'Средний уровень.', _candidateIdx: 5 },
  { type: 'medical', category: 'Медицинский осмотр', score: null, maxScore: null, passed: true, assessedAt: '2025-10-02', notes: 'Годен.', _candidateIdx: 5 },
  { type: 'skill', category: 'Плотницкие работы', score: 82, maxScore: 100, passed: true, assessedAt: '2025-11-10', notes: 'Хороший опыт.', _candidateIdx: 10 },
]

async function seed() {
  try {
    console.log('Clearing existing data...')
    await prisma.assessment.deleteMany({})
    await prisma.document.deleteMany({})
    await prisma.candidate.deleteMany({})
    await prisma.jobOrder.deleteMany({})
    await prisma.user.deleteMany({})
    console.log('Cleared existing data')

    // Seed users
    const users = []
    for (const u of USERS) {
      const user = await prisma.user.create({ data: u })
      users.push(user)
    }
    console.log(`Seeded ${users.length} users`)

    // Find recruiter IDs
    const recruiter1 = users.find((u) => u.role === 'recruiter')
    const recruiter2 = users.find((u) => u.role === 'senior_manager')

    // Seed candidates
    const candidates = []
    for (const c of CANDIDATES) {
      const candidate = await prisma.candidate.create({
        data: {
          ...c,
          recruiterId: candidates.length % 2 === 0 ? recruiter1.id : recruiter2.id,
          stateHistory: [{ state: c.currentState, timestamp: new Date().toISOString(), action: 'init' }],
        },
      })
      candidates.push(candidate)
    }
    console.log(`Seeded ${candidates.length} candidates`)

    // Seed job orders
    const jobOrders = []
    for (let i = 0; i < JOB_ORDERS.length; i++) {
      const jo = await prisma.jobOrder.create({
        data: {
          ...JOB_ORDERS[i],
          recruiterId: i % 2 === 0 ? recruiter1.id : recruiter2.id,
        },
      })
      jobOrders.push(jo)
    }
    console.log(`Seeded ${jobOrders.length} job orders`)

    // Seed documents
    let docCount = 0
    for (const d of DOCUMENTS) {
      const idx = d._candidateIdx
      const data = { ...d }
      delete data._candidateIdx
      data.candidateId = candidates[idx].id
      // Set reviewedBy to recruiter for reviewed docs
      if (data.reviewedAt) {
        data.reviewedBy = recruiter1.id
      }
      await prisma.document.create({ data })
      docCount++
    }
    console.log(`Seeded ${docCount} documents`)

    // Seed assessments
    let assessmentCount = 0
    for (const a of ASSESSMENTS) {
      const idx = a._candidateIdx
      const data = { ...a }
      delete data._candidateIdx
      data.candidateId = candidates[idx].id
      data.assessedBy = recruiter1.id
      await prisma.assessment.create({ data })
      assessmentCount++
    }
    console.log(`Seeded ${assessmentCount} assessments`)

    console.log('\nSeed completed successfully!')
    console.log('\nTest accounts:')
    users.forEach((u) => {
      console.log(`  ${u.role}: ${u.email} (OTP: ${process.env.OTP_CODE})`)
    })

    process.exit(0)
  } catch (err) {
    console.error('Seed error:', err)
    process.exit(1)
  }
}

seed()
