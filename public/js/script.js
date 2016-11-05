$(function () {
  $('[data-toggle="tooltip"]').tooltip({trigger: 'hover'})
})

var socket = io('http://localhost:8080');

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function(position) {
    socket.emit('search restaurant', {latitude: position.coords.latitude, logitude: position.coords.longitude});
  });
}

$('div#search-box button').on('click', function() {
  var term = $('div#search-box input#term').val();
  var location = $('div#search-box input#location').val();
  socket.emit('search restaurant', {term: term, location: location});
});

socket.on('list of restaurants', function(data) {

  console.log(data);

  if(data.total < 1) {
    console.log("No data");
    return;
  }

  $('ul#list_of_restaurants').empty();

  $.each(data.businesses, function(key, value) {
    $('ul#list_of_restaurants').append(
      $('<li />').append(
        $('<div />', {class: 'row'}).append(
          $('<div />', {class: 'col-md-3'}).append(
            $('<div />', {class: 'img-box'}).css('background-image', 'url("'+ value.image_url +'")').click(function() {
              location.href = value.url;
            })
          ),
          $('<div />', {class: 'col-md-4'}).append(
            $('<h4 />', {class: 'name_of_rest'}).append(value.name),
            $('<span >', {class: 'rating_of_rest'}).append(function() {
              var full = Math.floor(value.rating);
              var empty = Math.floor(5 - value.rating);
              var half = 5 - (full + empty);

              var series = $('<span />');

              for(var i = 1; i <= 5; i++) {
                var span = $('<span />');

                if (i <= full) {
                  span.addClass('glyphicon glyphicon-heart');
                } else if (i <= full + half) {
                  span.addClass('glyphicon glyphicon-heart half');
                } else if (i <= full + half + empty) {
                  span.addClass('glyphicon glyphicon-heart-empty');
                }

                series.append(span);
              }

              return series;
            },
            $('<span />', {class: 'reviews'}).append(
              '&nbsp;', $('<span />', {class: 'count'}).append(value.review_count), ' reviews'
            )),
            $('<h5 />', {class: 'categories_of_rest'}).append(function() {
              var a = [];
              $.each(value.categories, function(k, v) {
                a.push(v.title);
              })
              return a.join(', ');
            })
          ),
          $('<div />', {class: 'col-md-3'}).append(
            $('<div />', {class: 'row contact'}).append(
              $('<h5 />', {class: 'adress_of_rest'}).append(value.location.address1),
              $('<h5 />', {class: 'city_of_rest'}).append(function() {
                return value.location.city;
              }),
              $('<h5 />', {class: 'phone_of_rest'}).append(value.phone)
            )
          ),
          $('<div />', {class: 'col-md-2'}).append(function() {
            var reserve = $('<span />', {class: 'reserve'});

            $.getJSON( "http://opentable.herokuapp.com/api/restaurants", {
              state: value.location.state,
              city: value.location.city,
              zip: value.location.zip_code,
              name: value.name
            })
            .done(function( json ) {
              if(typeof json.restaurants[0] != "undefined") {
                var link = json.restaurants[0].reserve_url;

                $('<a />', {href: link}).append(
                  $('<button />', {class: 'btn btn-success', text: 'Book a table'})
                ).appendTo(reserve);
              } else {
                $('<a />', {href: 'javascript:'}).append(
                  $('<button />', {class: 'btn btn-danger', disabled: "disabled", text: 'Book a table'})
                ).appendTo(reserve);
              }
            });

            return reserve;
          })
        )
      )
    );
  })
});
