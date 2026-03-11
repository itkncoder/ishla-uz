import heroBg from '@shared/assets/hero_bg.png'
import logoWithText from '@shared/assets/logo_with_text.png'
import AuthModal from '@shared/components/AuthModal'
import LanguageSwitcher from '@shared/components/LanguageSwitcher'
import useAuthStore from '@stores/authStore'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router'



const POPULAR_CATEGORIES = [
    { key: 'vacanciesOfDay', count: '74', salary: '3 000 000 – 18 000 000 сўм', bg: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop&q=80' },
    { key: 'companiesOfDay', count: '100', salary: null, bg: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop&q=80' },
    { key: 'remoteWork', count: '575', salary: null, bg: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop&q=80' },
    { key: 'partTime', count: '100+', salary: '400 – 29 469 350 сўм', bg: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=250&fit=crop&q=80' },
    { key: 'courier', count: '5k', salary: '2 999 900 – 26 760 800 сўм', bg: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=250&fit=crop&q=80' },
    { key: 'driver', count: '10k', salary: '1 299 100 – 28 702 500 сўм', bg: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=250&fit=crop&q=80' },
    { key: 'seller', count: '322', salary: '1 999 800 – 12 916 600 сўм', bg: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop&q=80' },
    { key: 'cashier', count: '10k', salary: '1 999 800 – 9 599 800 сўм', bg: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400&h=250&fit=crop&q=80' },
    { key: 'administrator', count: '1k+', salary: '179 900 – 14 205 600 сўм', bg: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=400&h=250&fit=crop&q=80' },
    { key: 'operator', count: '511', salary: '1 999 800 – 18 833 200 сўм', bg: 'https://images.unsplash.com/photo-1560264280-88b68371db39?w=400&h=250&fit=crop&q=80' },
    { key: 'programmer', count: '3k+', salary: '43 333 400 сўм', bg: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop&q=80' },
    { key: 'manager', count: '3 013', salary: '29 166 600 сўм', bg: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop&q=80' },
]


const JOBS_OF_DAY = [
    {
        title: 'SMM специалист (дизайнер, а ещё)',
        salary: 'от 15 000 000 до 15 000 000 сўм',
        company: 'SALOMUY',
        img: 'https://ui-avatars.com/api/?name=S&background=7B1FA2&color=fff&size=128&bold=true&font-size=0.5',
        hot: false,
    },
    {
        title: 'Начальник запуска розничной сети',
        salary: 'от 10 000 000 сўм',
        company: 'ИП ООО Kalij Retail',
        img: 'https://ui-avatars.com/api/?name=KR&background=C62828&color=fff&size=128&bold=true&font-size=0.4',
        hot: true,
    },
    {
        title: 'Менеджер группы развития регионов',
        salary: 'з/п не указана',
        company: 'ИП ООО Kalij Retail',
        img: 'https://ui-avatars.com/api/?name=KR&background=C62828&color=fff&size=128&bold=true&font-size=0.4',
        hot: true,
    },
    {
        title: 'Территориальный менеджер (Джизак)',
        salary: 'от 11 200 000 до 16 800 000 сўм',
        company: 'ИП ООО Kalij Retail',
        img: 'https://ui-avatars.com/api/?name=KR&background=C62828&color=fff&size=128&bold=true&font-size=0.4',
        hot: true,
    },
    {
        title: 'Менеджер группы развития регионов',
        salary: 'з/п не указана',
        company: 'ИП ООО Kalij Retail',
        img: 'https://ui-avatars.com/api/?name=KR&background=C62828&color=fff&size=128&bold=true&font-size=0.4',
        hot: true,
    },
    {
        title: 'Копирайтер / Редактор / Контент-мейкер',
        salary: 'от 10 000 000 до 15 000 000 сўм',
        company: 'SALOMUY',
        img: 'https://ui-avatars.com/api/?name=S&background=7B1FA2&color=fff&size=128&bold=true&font-size=0.5',
        hot: false,
    },
    {
        title: 'Территориальный менеджер (Навои)',
        salary: 'от 11 200 000 до 16 800 000 сўм',
        company: 'ИП ООО Kalij Retail',
        img: 'https://ui-avatars.com/api/?name=KR&background=C62828&color=fff&size=128&bold=true&font-size=0.4',
        hot: false,
    },
    {
        title: 'Диспетчер-логист',
        salary: 'от 6 000 000 до 6 000 000 сўм',
        company: 'THE RDB-GROUP',
        img: 'https://www.google.com/s2/favicons?domain=rdb.uz&sz=128',
        hot: false,
    },
    {
        title: 'Торговый',
        salary: 'от 650 до 1000 $',
        company: 'Wash Inn Technologies',
        img: 'https://ui-avatars.com/api/?name=WI&background=2E7D32&color=fff&size=128&bold=true&font-size=0.4',
        hot: false,
    },
]

const COMPANIES = [
    { name: 'ИП ООО AIR PRODUCT...', vacancies: '1 вакансия', logo: 'A', img: 'https://www.google.com/s2/favicons?domain=airproducts.com&sz=128' },
    { name: 'UNITEL LLC', vacancies: '56 вакансий', logo: 'U', img: 'https://www.google.com/s2/favicons?domain=beeline.uz&sz=128' },
    { name: 'Darian Electronics OO...', vacancies: '13 вакансий', logo: 'D', img: 'https://ui-avatars.com/api/?name=DE&background=8E24AA&color=fff&size=128&bold=true&font-size=0.4' },
    { name: 'ACWA POWER...', vacancies: '15 вакансий', logo: 'A', img: 'https://www.google.com/s2/favicons?domain=acwapower.com&sz=128' },
    { name: 'LUDITO', vacancies: '7 вакансий', logo: 'L', img: 'https://www.google.com/s2/favicons?domain=ludito.org&sz=128' },
    { name: 'OOO SLEEP MARKET', vacancies: '6 вакансий', logo: 'S', img: 'https://ui-avatars.com/api/?name=SM&background=1E88E5&color=fff&size=128&bold=true&font-size=0.4' },
    { name: 'OOO «KPMG AUDIT»', vacancies: '1 вакансия', logo: 'K', img: 'https://www.google.com/s2/favicons?domain=kpmg.com&sz=128' },
    { name: 'KEDMA PRELUXE', vacancies: '1 вакансия', logo: 'K', img: 'https://ui-avatars.com/api/?name=KP&background=C62828&color=fff&size=128&bold=true&font-size=0.4' },
    { name: 'YATT JILSOV SERGEY...', vacancies: '13 вакансий', logo: 'Y', img: 'https://ui-avatars.com/api/?name=YJ&background=6D4C41&color=fff&size=128&bold=true&font-size=0.4' },
    { name: 'Texnomart', vacancies: '33 вакансии', logo: 'T', img: 'https://www.google.com/s2/favicons?domain=texnomart.uz&sz=128' },
]

const PROFESSION_ICONS = {
    autoBusiness: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12' /></svg>,
    adminStaff: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' /></svg>,
    security: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' /></svg>,
    topManagement: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0' /></svg>,
    rawMaterials: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z' /><path strokeLinecap='round' strokeLinejoin='round' d='M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z' /></svg>,
    domesticStaff: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' /></svg>,
    procurement: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z' /></svg>,
    it: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25' /></svg>,
    artsMedia: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42' /></svg>,
    marketing: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46' /></svg>,
    medicine: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' /></svg>,
    scienceEducation: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5' /></svg>,
    sales: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' /></svg>,
    manufacturing: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M11.42 15.17l-5.58 3.607M6.88 8.564l-1.92 6.07 5.56-3.592m0 0l5.56 3.592-1.92-6.07m-3.64 2.478L12 2.25l2.46 7.292m-4.92 0h4.92m-4.92 0L4.89 19.69l7.11-4.52 7.11 4.52-2.53-7.966' /></svg>,
    blueCollar: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.049.58.025 1.193-.14 1.743' /></svg>,
    retail: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.15c0 .415.336.75.75.75z' /></svg>,
    agriculture: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z' /></svg>,
    sportsFitness: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z' /></svg>,
    consulting: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' /></svg>,
    insurance: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z' /></svg>,
    construction: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21' /></svg>,
    transport: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25m0 0V4.5A1.5 1.5 0 0012.75 3H3.75A1.5 1.5 0 002.25 4.5v9.75' /></svg>,
    tourism: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438a2.25 2.25 0 01-1.228 2.39l-.403.2a2.07 2.07 0 01-.628.123M19.44 17.067A9 9 0 003.888 15.903' /></svg>,
    hr: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z' /></svg>,
    finance: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z' /></svg>,
    lawyers: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-13.5 0c-1.01.143-2.01.317-3 .52m3-.52L2.63 15.696c-.122.499.106 1.028.589 1.202a5.989 5.989 0 002.031.352 5.989 5.989 0 002.031-.352c.483-.174.711-.703.59-1.202L5.25 4.971z' /></svg>,
    other: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z' /></svg>,
}

const PROFESSION_KEYS = [
    ['autoBusiness', 'adminStaff', 'security', 'topManagement', 'rawMaterials', 'domesticStaff', 'procurement', 'it', 'artsMedia'],
    ['marketing', 'medicine', 'scienceEducation', 'sales', 'manufacturing', 'blueCollar', 'retail', 'agriculture', 'sportsFitness'],
    ['consulting', 'insurance', 'construction', 'transport', 'tourism', 'hr', 'finance', 'lawyers', 'other'],
]

const FAQ_KEYS = ['1', '2', '3', '4', '5']

function FaqSection() {
    const [openIndex, setOpenIndex] = useState(null)
    const { t } = useTranslation('common')
    return (
        <section id='faq-section' className='bg-white mt-3'>
            <div className='max-w-[1280px] mx-auto px-5 py-10'>
                <h3 className='text-xl font-bold text-gray-900 mb-6'>{t('home.faq')}</h3>
                <div className='space-y-2'>
                    {FAQ_KEYS.map((key, i) => {
                        const isOpen = openIndex === i
                        return (
                            <div key={i} className='border border-gray-200 rounded-xl overflow-hidden'>
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : i)}
                                    className='w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer hover:bg-gray-50 transition-colors'
                                >
                                    <span className='text-base font-medium text-gray-900 pr-4'>{t(`home.faqItems.q${key}`)}</span>
                                    <svg
                                        className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                        strokeWidth={2}
                                    >
                                        <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
                                    </svg>
                                </button>
                                <div
                                    className='overflow-hidden transition-all duration-300 ease-in-out'
                                    style={{
                                        maxHeight: isOpen ? '200px' : '0',
                                        opacity: isOpen ? 1 : 0,
                                    }}
                                >
                                    <div className='px-5 pb-4 text-base text-gray-500 leading-relaxed'>
                                        {t(`home.faqItems.a${key}`)}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default function HomePage() {
    const navigate = useNavigate()
    const { t } = useTranslation('common')
    const loginAsRole = useAuthStore((s) => s.loginAsRole)

    const [modal, setModal] = useState(null)
const [searchQuery, setSearchQuery] = useState('')
    const [typingPlaceholder, setTypingPlaceholder] = useState('')

    const SEARCH_PLACEHOLDERS = Array.from({ length: 7 }, (_, i) => t(`home.searchPlaceholders.${i}`))

    useEffect(() => {
        if (searchQuery) return
        let idx = 0
        let char = 0
        let deleting = false
        let timeout

        const tick = () => {
            const current = SEARCH_PLACEHOLDERS[idx]
            if (!deleting) {
                char++
                setTypingPlaceholder(current.slice(0, char))
                if (char === current.length) {
                    deleting = true
                    timeout = setTimeout(tick, 1500)
                } else {
                    timeout = setTimeout(tick, 80)
                }
            } else {
                char--
                setTypingPlaceholder(current.slice(0, char))
                if (char === 0) {
                    deleting = false
                    idx = (idx + 1) % SEARCH_PLACEHOLDERS.length
                    timeout = setTimeout(tick, 300)
                } else {
                    timeout = setTimeout(tick, 30)
                }
            }
        }

        timeout = setTimeout(tick, 300)
        return () => clearTimeout(timeout)
    }, [searchQuery])

    const openModal = (type) => setModal(type)
    const closeModal = () => setModal(null)

    return (
        <div className='min-h-screen bg-white font-sans'>
            {/* ===== HEADER ===== */}
            <header className='sticky top-0 z-50 bg-white border-b border-gray-200'>
                <div className='max-w-[1280px] mx-auto flex items-center justify-between px-5 h-[64px]'>
                    <div className='flex items-center gap-8'>
                        <Link to='/' className='shrink-0'>
                            <img src={logoWithText} alt='ISHLA' className='h-14' />
                        </Link>
                        <span
                            onClick={() => document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' })}
                            className='text-xs text-gray-400 hidden sm:inline-flex items-center gap-1 cursor-pointer hover:text-gray-900'
                        >
                            <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                                <path strokeLinecap='round' strokeLinejoin='round' d='M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z' />
                            </svg>
                            {t('home.help')}
                        </span>
                    </div>

                    <nav className='hidden md:flex items-center gap-2 text-base'>
                        <span
                            onClick={() => document.getElementById('jobs-section')?.scrollIntoView({ behavior: 'smooth' })}
                            className='px-4 py-2 text-gray-500 hover:text-gray-900 cursor-pointer'
                        >
                            {t('home.forJobSeekers')}
                        </span>
                        <span
                            onClick={() => document.getElementById('companies-section')?.scrollIntoView({ behavior: 'smooth' })}
                            className='px-4 py-2 text-gray-500 hover:text-gray-900 cursor-pointer'
                        >
                            {t('home.forEmployers')}
                        </span>
                    </nav>

                    <div className='flex items-center gap-3'>
                        <LanguageSwitcher variant='light' />
                        <button
                            onClick={() => openModal('login')}
                            className='text-sm font-medium text-white bg-[#004AAD] px-6 py-2 rounded-lg hover:bg-[#003a8c] transition-colors cursor-pointer whitespace-nowrap'
                        >
                            {t('home.login')}
                        </button>
                    </div>
                </div>
            </header>

            {/* ===== HERO ===== */}
            <section className='relative overflow-hidden'>
                <div className='absolute inset-0'>
                    <img
                        src={heroBg}
                        alt=''
                        className='w-full h-full object-cover hero-img'
                    />
                    <div className='absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent' />
                </div>
                <div className='relative max-w-[1280px] mx-auto px-5 py-12 sm:py-16'>
                    <h1 className='text-2xl sm:text-3xl font-bold text-white leading-snug mb-4 max-w-lg'>
                        {t('home.heroTitle')}
                    </h1>
                    <p className='text-base text-white/70 mb-8 max-w-lg'>
                        {t('home.heroSubtitle')}
                    </p>
                    <div className='flex flex-col sm:flex-row gap-4 mb-10'>
                        <button
                            onClick={() => openModal('login')}
                            className='px-8 py-3.5 border border-white/30 text-white font-bold rounded-lg hover:bg-white/10 transition-colors text-base cursor-pointer whitespace-nowrap'
                        >
                            {t('home.iAmEmployer')}
                        </button>
                        <button
                            onClick={() => openModal('login')}
                            className='px-8 py-3.5 bg-[#004AAD] text-white font-bold rounded-lg hover:bg-[#003A8A] transition-colors text-base cursor-pointer whitespace-nowrap'
                        >
                            {t('home.iAmJobSeeker')}
                        </button>
                    </div>

                    <div className='flex flex-wrap items-center gap-6'>
                        {[
                            {
                                val: '780',
                                label: t('home.statCompanies'),
                                icon: (
                                    <svg
                                        className='w-6 h-6'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21'
                                        />
                                    </svg>
                                ),
                            },
                            {
                                val: '1 200',
                                label: t('home.statVacancies'),
                                icon: (
                                    <svg
                                        className='w-6 h-6'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0'
                                        />
                                    </svg>
                                ),
                            },
                        ].map((s) => (
                            <div key={s.label} className='flex items-center gap-3'>
                                <div className='w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70'>
                                    {s.icon}
                                </div>
                                <div>
                                    <div className='text-base sm:text-lg font-bold text-white leading-none'>
                                        {s.val}
                                    </div>
                                    <div className='text-white/50 text-sm mt-0.5'>{s.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== SEARCH BAR ===== */}
            <section className='bg-white border-b border-gray-200'>
                <div className='max-w-[1280px] mx-auto px-5 py-6'>
                    <h2 className='text-xl font-bold text-gray-900 mb-4'>
                        {t('home.jobSearch')}
                    </h2>
                    <div className='flex gap-3'>
                        <div className='flex-1 flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white'>
                            <div className='px-4 text-gray-400'>
                                <svg
                                    className='w-6 h-6'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
                                    />
                                </svg>
                            </div>
                            <input
                                type='text'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') navigate(searchQuery ? `/candidate/jobs?search=${encodeURIComponent(searchQuery)}` : '/candidate/jobs') }}
                                placeholder={typingPlaceholder}
                                className='flex-1 py-3.5 text-base text-gray-900 outline-none bg-transparent'
                            />
                        </div>
                        <button
                            onClick={() => navigate(searchQuery ? `/candidate/jobs?search=${encodeURIComponent(searchQuery)}` : '/candidate/jobs')}
                            className='px-8 py-3.5 bg-[#004AAD] text-white font-bold rounded-lg hover:bg-[#003A8A] transition-colors text-base cursor-pointer'
                        >
                            {t('home.findWithAI')}
                        </button>
                    </div>
                    <button
                        onClick={() => openModal('login')}
                        className='text-base text-[#0066cc] hover:text-[#004499] mt-3 cursor-pointer'
                    >
                        {t('home.lookingForEmployee')}
                    </button>
                </div>
            </section>

            {/* ===== POPULAR ===== */}
            <section className='bg-[#F5F5F5] mt-3'>
                <div className='max-w-[1280px] mx-auto px-5 py-6'>
                    <h3 className='text-xl font-bold text-gray-900 mb-5'>{t('home.popular')}</h3>
                    <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                        {POPULAR_CATEGORIES.map(({ key, count, salary, bg }) => (
                            <button
                                key={key}
                                onClick={() => navigate(`/candidate/jobs?category=${encodeURIComponent(key)}`)}
                                className='relative overflow-hidden text-left hover:shadow-lg transition-all duration-300 cursor-pointer rounded-xl group h-[180px]'
                            >
                                <img src={bg} alt="" className='absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105' />
                                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10' />
                                <div className='relative h-full flex flex-col justify-end p-4'>
                                    <div className='text-sm font-semibold text-white mb-2'>
                                        {t(`home.categories.${key}`)}
                                    </div>
                                    {salary && (
                                        <div className='text-xs text-white/70 mb-1.5'>{salary}</div>
                                    )}
                                    <span className='inline-block w-fit px-2.5 py-1 text-xs font-medium rounded-full bg-white/20 backdrop-blur-sm text-white'>
                                        {t('home.vacanciesCount', { count })}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== JOBS OF THE DAY ===== */}
            <section id='jobs-section' className='bg-[#F5F5F5] mt-3'>
                <div className='max-w-[1280px] mx-auto px-5 py-6'>
                    <h3 className='text-xl font-bold text-gray-900 mb-5'>{t('home.jobsOfDay')}</h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                        {JOBS_OF_DAY.map((job, i) => (
                            <div
                                key={i}
                                onClick={() => navigate(`/candidate/jobs?search=${encodeURIComponent(job.title)}`)}
                                className='bg-white p-6 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer flex flex-col'
                            >
                                <div className='flex items-center gap-3 mb-3'>
                                    <img src={job.img} alt={job.company} className='w-10 h-10 rounded-lg shrink-0' />
                                    <div className='min-w-0'>
                                        <span className='text-sm text-gray-500 truncate block'>
                                            {job.company}
                                        </span>
                                        {job.hot && (
                                            <span className='text-xs text-[#ff6347] font-medium'>
                                                🔥 {t('home.hot')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <h4 className='text-base font-semibold text-gray-900 mb-2 leading-snug'>
                                    {job.title}
                                </h4>
                                <div className='text-sm text-[#004AAD] font-medium mt-auto'>
                                    {job.salary}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== COMPANIES IN TASHKENT ===== */}
            <section id='companies-section' className='bg-white mt-3'>
                <div className='max-w-[1280px] mx-auto px-5 py-6'>
                    <h3 className='text-xl font-bold text-gray-900 mb-5'>{t('home.workWorldwide')}</h3>
                    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4'>
                        {COMPANIES.map((c, i) => (
                            <button
                                key={i}
                                onClick={() => navigate(`/candidate/jobs?company=${encodeURIComponent(c.name)}`)}
                                className='flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer text-left'
                            >
                                <img src={c.img} alt={c.name} className='w-11 h-11 rounded-full shrink-0' />
                                <div className='min-w-0'>
                                    <div className='text-sm font-medium text-gray-900 truncate'>
                                        {c.name}
                                    </div>
                                    <div className='text-sm text-gray-400'>{c.vacancies}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== PROFESSIONS ===== */}
            <section className='bg-white mt-3'>
                <div className='max-w-[1280px] mx-auto px-5 py-8'>
                    <h3 className='text-xl font-bold text-gray-900 mb-5'>
                        {t('home.workByProfession')}
                    </h3>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-3'>
                        {PROFESSION_KEYS.map((col, ci) => (
                            <div key={ci} className='space-y-3'>
                                {col.map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => navigate(`/candidate/jobs?profession=${encodeURIComponent(key)}`)}
                                        className='flex items-center gap-2.5 text-base text-[#0066cc] hover:text-[#004499] cursor-pointer'
                                    >
                                        <span className='text-gray-400 shrink-0'>{PROFESSION_ICONS[key]}</span>
                                        {t(`home.professions.${key}`)}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== NEWS & ARTICLES + STAY CONNECTED ===== */}
            <section className='mt-3'>
                <div className='max-w-[1280px] mx-auto px-5 py-8'>
                    {/* News */}
                    <div className='mb-8'>
                        <div className='flex items-center justify-between mb-5'>
                            <h3 className='text-xl font-bold text-gray-900'>{t('home.news')}</h3>
                            <button onClick={() => navigate('/candidate/help')} className='text-base text-[#004AAD] hover:text-[#003A8A] cursor-pointer font-medium'>
                                {t('home.allNews')}
                            </button>
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                            {[
                                {
                                    titleKey: 'title1',
                                    dateKey: 'date1',
                                    tagKey: 'tag1',
                                    color: 'bg-blue-50 text-blue-600',
                                    img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=240&fit=crop',
                                },
                                {
                                    titleKey: 'title2',
                                    dateKey: 'date2',
                                    tagKey: 'tag2',
                                    color: 'bg-green-50 text-green-600',
                                    img: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=240&fit=crop',
                                },
                                {
                                    titleKey: 'title3',
                                    dateKey: 'date3',
                                    tagKey: 'tag3',
                                    color: 'bg-purple-50 text-purple-600',
                                    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=240&fit=crop',
                                },
                            ].map((n, i) => (
                                <button
                                    key={i}
                                    onClick={() => navigate('/candidate/help')}
                                    className='bg-white rounded-xl overflow-hidden hover:bg-gray-50 transition-colors cursor-pointer text-left'
                                >
                                    <div className='h-40 overflow-hidden'>
                                        <img
                                            src={n.img}
                                            alt={t(`home.newsItems.${n.titleKey}`)}
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                    <div className='p-4'>
                                        <div className='flex items-center gap-2 mb-2'>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${n.color}`}>
                                                {t(`home.newsItems.${n.tagKey}`)}
                                            </span>
                                            <span className='text-xs text-gray-400'>{t(`home.newsItems.${n.dateKey}`)}</span>
                                        </div>
                                        <h4 className='text-sm font-semibold text-gray-900 leading-snug line-clamp-2'>
                                            {t(`home.newsItems.${n.titleKey}`)}
                                        </h4>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Articles */}
                    <div>
                        <div>
                            <div className='flex items-center justify-between mb-5'>
                                <h3 className='text-xl font-bold text-gray-900'>{t('home.articles')}</h3>
                                <button onClick={() => navigate('/candidate/help')} className='text-base text-[#004AAD] hover:text-[#003A8A] cursor-pointer font-medium'>
                                    {t('home.allArticles')}
                                </button>
                            </div>
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                                {[
                                    {
                                        key: '1',
                                        img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=240&fit=crop',
                                    },
                                    {
                                        key: '2',
                                        img: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=400&h=240&fit=crop',
                                    },
                                    {
                                        key: '3',
                                        img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=240&fit=crop',
                                    },
                                    {
                                        key: '4',
                                        img: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=240&fit=crop',
                                    },
                                ].map((a, i) => (
                                    <button
                                        key={i}
                                        onClick={() => navigate('/candidate/help')}
                                        className='flex gap-4 bg-white rounded-xl p-4 hover:bg-gray-50 transition-colors cursor-pointer text-left'
                                    >
                                        <img
                                            src={a.img}
                                            alt={t(`home.articleItems.title${a.key}`)}
                                            className='w-24 h-24 rounded-lg object-cover shrink-0'
                                        />
                                        <div className='min-w-0'>
                                            <span className='text-xs font-medium text-[#004AAD] mb-1 block'>{t(`home.articleItems.tag${a.key}`)}</span>
                                            <h4 className='text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-1'>
                                                {t(`home.articleItems.title${a.key}`)}
                                            </h4>
                                            <p className='text-xs text-gray-400 line-clamp-1'>{t(`home.articleItems.desc${a.key}`)}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== WORK IN OTHER CITIES ===== */}
            <section className='relative mt-3 overflow-hidden'>
                <div className='absolute inset-0'>
                    <img
                        src='https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1400&h=500&fit=crop'
                        alt=''
                        className='w-full h-full object-cover'
                    />
                    <div className='absolute inset-0 bg-gray-900/85' />
                </div>
                <div className='relative max-w-[1280px] mx-auto px-5 py-10'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10'>
                        <div>
                            <h3 className='text-xl font-bold text-white mb-5'>
                                {t('home.workInOtherCountries')}
                            </h3>
                            <div className='space-y-2'>
                                {['southKorea', 'germany', 'japan', 'turkey', 'poland', 'czech', 'uae', 'russia', 'canada', 'uk'].map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => navigate(`/candidate/jobs?country=${encodeURIComponent(key)}`)}
                                        className='block text-base text-white/80 hover:text-white cursor-pointer py-1 transition-colors'
                                    >
                                        {t(`home.countries.${key}`)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className='text-xl font-bold text-white mb-5'>
                                {t('home.popularProfessions')}
                            </h3>
                            <div className='space-y-2'>
                                {[
                                    { key: 'programmers', icon: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5' /></svg> },
                                    { key: 'accountants', icon: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z' /></svg> },
                                    { key: 'engineers', icon: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.049.58.025 1.193-.14 1.743' /></svg> },
                                    { key: 'salesManagers', icon: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' /></svg> },
                                    { key: 'directors', icon: <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0' /></svg> },
                                ].map((p) => (
                                    <button
                                        key={p.key}
                                        onClick={() => navigate(`/candidate/jobs?profession=${encodeURIComponent(p.key)}`)}
                                        className='flex items-center gap-2.5 w-full text-base text-white/80 hover:text-white cursor-pointer py-1 transition-colors'
                                    >
                                        <span className='text-white/50'>{p.icon}</span>
                                        {t(`home.popProfessions.${p.key}`)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FAQ ===== */}
            <FaqSection />

            {/* ===== FOOTER ===== */}
            <footer className='bg-gray-900 mt-3'>
                <div className='max-w-[1280px] mx-auto px-5 pt-10 pb-6'>
                    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 mb-10'>
                        {/* About */}
                        <div className='col-span-2 sm:col-span-3 lg:col-span-1'>
                            <Link to='/' className='inline-block mb-4'>
                                <img src={logoWithText} alt='ISHLA' className='h-16 brightness-0 invert' />
                            </Link>
                            <p className='text-sm text-gray-400 leading-relaxed mb-5'>
                                {t('home.footerDesc')}
                            </p>
                            <div className='space-y-2 mb-5'>
                                <p className='text-sm text-gray-400'>
                                    <svg className='w-4 h-4 inline mr-1.5 -mt-0.5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75' /></svg>
                                    info@ishla.uz
                                </p>
                                <p className='text-sm text-gray-400'>
                                    <svg className='w-4 h-4 inline mr-1.5 -mt-0.5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z' /></svg>
                                    +998 71 123 45 67
                                </p>
                            </div>
                            <div className='flex items-center gap-3'>
                                {[
                                    { href: 'https://t.me/ishlauz', icon: <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'><path d='M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0h-.056zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z'/></svg> },
                                    { href: 'https://instagram.com/ishla.uz', icon: <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'><path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z'/></svg> },
                                    { href: 'https://facebook.com/ishla.uz', icon: <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'><path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/></svg> },
                                    { href: 'https://youtube.com/@ishlauz', icon: <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'><path d='M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'/></svg> },
                                ].map((s, i) => (
                                    <a key={i} href={s.href} target='_blank' rel='noopener noreferrer' className='text-gray-500 hover:text-white transition-colors cursor-pointer'>{s.icon}</a>
                                ))}
                            </div>
                        </div>

                        {/* Соискателям */}
                        <div>
                            <h4 className='text-sm font-bold text-white mb-4'>{t('home.footerForJobSeekers')}</h4>
                            <ul className='space-y-2.5 text-sm text-gray-400'>
                                {[
                                    { key: 'searchVacancies', action: () => navigate('/candidate/jobs') },
                                    { key: 'companyCatalog', action: () => navigate('/candidate/jobs') },
                                    { key: 'workAbroad', action: () => document.getElementById('companies-section')?.scrollIntoView({ behavior: 'smooth' }) },
                                    { key: 'careerAdvice', action: () => navigate('/candidate/help') },
                                ].map(({ key, action }) => (
                                    <li key={key}><button onClick={action} className='hover:text-white transition-colors cursor-pointer'>{t(`home.footerJobSeekerLinks.${key}`)}</button></li>
                                ))}
                            </ul>
                        </div>

                        {/* Работодателям */}
                        <div>
                            <h4 className='text-sm font-bold text-white mb-4'>{t('home.footerForEmployers')}</h4>
                            <ul className='space-y-2.5 text-sm text-gray-400'>
                                {[
                                    { key: 'postVacancy', action: () => openModal('login') },
                                    { key: 'searchResumes', action: () => openModal('login') },
                                    { key: 'pricing', action: () => navigate('/candidate/help') },
                                    { key: 'advertising', action: () => navigate('/candidate/help') },
                                    { key: 'recruitment', action: () => openModal('login') },
                                ].map(({ key, action }) => (
                                    <li key={key}><button onClick={action} className='hover:text-white transition-colors cursor-pointer'>{t(`home.footerEmployerLinks.${key}`)}</button></li>
                                ))}
                            </ul>
                        </div>

                        {/* Компания */}
                        <div>
                            <h4 className='text-sm font-bold text-white mb-4'>{t('home.footerCompany')}</h4>
                            <ul className='space-y-2.5 text-sm text-gray-400'>
                                {[
                                    { key: 'about', action: () => document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' }) },
                                    { key: 'team', action: () => navigate('/candidate/help') },
                                    { key: 'careers', action: () => navigate('/candidate/jobs') },
                                    { key: 'help', action: () => document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' }) },
                                    { key: 'contacts', action: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) },
                                ].map(({ key, action }) => (
                                    <li key={key}><button onClick={action} className='hover:text-white transition-colors cursor-pointer'>{t(`home.footerCompanyLinks.${key}`)}</button></li>
                                ))}
                            </ul>
                        </div>

                    </div>

                    <div className='border-t border-gray-800 pt-5 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500'>
                        <div className='flex flex-wrap items-center gap-5'>
                            <span onClick={() => navigate('/candidate/help')} className='hover:text-gray-300 cursor-pointer'>{t('home.privacyPolicy')}</span>
                            <span onClick={() => navigate('/candidate/help')} className='hover:text-gray-300 cursor-pointer'>{t('home.termsOfUse')}</span>
                            <span onClick={() => navigate('/candidate/help')} className='hover:text-gray-300 cursor-pointer'>{t('home.dataProtection')}</span>
                        </div>
                        <span>{t('home.copyright', { year: new Date().getFullYear() })}</span>
                    </div>
                </div>
            </footer>

            {/* ===== AUTH MODAL ===== */}
            <AuthModal
                open={!!modal}
                onClose={closeModal}
            />
        </div>
    )
}
