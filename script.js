//#region -> getting elements from html doc
var pokemonName = document.getElementById("pokemonName");
var pokemonType1 = document.getElementById("pokemonType1");
var pokemonType2 = document.getElementById("pokemonType2");

var pokeImg = document.getElementById("pokemonImage");
var pokemonImage = pokeImg.getContext("2d");

var pokemonShiny = document.getElementById("pokemonShiny");
var pokemonShinyLabel = document.getElementById("pokemonShinyLabel");
//#endregion

//#region -> functions
function resizeImage(url){
    var img = new Image();
    img.src = url;

    img.onload = function(){
        pokeImg.width = 512;
        pokeImg.height = 512;
        
        pokemonImage.imageSmoothingEnabled = false;
        pokemonImage.drawImage(img, 0, 0, 512, 512);
    };
}

function typeColor(type){
    switch(type){
        case "bug": return "#A4B41D";
        case "dark": return "#533F32";
        case "dragon": return "#715FC4";
        case "eletric": return "#F5AE0E";
        case "fairy": return "#F1ADF1";
        case "fighting": return "#80321D";
        case "fire": return "#EE400E";
        case "flying": return "#8DA1EE";
        case "ghost": return "#5E60B2";
        case "grass": return "#6CBF31";
        case "ground": return "#CFAF55";
        case "ice": return "#70D1F4";
        case "normal": return "#C6BFB6";
        case "poison": return "#964795";
        case "psychic": return "#EF4880";
        case "rock": return "#B59F53";
        case "steel": return "#B4B4C3";
        case "water": return "#3092EB";
    }
}
//#endregion

//#region -> api request
var pokemonNameSearch = window.location.search.substring(1);
pokemonNameSearch = pokemonNameSearch.split("=");

if(pokemonNameSearch[1] === null){
    pokemonNameSearch = "bulbasaur";
}else{
    pokemonNameSearch = pokemonNameSearch[1];
}
console.log(pokemonNameSearch);

var apiUrl = "https://pokeapi.co/api/v2/pokemon/" + pokemonNameSearch.toLowerCase() + "/";

fetch(apiUrl)
.then(Response => {
    if(!Response.ok){
        throw new erro('erro de requisição: ${response.status}');
    }
    return Response.json();
})
.then(data => {
    //#region -> manipulating document content
    pokemonName.innerText = data.name;
    pokemonType1.innerText = data.types[0].type.name;
    pokemonType1.style.backgroundColor = typeColor(data.types[0].type.name);

    if(data.types[1] === undefined){
        pokemonType2.style.display = "none";
    }else{
        pokemonType2.innerText = data.types[1].type.name;
        pokemonType2.style.backgroundColor = typeColor(data.types[1].type.name);
    }

    pokemonShiny.addEventListener("change", function() {
        if(pokemonShiny.checked){
            resizeImage(data.sprites.front_shiny);
        } else {
            resizeImage(data.sprites.front_default);
        }
    });

    if(pokemonShiny.checked){
        resizeImage(data.sprites.front_shiny);
    }else{
        resizeImage(data.sprites.front_default);
    }

    console.log(typeColor(data.types[0].type.name));
    console.log(data);
    //#endregion
})
.catch(error =>{
    //#region -> pokemon not found/error
    pokemonName.innerText = "Pokemon não encontrado";
    pokemonType1.style.display = "none";
    pokemonType2.style.display = "none";
    pokemonShiny.style.display = "none";
    pokemonShinyLabel.style.display = "none";

    resizeImage("./images/questao.png");
    //#endregion
});

console.log(apiUrl);
//#endregion