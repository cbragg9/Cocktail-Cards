$(document).ready(function () {

    var userSelection = "";
    var drinkIDs = [];
    var ingredientList = [];
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
    var cardsDisplayed = false;

    // When a user clicks on a menu DataTransferItem, clear variables and begin helper functions
    $(".liquor-selection").on("click", function () {
        cardsDisplayed = false;
        $("#append-new-columns-here").html("");
        countDrinks = 0;
        currentColumns = 0;
        drinkIDs = [];
        newCardDivCount = 0;
        checkSelection(this);
        checkForSpecialNames();
        getCocktailID();
    });

    // Check to see if user searched by menu item or by search bar
    function checkSelection(button) {
        if ($(button).is("#search-submit")) {
            userSelection = $("#search-input").val().toLowerCase();
        } else {
            userSelection = $(button).text().toLowerCase();
        }
    }

    // Change API search based on menu selections
    function checkForSpecialNames() {
        if (userSelection === "rye") {
            userSelection = "Rye Whiskey";
        } else if (userSelection === "tennessee") {
            userSelection = "Jack Daniels";
        } else if (userSelection === "canadian") {
            userSelection = "Crown Royal";
        } else if (userSelection === "sour") {
            userSelection = "Sour Mix";
        }
    }

    // "Search by ingredient" cocktail DB API for cocktail ID's for the user selection
    function getCocktailID() {
        var queryByIngredientURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + userSelection;
        $.ajax({
            url: queryByIngredientURL,
            method: "GET"
        }).done(function (response) {
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
                strID = fullDrinkDetails.drinks[0].idDrink;
                strDrinkThumb = fullDrinkDetails.drinks[0].strDrinkThumb;

                if (cardsDisplayed === false) {
                    createCard();
                } else if (cardsDisplayed === true) {
                    return getIngredientList(fullDrinkDetails);
                }

            });
        }
    }


    // Push full ingredient list to array
    function getIngredientList(drinkDetails) {
        ingredientList = [];
        
        console.log(drinkDetails);

        for (var j = 1; j < 16; j++) {
            var currentIngredient = drinkDetails['drinks'][0]['strIngredient' + j];
            if (currentIngredient != null && currentIngredient != "") {
                ingredientList.push(currentIngredient);
            }
        }

        updateModal(drinkDetails);
    }

    // Display drink details in modal
    function updateModal(drinkDetails) {
        $("#modal-drinkName").text(strDrink);
        $("#modal-glass").text(drinkDetails.drinks[0].strGlass);
        $("#modal-img").attr("src", strDrinkThumb);
        $("#modal-instructions").text(drinkDetails.drinks[0].strInstructions);
        $(".modal").addClass("is-active");
        $("#add-modal-ingredients-here").html("");

        // Append full ingredient list to list element
        for (var i = 0; i < ingredientList.length; i++) {
            var newListEl = $("<li>");
            newListEl.text(ingredientList[i]);
            $("#add-modal-ingredients-here").append(newListEl); 
        }
    }


    // Create card HTML and append to HTML
    function createCard() {
        newCardColumn = $("<div>");
        newCardColumn.addClass("column is-4 is-three-quarters-mobile");
        newCardColumn.attr("id", "id-" + countDrinks);
        var newCard = $("<div class=card>");
        newCard.attr("data-drinkID", strID);
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
        newLiIngredients1.addClass("drink-" + countDrinks);
        newLiIngredients1.text(strIngredient1);
        var newLiIngredients2 = $("<li>");
        newLiIngredients2.addClass("drink-" + countDrinks);
        newLiIngredients2.text(strIngredient2);

        if (strIngredient3 !== null) {
            var newLiIngredients3 = $("<li>");
            newLiIngredients3.addClass("drink-" + countDrinks);
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

    // Filter out ingredients selected by user
    $("#filter-submit").on("click", function() {
        var filterIngredient = $("#filter-input").val().toLowerCase();

        for (var i = 0; i < countDrinks; i++) {
            var drinkIngredients = $(".drink-" + i).text().toLowerCase();
            
            if (drinkIngredients.includes(filterIngredient)) {
                $("#id-" + i).remove();
            }
        }

    });

    // Clear search box when clicked into
    $(".search-box").on("click", function() {
        $(".search-box").val("");
    });

    // When a card is clicked, save the drink ID and make an api call for full drink details
    $(document).on("click", ".card", function() {
        drinkIDs = [];
        drinkIDs.push($(this).attr("data-drinkID"));
        cardsDisplayed = true;
        findCocktailDetails();
    })

    // Close modal on exit button
    $(document).on("click","#modal-exit", function() {
        $(".modal").attr("class", "modal");
    });

});

// API's used
// Search by ingredient
// https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Gin

// Lookup full cocktail details by id
// https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=11007