//Конструктор объекта изделия
function Product(name, type, description, price, src) {
    this.name = name;
    this.type = type;
    this.description = description;
    this.price = price;
    this.src = src;
}

//Данные об изделиях
var data =
    [
        new Product("«Юбилейный»", "cake", "Шоколадно воздушный бисквит, коньячный сироп, шоколадные сливки с добавлением грецкого ореха, покрыт шоколадной заливкой", 900, "img/cake/1.jpg"),
        new Product("«Радуга»", "cake", "Вкусный воздушный бисквит с творожно-йогуртным кремом", 900, "img/cake/2.jpg"),
        new Product("«Для новорожденного»", "cake", "Воздушный шоколадно-банановый бисквит, с насыщенным чизкейк-кремом.", 900, "img/cake/3.jpg"),
        new Product("«День рождения»", "cookie", "В наборе 10 шт.", 1500, "img/cookie/1.jpg"),
        new Product("«Праздничное»", "cookie", "В наборе 3 шт.", 300, "img/cookie/2.jpg"),
        new Product("«Новый год»", "cookie", "В наборе 6 шт.", 720, "img/cookie/3.jpg"),
        new Product("«Летний»", "eclair", "Сырно-творожная начинка, украшение-свежая клубника, в наборе 6 шт.", 900, "img/eclair/1.jpg"),
        new Product("«Радуга вкусов»", "eclair", "Разные вкусы: клубничный, черничный, ореховый, шоколадный, малиновый, в наборе 5 шт.", 500, "img/eclair/2.jpg"),
        new Product("«Аппетитные шары»", "cakepop", "В наборе 10 шт", 800, "img/cakepop/1.jpg")
    ]

//Создание узла с информацией о кондитерском изделии
function divProduct(product) {
    return "<div class=\"col-md-4 col-sm-6 col-xs-12 product\">" +
        "<h3 class=\"text-primary\">" + product.name + "</h3><br/>" +
        "<img src=\"" + product.src + "\"><br/>" +
        "<p>" + product.description + "</p><br/>" +
        "<p>" + product.price + " руб.</p></div>";
}

jQuery.fx.speeds.calculate = function (count) {
    width = $(window).width();
    var coef = 3;
    if (width < 768) coef = 1;
    else if (width < 992) coef = 2;
    var mod = count % coef;
    return ((count - mod) / coef + (mod == 0 ? 0 : 1)) * 300;
}

function animateCategoryButton(name, dwidth, dheight, color) {
    $('button[name="' + name + '"]').stop(false, true).animate({
        width: dwidth,
        height: dheight,
        backgroundColor: color
    }, 500);
}

//Имя последней нажатой кнопки
var lastPressedButton;

//Отображение узлов и их удаление
function showProducts(kind) {
    if ("B" + kind != lastPressedButton) {
        var time;
        if (lastPressedButton == undefined) {
            lastPressedButton = "Ball";
            time = 0;
        }
        else {
            animateCategoryButton(lastPressedButton, "-=10", "-=10", '#FFFFFF');
            time = "slow";
        }
        animateCategoryButton("B" + kind, "+=10", "+=10", "#00FF00");
        lastPressedButton = "B" + kind;
        var html = "", count = 0;
        for (var i = 0; i < data.length; i++)
            if (data[i].type == kind || kind == "all") {
                html += divProduct(data[i]);
                count++;
            }
        store = $('#products');
        store.slideUp(time, function () {
            store.empty();
            store.append(html);
            store.slideDown(jQuery.fx.speeds.calculate(count));
        });
    }
}

//Последний выбранный тип кондитерского изделия
var lastSeletedType;

//Изменение элементов ввода при выборе типа изделия
function changeCategory() {
    var options = $('select[name="productId"]').prop('options');
    options.length = 0;
    var typeValue = $('select[name="type"]').val();
    for (var i = 0; i < data.length; i++)
        if (data[i].type == typeValue)
            options.add(new Option(data[i].name, i));
    var measure = $("#measure");
    var number = $('input[type="number"]');
    switch (typeValue) {
        case "cake":
            measure.text('Кг');
            number.prop('min', 0.5);
            number.prop('step', 0.5);
            break;
        case "cakepop":
        case "cookie":
        case "eclair":
            measure.text('Наборы');
            number.prop('min', 1);
            number.prop('step', 1);
            number.val(Math.ceil(number.val()));
            break;
    }
    updateCost();
}

//Обновление стоимости заказа
function updateCost() {
    var number = $('input[name="number"]').val();
    $('input[name="cost"]').val(data[$('select[name="productId"]').val()].price * number);
    if ($('select[name="type"]').val() == "cake" && number >= 3.5) {
        var cost = $('input[name="cost"]');
        cost.val(cost.val() * 0.9);
    }
}

var isSubmitted = false;

//Сбор данных о заказе с форм в объект и вывод его содержимого в консоль
function sendData() {
    isSubmitted = true;
    var booking =
        {
            "Заказчик:": $('input[name="client"]').val(),
            "Электронная почта": $('input[name="email"]').val(),
            "Номер телефона": $('input[name="phoneNumber"]').val(),
            "Дата изготовления:": $('input[name="date"]').val(),
            "Тип изделия": $('select[name="type"] option:selected').text(),
            "Наименования изделия": data[$('select[name="productId"]').val()].name,
            "Количество": $('input[name="number"]').val() + " " + $('#measure').text(),
            "Стоимость": $('input[name="cost"]').val() + " руб.",
            "Пожелания": $('textarea[name="wish"]').val()
        };
    console.log(booking);
}

//Очистка формы, восстановление значений по умолчанию
function clearInput() {
    $('input, textarea').val("");
    $('input[name="number"]').val(0.5);
    $('select[name="type"]').prop('selectedIndex', 0);
    changeCategory();
    updateCost();
}

function notEnterData() {
    var input = $('input');
    for (var i = 0; i < input.length; i++)
        if (!input[i].checkValidity()) {
            var parent = input[i].parentElement;
            if ($(parent).queue().length == 0)
                animateEmptyInput(parent, 5);
            break;
        }
}

function animateEmptyInput(element, count) {
    if (count > 0) {
        $(element).animate({
            marginLeft: "-=10",
        }, 50).animate({
            marginLeft: "+=10",
        }, 50, function () {
            animateEmptyInput(element, count - 1)
        });
    }

}