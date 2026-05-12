// Product data — add new items here following the same structure
const PRODUCTS = [
    {
        id: 1,
        title: "Беспроводные наушники TWS Pro",
        description: "Качественный звук, шумоподавление, до 24ч работы. Bluetooth 5.3, сенсорное управление, защита IPX5.",
        price: 2990,
        oldPrice: 4990,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
        badge: "Хит"
    },
    {
        id: 2,
        title: "Смарт-часы FitBand X",
        description: "AMOLED дисплей, пульсоксиметр, GPS, 14 дней без подзарядки. Водозащита IP68.",
        price: 4490,
        oldPrice: 6990,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=400&h=400&fit=crop",
        badge: "-35%"
    },
    {
        id: 3,
        title: "Кожаный чехол для телефона",
        description: "Премиум кожа, магнитный карман для карт. Совместим с MagSafe. Ручная работа.",
        price: 1890,
        category: "accessories",
        image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop"
    },
    {
        id: 4,
        title: "Портативная колонka BassBox Mini",
        description: "Мощный бас, защита от воды IPX7, 12 часов работы. Компактный размер, USB-C зарядка.",
        price: 2290,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop"
    },
    {
        id: 5,
        title: "Керамическая кружка \"Утро\"",
        description: "Дизайнерская керамика, 400мл. Микроволновка и посудомойка ✓. Идеально для подарка.",
        price: 890,
        category: "home",
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop",
        badge: "Новинка"
    },
    {
        id: 6,
        title: "Рюкзак Urban Travel",
        description: "Водоотталкивающая ткань, отделение для ноутбука 15.6\", USB-порт для зарядки. 35л.",
        price: 3490,
        oldPrice: 5490,
        category: "accessories",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
        badge: "-36%"
    }
];

const CATEGORIES = [
    { id: "all", title: "Все" },
    { id: "electronics", title: "Электроника" },
    { id: "accessories", title: "Аксессуары" },
    { id: "home", title: "Для дома" }
];
