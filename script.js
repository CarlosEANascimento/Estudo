var nomeMunicipio;
var apiUrlWeather;
const keyWeather = "6911021f89904389a97232213232712";

var showClientContent = document.getElementById("showClientContent")
var errorClientMessage = document.getElementById("errorClientMessage");

errorClientMessage.style.display = "none";
showClientContent.style.display = "none";

//data.location
var municipioNome, municipioPais, municipioLat, municipioLon, municipioHora;

//data.current
var municipioClima, municipioClimaIcone, municipioTemp, municipioSensTermica, municipioUmidade, municipioUltAtualizacao;

//data.forecast
var municipioTempMin, municipioTempMax, municipioChanceChuva, municipioRaiosUv;

//armazenando id de elementos do doc
var titleContent = document.getElementById("titleContent");
var coordContent = document.getElementById("coordContent");
var conditionContent = document.getElementById("conditionContent");
var tempContent = document.getElementById("tempContent");
var realFeelContent = document.getElementById("realFeelContent");
var maxTempContent = document.getElementById("maxTempContent");
var minTempContent = document.getElementById("minTempContent");
var humidityContent = document.getElementById("humidityContent");
var chanceOfRainContent = document.getElementById("chanceOfRainContent");
var uvContent = document.getElementById("uvContent");
var lastUpdateContent = document.getElementById("lastUpdateContent");

document.getElementById('formPesquisa').addEventListener('submit', function (event) {
    //captando dado inserido no input
    event.preventDefault();

    var formData = new FormData(this);
    var dataForm = {};

    formData.forEach(function (value, key) {
        dataForm[key] = value;
    });

    nomeMunicipio = dataForm.municipio;

    //formatação de nome
    nomeMunicipio = nomeMunicipio.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\W+/g, "+").toLowerCase();

    //api request -> weather
    apiUrlWeather = "http://api.weatherapi.com/v1/forecast.json?key=" + keyWeather + "&q=" + nomeMunicipio + "&days=1&aqi=no&alerts=no";

    fetch(apiUrlWeather)
    .then(Response => {
        if(!Response.ok){
            throw new erro('erro de requisição: $(response.status)');
        }

        return Response.json();
    })
    .then(data => {
        showClientContent.style.display = "block";
        errorClientMessage.style.display = "none";

        //data.location
        municipioNome = data.location.name;
        municipioPais = data.location.country;
        municipioLat = data.location.lat;
        municipioLon = data.location.lon;
        municipioHora = data.location.localtime.slice(-5);

        //data.current
        municipioClima = data.current.condition.text;
        municipioClimaIcone = data.current.condition.icon;
        municipioTemp = data.current.temp_c;
        municipioSensTermica = data.current.feelslike_c;
        municipioUmidade = data.current.humidity;
        municipioUltAtualizacao = data.current.last_updated.slice(-5);

        //data.forecast
        municipioTempMin = data.forecast.forecastday[0].day.mintemp_c;
        municipioTempMax = data.forecast.forecastday[0].day.maxtemp_c;
        municipioChanceChuva = data.forecast.forecastday[0].day.daily_chance_of_rain;
        municipioRaiosUv = data.forecast.forecastday[0].day.uv;

        //fazendo alterações na UI
        titleContent.innerText = municipioNome + " - " + municipioPais + " - " + municipioHora;
        coordContent.innerText = municipioLat + ", " + municipioLon;
        conditionContent.innerText = municipioClima;
        tempContent.innerText = municipioTemp + "°C";
        realFeelContent.innerText = "RealFeel: " + municipioSensTermica + "°C";
        maxTempContent.innerText = municipioTempMax + "°C";
        minTempContent.innerText = municipioTempMin + "°C";
        humidityContent.innerText = "umidade relativa: " + municipioUmidade + "%";
        chanceOfRainContent.innerText = "chance de chuva: " + municipioChanceChuva + "%";
        uvContent.innerText = "índice ultravioleta: " + municipioRaiosUv;
        lastUpdateContent.innerText = "última atualização: " + municipioUltAtualizacao;
    })
    .catch(error =>{
        errorClientMessage.style.display = "block";
        showClientContent.style.display = "none";
    })

    document.getElementById('nomeMunicipio').value = "";
});
