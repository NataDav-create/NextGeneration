$(function () {
  var modal = $(".modal"),
    modalBtn = $("[data-toggle=modal]"),
    closeBtn = $(".modal__close"),
    closeSuccess = $(".success__close"),
    modalSuccess = $(".success");

  $(this).keydown(function (event) {
    if (event.which == 27) {
      modalSuccess.removeClass("success--visible");
      $("body").css("overflow", "auto");
    }
  });
  $(document).on("click", function (e) {
    if (modalSuccess.is(e.target)) {
      modalSuccess.toggleClass("success--visible");
      $("body").css("overflow", "auto");
    }
  });
  closeSuccess.on("click", function () {
    modalSuccess.removeClass("success--visible");
    $("body").css("overflow", "auto");
  });

  modalBtn.on("click", function () {
    modal.toggleClass("modal--visible");
    $("body").css("overflow", "hidden");
  });

  closeBtn.on("click", function () {
    modal.toggleClass("modal--visible");
    $("body").css("overflow", "auto");
  });
  // close esc
  $(this).keydown(function (event) {
    if (event.which == 27) {
      modal.removeClass("modal--visible");
      $("body").css("overflow", "auto");
    }
  });
  $(document).on("click", function (e) {
    if (modal.is(e.target)) {
      modal.removeClass("modal--visible");
      $("body").css("overflow", "auto");
    }
  });

  $(".header-btn").on("click", function () {
    $(".mobile__menu").addClass("active");
    $("body").css("overflow", "hidden");
  });

  $(".mobile__close-btn").on("click", function () {
    $(".mobile__menu").removeClass("active");
    $("body").css("overflow", "auto");
  });
  $(".mobile__link").on("click", function () {
    $(".mobile__menu").removeClass("active");
    $("body").css("overflow", "auto");
  });

  $(this).keydown(function (event) {
    if (event.which == 27) {
      $(".mobile__menu").removeClass("active");
      $("body").css("overflow", "auto");
    }
  });

  $(document).on("click", function (e) {
    if ("body".is(e.target)) {
      $(".mobile__menu").removeClass("active");
    }
  });

  // map .......................

  //Переменная для включения/отключения индикатора загрузки
  var spinner = $(".map-wrapper").children(".loader");
  //Переменная для определения была ли хоть раз загружена Яндекс.Карта (чтобы избежать повторной загрузки при наведении)
  var check_if_load = false;
  //Необходимые переменные для того, чтобы задать координаты на Яндекс.Карте
  // var myMapTemp, myPlacemarkTemp;

  //Функция создания карты сайта и затем вставки ее в блок с идентификатором &#34;map-yandex&#34;
  function init() {
    var myMapTemp = new ymaps.Map("map", {
      center: [55.723105, 37.606523], // координаты центра на карте
      zoom: 11, // коэффициент приближения карты
      controls: ["zoomControl", "fullscreenControl"], // выбираем только те функции, которые необходимы при использовании
    });
    var myPlacemarkTemp = new ymaps.Placemark(
      myMapTemp.getCenter(), {
        balloonContent: "Вход со двора ",
      }, {
        // Опции.
        // Необходимо указать данный тип макета.
        iconLayout: "default#image",
        // Своё изображение иконки метки.
        iconImageHref: "img/pin.svg",
        // Размеры метки.
        iconImageSize: [30, 42],
        // Смещение левого верхнего угла иконки относительно
        // её "ножки" (точки привязки).
        iconImageOffset: [-40, 0],
      }
    );
    myMapTemp.geoObjects.add(myPlacemarkTemp); // помещаем флажок на карту
    myMapTemp.behaviors.disable("scrollZoom");
    // Получаем первый экземпляр коллекции слоев, потом первый слой коллекции
    var layer = myMapTemp.layers.get(0).get(0);

    // Решение по callback-у для определения полной загрузки карты
    waitForTilesLoad(layer).then(function () {
      // Скрываем индикатор загрузки после полной загрузки карты
      spinner.removeClass("is-active");
    });
  }

  // Функция для определения полной загрузки карты (на самом деле проверяется загрузка тайлов)
  function waitForTilesLoad(layer) {
    return new ymaps.vow.Promise(function (resolve, reject) {
      var tc = getTileContainer(layer),
        readyAll = true;
      tc.tiles.each(function (tile, number) {
        if (!tile.isReady()) {
          readyAll = false;
        }
      });
      if (readyAll) {
        resolve();
      } else {
        tc.events.once("ready", function () {
          resolve();
        });
      }
    });
  }

  function getTileContainer(layer) {
    for (var k in layer) {
      if (layer.hasOwnProperty(k)) {
        if (
          layer[k] instanceof ymaps.layer.tileContainer.CanvasContainer ||
          layer[k] instanceof ymaps.layer.tileContainer.DomContainer
        ) {
          return layer[k];
        }
      }
    }
    return null;
  }

  // Функция загрузки API Яндекс.Карт по требованию (в нашем случае при наведении)
  function loadScript(url, callback) {
    var script = document.createElement("script");

    if (script.readyState) {
      // IE
      script.onreadystatechange = function () {
        if (script.readyState == "loaded" || script.readyState == "complete") {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else {
      // Другие браузеры
      script.onload = function () {
        callback();
      };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
  }

  // Основная функция, которая проверяет когда мы навели на блок с классом &#34;ymap-container&#34;
  var ymap = function () {
    $(".map-wrapper").mouseenter(function () {
      if (!check_if_load) {
        // проверяем первый ли раз загружается Яндекс.Карта, если да, то загружаем

        // Чтобы не было повторной загрузки карты, мы изменяем значение переменной
        check_if_load = true;

        // Показываем индикатор загрузки до тех пор, пока карта не загрузится
        spinner.addClass("is-active");

        // Загружаем API Яндекс.Карт
        loadScript(
          "https://api-maps.yandex.ru/2.1/?apikey=3461d9ea-f1fa-4833-aa26-f29e5ad00273&lang=ru_RU",
          function () {
            // Как только API Яндекс.Карт загрузились, сразу формируем карту и помещаем в блок с идентификатором &#34;map-yandex&#34;
            ymaps.load(init);
          }
        );
      }
    });
  };

  $(function () {
    //Запускаем основную функцию
    ymap();
  });

  $(".modal__form").validate({
    errorClass: "invalid",
    errorElement: "div",
    rules: {
      // строчное правило, converted to {required:true}
      modalName: {
        required: true,
        minlength: 2,
      },
      modalPhone: {
        required: true,
        minlength: 7,
      },
      // правило-объект
      modalEmail: {
        required: true,
        email: true,
      },
    }, // сообщения
    messages: {
      modalName: {
        required: "Name required",
        minlength: "Name is not less then two letters",
      },
      modalPhone: {
        required: "Phone is required",
        minlength: "Phone should be full",
      },
      modalEmail: {
        required: "Email is required",
        email: "Email should be written as example@gmail.com",
      },
    },

    // submitHandler: function (form) {
    //   $(form).ajaxSubmit();
    // }
  });

  // E-mail Ajax Send
  $(".modal__form").submit(function () {
    //Change
    event.preventDefault();
    var th = $(this);
    $.ajax({
      type: "POST",
      url: "mail.php", //Change
      data: th.serialize(),
    }).done(function () {
      // alert("Thank you!");
      $(".modal").removeClass("modal--visible");
      $(".success").addClass("success--visible");
      $("body").css("overflow", "hidden");
      $(form)[0].reset();
    });
    return false;
  });
});