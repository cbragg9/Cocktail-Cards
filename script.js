$(document).ready(function () {

    var userSelection = "";
    var drinkIDs = [];
    var searchByIngredientResponse = "";
    var strDrink = "";
    var strIngredient1 = "";
    var strIngredient2 = "";
    var strIngredient3 = "";
    var strDrinkThumb = "";
    var newCardColumn = "";
    var newCardDivCount = 0;
    var currentColumns = 0;
    var countDrinks = 0;

    // When a user clicks on a menu DataTransferItem, clear variables and begin helper functions
    $(".liquor-selection").on("click", function () {
        $("#append-new-columns-here").html("");
        countDrinks = 0;
        currentColumns = 0;
        drinkIDs = [];
        newCardDivCount = 0;
        userSelection = $(this).text();
        checkForSpecialNames();
        getCocktailID();
    });

    // Change API search based on menu selections
    function checkForSpecialNames() {
        if (userSelection === "Rye") {
            userSelection = "Rye Whiskey";
        } else if (userSelection === "Tennessee") {
            userSelection = "Jack Daniels";
        } else if (userSelection === "Canadian") {
            userSelection = "Crown Royal";
        }
    }

    // "Search by ingredient" cocktail DB API for cocktail ID's for the user selection
    function getCocktailID() {
        var queryByIngredientURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + userSelection;
        $.ajax({
            url: queryByIngredientURL,
            method: "GET"
        }).then(function (response) {
            searchByIngredientResponse = response;
            populateDrinkIDs();
            createNewDivs();
            findCocktailDetails();
        });
    }

    // Add cocktail ID's to array
    function populateDrinkIDs() {
        for (var i = 0; i < searchByIngredientResponse.drinks.length; i++) {
            drinkIDs.push(searchByIngredientResponse.drinks[i].idDrink);
        }
    }

    // Create one div for every 3 drink IDs before full cocktail detail AJAX call
    function createNewDivs() {
        for (var i = 0; i < drinkIDs.length; i++) {
            var newColumnDivs = $("<div>");
            newColumnDivs.addClass("columns is-three-quarters-mobile has-text-centered");
            newColumnDivs.attr("id", "append-three-cards-here-" + newCardDivCount);

            if (i % 3 === 0) {
                newCardDivCount++;
                $("#append-new-columns-here").append(newColumnDivs);
            }
        }
    }

    // "Lookup full cocktail details by cocktail ID" cocktail DB API
    function findCocktailDetails() {
        for (var i = 0; i < drinkIDs.length; i++) {
            var queryByIDURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drinkIDs[i];
            $.ajax({
                url: queryByIDURL,
                method: "GET"
            }).then(function (response) {
                var fullDrinkDetails = response;
                strDrink = fullDrinkDetails.drinks[0].strDrink;
                strIngredient1 = fullDrinkDetails.drinks[0].strIngredient1;
                strIngredient2 = fullDrinkDetails.drinks[0].strIngredient2;
                strIngredient3 = fullDrinkDetails.drinks[0].strIngredient3;
                strDrinkThumb = fullDrinkDetails.drinks[0].strDrinkThumb;
                createCard();
            });
        }
    }

    // Create card HTML and append to HTML
    function createCard() {
        newCardColumn = $("<div>");
        newCardColumn.addClass("column is-4 is-three-quarters-mobile");
        var newCard = $("<div class=card>");
        var newCardAnchor = $("<a>");
        var newCardImageDiv = $("<div class=card-image>");
        var newCardFigure = $("<figure>");
        newCardFigure.addClass("image is-4by3");
        var newCardImg = $("<img>");
        newCardImg.attr("src", strDrinkThumb);
        newCardImg.attr("alt", "Placeholder");
        var newCardContent = $("<div class=card-content>");
        var newContentDiv = $("<div class=content>");
        var newContentP = $("<p>");
        newContentP.addClass("title is-size-5");
        newContentP.text(strDrink);
        var newUL = $("<ul>");
        var newLiIngredients1 = $("<li>");
        newLiIngredients1.text(strIngredient1);
        var newLiIngredients2 = $("<li>");
        newLiIngredients2.text(strIngredient2);

        if (strIngredient3 !== null) {
            var newLiIngredients3 = $("<li>");
            newLiIngredients3.text(strIngredient3);
        }

        newCardColumn.append(newCardAnchor);
        newCardAnchor.append(newCard);
        newCard.append(newCardImageDiv);
        newCardImageDiv.append(newCardFigure);
        newCardFigure.append(newCardImg);
        newCard.append(newCardContent);
        newCardContent.append(newContentDiv);
        newContentDiv.append(newContentP);
        newContentDiv.append(newUL);
        newUL.append(newLiIngredients1);
        newUL.append(newLiIngredients2);
        newUL.append(newLiIngredients3);

        appendCardsToHTML();
    }

    // Append cards to the current row
    function appendCardsToHTML() {
        $("#append-three-cards-here-" + currentColumns).append(newCardColumn);
        countDrinks++;

        // Every three drinks, change the row that drinks get added
        if (countDrinks % 3 === 0) {
            currentColumns++;
        }
    }

});

