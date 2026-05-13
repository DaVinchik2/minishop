// Product data — add new items here following the same structure
const PRODUCTS = [
    {
        id: 1,
        title: "Regulmoto Fargo 300",
        description: "Скрамблер с характером. Мощный двигатель 300 см³ для города и бездорожья. Стильный дизайн, надёжная конструкция, комфортная посадка. Идеальный выбор для тех, кто любит свободу и драйв.",
        price: 270000,
        categories: ["300cc", "street"],
        images: [
            "images/RM-Fargo_1.jpg",
            "images/RM-Fargo_2.jpg",
            "images/RM-Fargo_3.jpg",
            "images/RM-Fargo_4.jpg",
            "images/RM-Fargo_6.jpg"
        ],
        badge: "Новинка"
    },
    {
        id: 2,
        title: "Комета 2 Кросс",
        description: "Кроссовый мотоцикл для активного катания. 4-тактный двигатель 49 см³ (110 см³), мощность 3,5–6,5 л.с. Механическая 4-ступенчатая КПП, воздушное охлаждение. Передний гидравлический дисковый тормоз, задний барабанный. Топливный бак 11 л, расход 3 л/100 км. Электро + кик-стартер.",
        price: 97000,
        categories: ["mopeds"],
        images: [
            "images/Komta2-Cross_1.jpg",
            "images/Komta2-Cross_2.jpg",
            "images/Komta2-Cross_3.jpg",
            "images/Komta2-Cross_4.jpg",
            "images/Komta2-Cross_5.jpg"
        ],
        badge: "Хит"
    }
];

const CATEGORIES = [
    { id: "all", title: "Все" },
    { id: "mopeds", title: "Мопеды" },
    { id: "300cc", title: "300см3" },
    { id: "250cc", title: "250см3" },
    { id: "150cc", title: "150см3" },
    { id: "pits", title: "Питы" },
    { id: "street", title: "Дорожники" },
    { id: "atv", title: "Квадроциклы" }
];
