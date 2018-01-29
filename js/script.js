
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var street = $('#street').val();
    var city = $('#city').val();
    var address = street+", "+city;

    $greeting.text('So, you want to live at '+address+"?");

    var streetviewURL = "http://maps.googleapis.com/maps/api/streetview?size=600x300&location="+address+" ";
    $body.append('<img class="bgimg" src="'+streetviewURL+'">');
    // $('img').attr('src',streetviewURL);

    // YOUR CODE GOES HERE!
    var nytimesURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q="+city+"&sort=newest&api-key=c641eeb9774b46ecb4c68feb715cf1a1";

    $.getJSON(nytimesURL,function (data) {
        $nytHeaderElem.text("New York Times Articles About "+city);
        articles = data.response.docs;
        for(var i =0;i<articles.length;i++){
            article = articles[i];
            $nytElem.append('<li class="article">'+
                '<a href='+article.web_url+'>'+article.headline.main+'</a>'+
                '<p>'+article.snippet+"</p>"+
                "</li>");
        }
    }).error(function () {
            $nytHeaderElem.html('<h2>New York Times articles could not be loaded.</h2>')
        })
    ;

    var wikiRequestTimeout = setTimeout(function () {
        $wikiElem.text('failed to load wikipedia resource');
    }, 8000);

    var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search="+city;
    $.ajax({
       url: wikiUrl,
       dataType: 'jsonp',
       success: function(response) {
           var articleList = response[1];
           var articleLink = response[3];
           for(var i=0;i<articleLink.length;i++){
               $wikiElem.append('<li><a href="'+ articleLink[i] +'">'+articleList[i]+'</a></li>');
           }

           clearTimeout(wikiRequestTimeout);
       }
    });
    return false;
}

$('#form-container').submit(loadData);
