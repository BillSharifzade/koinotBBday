import dustiPharma from './assets/companies/dusti-pharma.svg';
import madadPharm from './assets/companies/madad-pharm.png';
import salomat from './assets/companies/salomat.png';
import tibbiNav from './assets/companies/tibbi-nav.png';
import yovar from './assets/companies/yovar.png';
import dastras from './assets/companies/dastras.png';
import honaiMan from './assets/companies/honai-man.png';
import jysk from './assets/companies/jysk.png';
import kit1c from './assets/companies/kit-1c.png';
import tajMotors from './assets/companies/taj-motors.png';
import koinotAuto from './assets/companies/koinot-auto.png';
import asrLeasing from './assets/companies/asr-leasing.png';
import khirad from './assets/companies/khirad.png';
import ats from './assets/companies/ats.png';
import mdis from './assets/companies/mdis.png';

// Logos, names and links as listed on koinotinav.tj.
export const COMPANIES = {
  dustiPharma: { name: 'Дусти Фарма', logo: dustiPharma, url: 'https://dustipharma.tj/' },
  madadPharm: { name: 'Мадад Фарм', logo: madadPharm, url: 'https://madadpharm.tj/' },
  salomat: { name: 'Интернет-аптека Salomat', logo: salomat, url: 'https://www.salomat.tj/' },
  tibbiNav: { name: 'Тибби нав', logo: tibbiNav },
  yovar: { name: 'ЁВАР', logo: yovar, url: 'https://evar.tj/' },
  dastras: { name: 'Дастрас', logo: dastras, url: 'https://www.instagram.com/dastrasmarket.tj/' },
  honaiMan: { name: 'Хонаи Ман', logo: honaiMan, url: 'http://honaiman.tj/' },
  jysk: { name: 'JYSK', logo: jysk, url: 'http://jysk.tj/' },
  kit1c: { name: 'Франчайзи компании 1С', logo: kit1c, url: 'https://kit.tj/' },
  tajMotors: { name: 'Тадж Моторс', logo: tajMotors, url: 'https://www.facebook.com/ToyotaTajMotors/' },
  koinotAuto: { name: 'Koinot Auto', logo: koinotAuto },
  asrLeasing: { name: 'ASR Leasing', logo: asrLeasing, url: 'https://asrleasing.tj/ru/' },
  khirad: { name: '«Хирад»', logo: khirad, url: 'https://khirad.tj/' },
  ats: { name: 'Тренинг-центр «AtS»', logo: ats, url: 'https://ats.tj/' },
  mdis: { name: 'MDIS Dushanbe', logo: mdis, url: 'https://mdis.edu.tj/' }
};

export const COMPANY_ROWS = [
  ['dustiPharma', 'madadPharm', 'salomat', 'tibbiNav', 'yovar', 'dastras', 'honaiMan', 'jysk'],
  ['kit1c', 'tajMotors', 'koinotAuto', 'asrLeasing', 'khirad', 'ats', 'mdis']
];

export const MOTTO = [
  { word: 'Верим', text: 'в людей, в команду и в общественное благополучие — нашу главную миссию.' },
  { word: 'Можем', text: '35 лет опыта, сотни профессионалов и лидерство в своих отраслях.' },
  { word: 'Создаём', text: 'новые компании, рабочие места и стандарты качества для Таджикистана.' }
];

export const STATS = [
  { value: 35, label: 'лет на рынке Таджикистана' },
  { value: 15, label: 'компаний и проектов в экосистеме' },
  { value: 10000, suffix: '+', label: 'наименований лекарств и медтехники' },
  { value: 7000, suffix: ' м²', label: 'фармацевтический складской комплекс' }
];

// Eras and facts follow the "История" page on koinotinav.tj.
export const TIMELINE = [
  {
    era: '1991 — 1996',
    title: 'Начало пути',
    text: 'Оптовые поставки продуктов питания и товаров первой необходимости — наш вклад в продовольственную безопасность республики.'
  },
  {
    era: '1996 — 2000',
    title: 'Фармацевтика',
    text: 'Инвестиции в собственное производство продуктов и хозтоваров. «Дусти Фарма» начинает дистрибуцию лекарств и строит сеть аптек по всему Таджикистану.',
    logos: ['dustiPharma']
  },
  {
    era: '2000 — 2004',
    title: 'Лидерство в фарме',
    text: 'Сеть аптек «Мадад Фарм» и складской комплекс мирового уровня площадью около 7 000 м². Более 10 000 наименований лекарств и медтехники.',
    logos: ['madadPharm']
  },
  {
    era: '2004 — 2008',
    title: 'Новые отрасли',
    text: 'Новые организации в стратегических секторах экономики, высокопроизводительные рабочие места и привлечение иностранных инвестиций.'
  },
  {
    era: '2008 — 2014',
    title: 'Toyota и ритейл',
    text: 'TajMotors становится дилером TOYOTA. Розничная сеть «Ёвар» — качество, свежесть и достойный сервис.',
    logos: ['tajMotors', 'yovar']
  },
  {
    era: '2014 — 2020',
    title: 'Технологии и комфорт',
    text: 'Официальный статус франчайзи 1С. Мебельный салон «Хонаи Ман» — официальный дилер датского бренда JYSK.',
    logos: ['kit1c', 'honaiMan', 'jysk']
  },
  {
    era: '2020 — 2022',
    title: 'Знания и забота',
    text: 'Научно-образовательный проект «Хирад», корпоративный тренинг-центр «AtS» и интернет-аптека «Саломат», запущенная в годы пандемии.',
    logos: ['khirad', 'ats', 'salomat']
  },
  {
    era: '2022 — 2024',
    title: 'Единая миссия',
    text: 'Компании Группы объединяются под единой Миссией — общая стратегия и общие ценности.'
  },
  {
    era: '2026',
    title: '35 лет — и мы только начинаем',
    text: 'В Душанбе открылась клиника МЕДСИ — новое направление в экосистеме Группы. А впереди — новые горизонты.',
    highlight: true
  }
];

// From "Миссия, Видение, Ценности" on koinotinav.tj.
export const VALUES = [
  { title: 'Уважение', text: 'Признаём ценность каждого человека: его труд, время, свободу и мнение.' },
  { title: 'Самореализация', text: 'Создаём атмосферу, где каждый раскрывается. Мы творцы и новаторы в своём деле.' },
  { title: 'Жизнерадостность', text: 'Мы оптимистичны и заряжаем энергией позитива — радоваться жизни наше право.' },
  { title: 'Здоровье', text: 'Главная ценность жизни: физическое и социальное благополучие, гармония.' },
  { title: 'Командность', text: '«Мы команда!» Наша сила — в единстве, сплочённости и дружбе.' },
  { title: 'Профессионализм', text: 'Постоянно совершенствуем знания и умения, изучаем новые тенденции.' }
];
