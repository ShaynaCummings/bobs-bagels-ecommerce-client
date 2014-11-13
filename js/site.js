// var sampleOrder = {
//   lineitems:[

//     {
//       lineitem: {
//         product_id: 4,
//         combined_price: 6
//       },
//       lineitem_options: [14, 2, 7, 15]
//     },

//     {
//       lineitem: {
//         product_id: 10,
//         combined_price: 3.5
//       },
//       lineitem_options: [45]
//     }
//   ],
//   order_info:{
//     status: 'pending',
//     street_address: '50 Melcher Street',
//     city: 'Boston',
//     state: 'MA',
//     zip_code: '02210',
//     delivery_price: 6,
//     order_total: 15.5
//   }
// };

var allProducts = {};

var cart = {
	lineitems: [],
	order_info:{}
};


function addToCart(e){
	e.preventDefault();

	var productId = $(this).closest('.menuitem').find('.product-title').data('product-id');
	var combinedPrice = $(this).closest('.menuitem').find('.price').text();
	var $checkedOptions = $(this).siblings().find('.checked');

	var optionIdsArray = $checkedOptions.map(function(){
     return $.trim($(this).attr('value'));
  }).get();;

	var newLineitem = {
		lineitem: {
      product_id: productId,
      combined_price: combinedPrice
    },
    lineitem_options: optionIdsArray
	};

	cart.lineitems.push(newLineitem)

	updateVisibleCart(newLineitem);

}

function getProduct(item){
	var productId = item.lineitem.product_id;

	var product = allProducts.filter(function( product ) {
	  return product.id == productId;
	});
	return product[0];
}

function getOption(product, optionId){
	var option = product.options.filter(function( option ) {
	  return option.id == optionId;
	});
	return option[0];
}

function updateVisibleCart(item){

	// create cart if it doesn't already exist
	if ( $(".visible-cart").length === 0 ) {
  	cartContainer = $('<div>').addClass('visible-cart').prependTo('div #menu');
  	$('<h2>').text("Your Cart").appendTo(cartContainer);
  	$('<a>').attr('href', "#").addClass('checkout button').text("Checkout").appendTo('.visible-cart');
	}

	var product = getProduct(item);

	var lineItemContainer = $('<div>').addClass('vc-line-item').insertBefore('.checkout');
	$('<div>').addClass('vc-line-item-name').html(product.name).appendTo(lineItemContainer);
	$('<span>').addClass('vc-line-item-price').text("$ " + product.price).appendTo(lineItemContainer.find('.vc-line-item-name'));
	$('<div>').addClass('vc-line-item-options').text("Options:").appendTo(lineItemContainer);
	$('<ul>').appendTo(lineItemContainer.find('.vc-line-item-options'));
	$.each(item.lineitem_options, function(index, optionId){
		var option = getOption(product, optionId);
		$('<li>').text(option.name).appendTo(lineItemContainer.find('.vc-line-item-options ul'));
	});

}

function placeOrder(e){
	e.preventDefault();

	cart.order_info = {
    status: 'pending',
    street_address: $('.street-address').val(),
    city: $('.city').val(),
    state: $('.state').val(),
    zip_code: $('.zip-code').val(),
    delivery_price: 6,
    order_total: 15.5
  }

  $.ajax({
	  type: 'post',
	  // url: "http://bobs-bagels-ecommerce.herokuapp.com/orders",
	  url: "http://localhost:3000/orders",
	  dataType: "json",
	  data: cart
	})
  .done(function(data){
  	alert("Thank you! Your order was placed.");
  });
}

function toggleCheckoutPopup(){
	$('.black-overlay').toggle();
	$('.checkout-popup').toggle();
}


function checkout(e){
	e.preventDefault();

	//create checkout if it doesnt exist
	if ( $(".checkout-popup").length === 0 ){

		// create container
		$('<div>').addClass('black-overlay').prependTo('#allconent');
		$('<div>').addClass('checkout-popup').prependTo('#allconent');
		$('<img>').attr('src', 'images/x-button.png').addClass('x-button').prependTo('.checkout-popup');

		// delivery form
		$('<h3>').text('Delivery Information').appendTo('.checkout-popup')
		$('<label>').text('Street Address: ').appendTo('.checkout-popup');
		$('<input>').addClass('street-address').appendTo('.checkout-popup');
		$('<label>').text('City: ').appendTo('.checkout-popup');
		$('<input>').addClass('city').appendTo('.checkout-popup');
		$('<label>').text('State: ').appendTo('.checkout-popup');
		$('<input>').addClass('state').appendTo('.checkout-popup');
		$('<label>').text('Zip Code: ').appendTo('.checkout-popup');
		$('<input>').addClass('zip-code').appendTo('.checkout-popup');
		$('<a>').attr('href', "#").addClass('place-order button').text("Place Order").appendTo('.checkout-popup');

	}

	toggleCheckoutPopup();

}

(function($) {

	// checkout button listener
	$('.content').on('click', '.checkout', checkout);

	// checkout x-button (close) listener
	$('#allconent').on('click', '.x-button', toggleCheckoutPopup);

	// place order button listener
	$('#allconent').on('click', '.place-order', placeOrder);

	// toggles display of options menu for each product
	$('.content').on('click', '.product-title', function(){
		$(this).parent('.menuitem').find('.options-toggle').slideToggle();
	});

	// toggles selection of checkboxes
	$(".content").on('click', '.options-checkbox', function() {
      $(this).find("input").toggleClass("checked");
      $(this).toggleClass("checked");
  });

  // toggles selection of radio buttons
  $(".content").on('click', '.options-radio', function() {
    $(this).parent(".options-toggle").children(".options-radio").find('input').removeClass('checked');
    $(this).find("input").addClass("checked");

    $(this).parent(".options-toggle").children(".options-radio").removeClass('checked');
    $(this).toggleClass("checked");
  });

  // listens 'add to cart' button and adds line item to cart

  $(".content").on('click', '.add-to-cart', addToCart);

	// GET products
	$.ajax({
  	// url: 'https://bobs-bagels-ecommerce.herokuapp.com/products',
  	url: "http://localhost:3000/products",
  	type: 'GET',
	}).done(function(products) {
		allProducts = products;
		// temp stores Sandwiches
    var sandwiches = $.grep(products, function(product){
    	return (product.category.name == 'Sandwiches');
    });

    // temp stores Beverages
    var beverages = $.grep(products, function(product){
    	return (product.category.name == 'Beverages');
    });

		// temp stores Catering
    var cateringItems = $.grep(products, function(product){
    	return (product.category.name == 'Catering');
    });

    // creates Sandwich DOM elements
    $.each(sandwiches, function(index, sandwich){
    	var itemProperties = $('<h3>').text(sandwich.name).after($('<p>').addClass('description').text(sandwich.description).after($('<p>').addClass('price').text(sandwich.price)));
    	var container = $('<div>').addClass('cols clearfix').html(
    		$('<div>').addClass('col1').html(
    			$('<div>').addClass('menuitem').html(
    				$('<div>').addClass('product-title').attr('data-product-id', sandwich.id.toString()).html(
    					itemProperties
  					)
    			)
    		)
    	).appendTo('#sandwiches');
    	// creates option DOM items
    	var optionsToggle = $('<div>').addClass('options-toggle').appendTo(container.find('.menuitem'))
    	$.each(sandwich.options, function(index, option){
    		var optionsList = $('<div>').addClass('options-checkbox').appendTo(optionsToggle);
    		var checkBox = $('<input>', { type: 'checkbox', class: 'checked', value: option.id });
    		checkBox.appendTo(optionsList);
    		if(sandwich.name == "Build Your Own Bagel - Plain"){
    			checkBox.toggleClass("checked");
    		}
    		$('<label>').html(option.name + " <em>(add $" + option.price + ")</em>").appendTo(optionsList);
    	});
    	// creates 'add to cart' button
    	$('<a>').attr('href', "#").addClass('add-to-cart button').text("Add to cart").appendTo(optionsToggle);
    });

    // creates Beverage DOM elements
    $.each(beverages, function(index, beverage){
    	var itemProperties = $('<h3>').text(beverage.name).after($('<p>').addClass('price').text(beverage.price));
    	var container = $('<div>').addClass('cols clearfix').html(
    		$('<div>').addClass('col1').html(
    			$('<div>').addClass('menuitem').html(
    				$('<div>').addClass('product-title').attr('data-product-id', beverage.id.toString()).html(
    					itemProperties
  					)
    			)
    		)
    	).appendTo('#beverages');

    	// creates option DOM items
    	var optionsToggle = $('<div>').addClass('options-toggle').appendTo(container.find('.menuitem'))
    	$.each(beverage.options, function(index, option){
    		var optionsList = $('<div>').addClass('options-radio').appendTo(optionsToggle);
    		$('<input>', { type: 'radio', value: option.id}).appendTo(optionsList);
    		$('<label>').html(option.name + " <em>(add $" + option.price + ")</em>").appendTo(optionsList);
    	});
    	// creates 'add to cart' button
    	var lastOptionChild = $(container).find('.menuitem')
    	$('<a>').attr('href', "#").addClass('add-to-cart button').text("Add to cart").appendTo(optionsToggle);
    });

    // creates Catering DOM elements
    $.each(cateringItems, function(index, cateringItem){
    	var itemProperties = $('<h3>').text(cateringItem.name).after($('<p>').addClass('description').text(cateringItem.description).after($('<p>').addClass('price').text(cateringItem.price)));
    	var container = $('<div>').addClass('cols clearfix').html(
    		$('<div>').addClass('col1').html(
    			$('<div>').addClass('menuitem').html(
    				$('<div>').addClass('product-title').attr('data-product-id', cateringItem.id.toString()).html(
    					itemProperties
  					)
  				)
  			)
  		).appendTo('#cateringItems');
	    // creates option DOM items
	    var optionsToggle = $('<div>').addClass('options-toggle').appendTo(container.find('.menuitem'))
	    $.each(cateringItem.options, function(index, option){
	  		var optionsList = $('<div>').addClass('options-radio').appendTo(optionsToggle);
	  		$('<input>', { type: 'radio', value: option.id }).appendTo(optionsList);
	  		$('<label>').html(option.name + " <em>(add $" + option.price + ")</em>").appendTo(optionsList);
	  	});
	  	// creates 'add to cart' button
    	var lastOptionChild = $(container).find('.menuitem')
    	$('<a>').attr('href', "#").addClass('add-to-cart button').text("Add to cart").appendTo(optionsToggle);
    });
  });


	"use strict";
	$(function() {
		$("body").attr("class", $("#allconent").attr('class'));

		var sw = document.body.clientWidth, breakpoint = 500, mobile = true;
		var checkMobile = function() {
			mobile = (sw > breakpoint) ? false : true;
		};

		checkMobile();
		var ypos = [58, 538, 1049, 1542, 2030, 2975];
		// Slideshow 1
		$(window).load(function(){
			$('#featureslides.flexslider').flexslider({
				animation: "slide",
				direction: "horizontal",
				easing: "easeInOutCirc",
				reverse:"false",
				touch: true
			});

			$("#featureslides .flex-direction-nav").hide();
			$("#featureslides").hover(function () {
				$("#featureslides .flex-direction-nav").fadeIn("fast");
			}, function() {
				$("#featureslides .flex-direction-nav").fadeOut("fast");
			});

			$(".flex-disabled").hide();

			$('#slideshow.flexslider').flexslider({
				animation: "slide",
				direction: "horizontal",
				easing: "easeInOutCirc",
				reverse:"false",
				touch: true
			});
		});

		if (mobile) {
			$("#navitems").addClass("mobile");
		}

		$(window).on("scroll", function(){
			var windowScroll = $(window).scrollTop();
			var windowHeight = $(window).height();

			if (!mobile) {
				if (windowScroll > (windowHeight - 600)) {
					$('#navitems').css("marginTop","-15px");
					$('#navitems').css("paddingBottom","5px");
				} else {
					$('#navitems').css("marginTop","0px");
					$('#navitems').css("paddingBottom","20px");
				}
			}

			// Custom Scrollspy
			if ($("#navitems li a").length > 0) {
				mount();
			}
			// Beer anchor
			if ($("#beer").length > 0) {
				beermount();
			}

		});

		function mount() {
			var a,b,c;
			$("#navitems ul li a").each(function(){
				if ($(".ironanchor").length > 0) {
					a = $($(this).attr("href")).offset().top - 250;
					b = $($(this).attr("href")).offset().top + $($(this).attr("href")).next(".contentsection").outerHeight();
					c = $(window).scrollTop();

					if (c >= a && c <= b) {
						$("#navitems ul a").removeClass("active");
						$(this).addClass("active");
					} else {
						$(this).removeClass("active");
					}
				}
			});
		}

		function beermount() {
			var x = $($("#beer").parent().parent()).offset().top + $($("#beer").parent().parent()).outerHeight() -900;
			var z = $(window).scrollTop();
			var acdifference = x-z;
			if (x <= z) {
				if (acdifference < 0 && acdifference > -69) {
					$("#beer").css({backgroundPosition: "-"+ypos[0]+"px 0px"});
				} else if (acdifference < -69 && acdifference > -126) {
					$("#beer").css({backgroundPosition: "-"+ypos[1]+"px 0px"});
				} else if (acdifference < -126 && acdifference > -174) {
					$("#beer").css({backgroundPosition: "-"+ypos[2]+"px 0px"});
				} else if (acdifference < -174 && acdifference > -229) {
					$("#beer").css({backgroundPosition: "-"+ypos[3]+"px 0px"});
				} else if (acdifference < -229 && acdifference > -290) {
					$("#beer").css({backgroundPosition: "-"+ypos[4]+"px 0px"});
				} else if (acdifference < -290 && acdifference > -330) {
					$("#beer").css({backgroundPosition: "-"+ypos[5]+"px 0px"});
				} else if (acdifference > -330) {
					$("#beer").css({backgroundPosition: "-"+ypos[6]+"px 0px"});
				}
			} else {
				$("#beer").css({backgroundPosition: "-"+ypos[0]+"px 0px"});
			}
		}

		$('#nav a, .arrow a, .anchor').click(function(){
			$('html, body').stop().animate({
				scrollTop: $( $(this).attr('href') ).offset().top - 100
			}, 1000, "easeInOutCirc");
			return false;
		});

		$('#header .button').click(function(){
			$('html, body').stop().animate({
				scrollTop: $(this).parent().parent().parent().height()
			}, 1000, "easeInOutCirc");
			return false;
		});

		var intID;
		intID = setInterval ( RepeatCall, 700 );

		function RepeatCall() {
			$("#floater").toggleClass('down');
		}


		var marker;
		var map;
		var mapzoom = "";
		var styles = [
		  {
		    stylers: [
		      { hue: "#FFFAEF" },
		      { saturation: -70 }
		    ]
		  },{
		    featureType: "road",
		    elementType: "geometry",
		    stylers: [
		      { lightness: 100 },
		      { visibility: "simplified" }
		    ]
		  },{
		    featureType: "road",
		    elementType: "labels",
		    stylers: [
		      { visibility: "off" }
		    ]
		  }
		];

		mapzoom = 16

		function initialize() {
			var mapOptions = {
				zoom: 16,
				scrollwheel: false,
				mapTypeControl: false,
				disableDoubleClickZoom: true,
				disableDefaultUI: false,
				draggable: true,
				center: new google.maps.LatLng($(".ironmap").data("lat"), $(".ironmap").data("long")),
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			map = new google.maps.Map(document.getElementsByClassName('ironmap')[0], mapOptions);
			map.setOptions({styles: styles});

			var locInfo = '<h1>Bob\'s Bagels</h1>'
			var infowindow = new google.maps.InfoWindow({
      	content: locInfo,
  		});

			var bagelPic = 'images/bagel-map-marker.png'
			marker = new google.maps.Marker({
				map:map,
				draggable:true,
				icon: bagelPic,
				title: 'Bob\'s Bagels',
				animation: google.maps.Animation.DROP,
				position: new google.maps.LatLng($(".ironmap").data("lat"), $(".ironmap").data("long")),
			});

			google.maps.event.addListener(marker, 'click', function() {
    		infowindow.open(map,marker);
  		});

			$(".locationitem").each(function(){
				marker = new google.maps.Marker({
					map:map,
					draggable:true,
					animation: google.maps.Animation.DROP,
					position: new google.maps.LatLng($(this).data("lat"), $(this).data("long")),
				});
			});


		}

		// Custom Scrollspy
		if ($(".ironmap").length > 0) {
			initialize();
		}

		$(window).on("scroll", function(){
			// Distance from section to top
			var x = $(".contentsection.story").offset().top;
			// Height of section
			var z = $(".contentsection.story").height();

			// Distance scrolled from top
			var y = $(window).scrollTop();
			var actotal = Math.round(x+z);
			var acdifference = Math.round(z-x);

			if (y <= actotal && y >= x - 300) {
				$('#wheel img').css({'left':y - (actotal + 200),'-webkit-transform':'rotate('+y+'deg)','-moz-transform':'rotate('+y+'deg)','-o-transform':'rotate('+y+'deg)','-ms-transform':'rotate('+y+'deg)','transform':'rotate('+y+'deg)'});
			}
		});

		// Polaroid Generate
		$("#slideshow img").each(function(){
			$(this).clone().appendTo(".polaroid");
		});

		// Image Gallery
		$(".polaroid img").eq(0).addClass("one");
		$(".polaroid img").eq(1).addClass("two");
		$(".polaroid img").eq(2).addClass("three");
		$(".polaroid img").eq(3).addClass("four");

		$("body").addClass($("#colorpicker select").val());
		$("#colorpicker select").change(function(){
			$("body").removeClass();
			$("body").addClass($(this).val());
		});

		$("br").remove();

		$(".contentsection .content .falloff").each(function(){
			$($(this).parent().parent()).append($(this));
		});

		$("#navbutton").click(function(event){
			event.preventDefault();
			$("#nav #navitems ul").slideToggle();
			$(".openit").toggle();
			$(".closeit").toggle();
		});



		var maxHeight = -1;
		var totalcols = jQuery(".menuitem").length;

		function resetheights () {
			// Reset the heights to auto
			jQuery('.menuitem').each(function() {
				jQuery(this).height("auto");
			});

			maxHeight = 0;
			// Look through all elements and track the heights based on their position in their stack and apply to others in similar positions.
			for (var i=0; i < totalcols + 1; i++) {
				// Set our height tracker to zero


				jQuery('.menuitem:nth-child('+i+')').each(function() {
				     maxHeight = maxHeight > jQuery(this).height() ? maxHeight : jQuery(this).height();
				});

				jQuery('.menuitem:nth-child('+i+')').each(function() {
					jQuery(this).height(maxHeight);
				});
			}
		}

		resetheights();
	});

})(jQuery);
