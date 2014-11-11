(function($) {
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
				//console.log(acdifference);
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

			var bagelPic = '/images/bagel-map-marker.png'
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
