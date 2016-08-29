var checkUsernameTimer;
var checkMobileTimer;
var checkEmailTimer;

window.onload = function () {
	global();

	$('[data-toggle="tooltip"]').tooltip();

	$('li.active').removeClass('active');
	$("#indexMenuItem").addClass('active');

	if (sessionStorage.loggedIn == 'true') {
		$("#signupForm").hide();
		$("#promotions").after($("#liveStats"));
	} else {
		$("#signupForm").show();
		$("#signupForm").after($("#liveStats"));
	}

	$("#userRegisterUsername").on({
		input: function () {
			checkUsernameTimer = setTimeout(checkUsername, 500);
		}
	});

	$("#userRegisterPhone").intlTelInput({
		initialCountry: "auto",
		geoIpLookup: function (callback) {
			$.get('https://ipinfo.io', function () {}, "jsonp").always(function (resp) {
				var countryCode = (resp && resp.country) ? resp.country : "";
				callback(countryCode);
			});
		},
		utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/8.4.9/js/utils.js"
	});

	$("#userRegisterPhone").on({
		input: function () {
			checkMobileTimer = setTimeout(checkMobile, 500);
		},
		focus: function () {
			$("#userRegisterPhoneExplanation").show();
			setTimeout(function () {
				$("#userRegisterPhoneExplanation").hide();
			}, 6000);
		}
	});

	$("#userRegisterEmail").on({
		input: function () {
			checkEmailTimer = setTimeout(checkEmail, 500);
		}
	});

	updateLiveStats();
	setTimeout(updateLiveStats, 5000);
	addPromotions();
	addTestimonials();
}

function checkUsername() {
	if ($("#userRegisterUsername").val().length == 0) {
		$("#userRegisterUsername").css('border', red).attr('title', "You need to enter a username");
		$("#usernameValidation").removeClass().addClass('fa fa-times').css('color', 'red').show();
		isEmailAddressValid = false;
	} else {
		$.post('./php/users/checkusername.php', {
			username: $("#userRegisterUsername").val()
		}, function (response) {
			if (response == 'exists') {
				$("#userRegisterUsername").css('border', red).attr('title', "Username already exists");
				$("#usernameValidation").removeClass().addClass('fa fa-times').css('color', 'red').show();
				isUsernameValid = false;
			} else if (response == 'notexists') {
				$("#userRegisterUsername").css('border', green).attr('title', "Username doesn't already exist");
				$("#usernameValidation").removeClass().addClass('fa fa-check').css('color', 'green').show();

				isUsernameValid = true;
			} else {
				displayMessage('error', 'Error', 'Error checking if username exists');
			}
		}).fail(function (request, textStatus, errorThrown) {
			//displayMessage('error', 'Error', "Err or: Something went wrong with checkusername function");
		});
	}
}

function checkMobile() {
	if (!$('#userRegisterPhone').intlTelInput("isValidNumber")) {
		$("#userRegisterPhone").css('border', red).attr('title', "This phone number is invalid");
		$("#phoneValidation").removeClass().addClass('fa fa-times').css('color', 'red').show();
		isMobileNumberValid = false;
	} else {
		$("#userRegisterPhone").css('border', green).attr('title', "This is a valid phone number");
		$("#phoneValidation").removeClass().addClass('fa fa-check').css('color', 'green').show();
		isMobileNumberValid = true;
	}
}

function checkEmail() {
	if ($("#userRegisterEmail").val().length == 0) {
		$("#userRegisterEmail").css('border', red).attr('title', "You need to enter an email address");
		$("#emailValidation").removeClass().addClass('fa fa-times').css('color', 'red').show();
		isEmailAddressValid = false;
	} else if ($("#userRegisterEmail").val().indexOf('@') == -1 || $("#userRegisterEmail").val().lastIndexOf('.') == -1 ||
			$("#userRegisterEmail").val().lastIndexOf('.') < $("#userRegisterEmail").val().indexOf('@')) {
		$("#userRegisterEmail").css('border', red).attr('title', "Your email address needs to include an @ and a . in it");
		$("#emailValidation").removeClass().addClass('fa fa-times').css('color', 'red').show();
		isEmailAddressValid = false;
	} else {
		$.post('./php/users/checkemail.php', {
			email: $("#userRegisterEmail").val()
		}, function (response) {
			if (response == 'exists') {
				$("#userRegisterEmail").css('border', red).attr('title', "This email is already associated with an account");
				$("#emailValidation").removeClass().addClass('fa fa-times').css('color', 'red').show();
				isEmailAddressValid = false;
			} else if (response == 'notexists') {
				$("#userRegisterEmail").css('border', green).attr('title', "This email isn't associated with an account");
				$("#emailValidation").removeClass().addClass('fa fa-check').css('color', 'green').show();
				isEmailAddressValid = true;
			} else {
				displayMessage('error', 'Error', 'Error checking if email exists');
			}
		}).fail(function (request, textStatus, errorThrown) {
			//displayMessage('error', 'Error', "Err or: Something went wrong with checkusername function");
		});
	}
}

function updateLiveStats() {
	$.post('./php/users/getlivestats.php', {},
			function (response) {
				var timeLive = '';
				var t = response[1];
				if (response[1] > 365) {
					timeLive = Math.floor(t / 365) + ' year' + (t > 730 ? 's' : '');
				} else if (response[1] > 30) {
					timeLive = Math.floor(t / 30) + ' month' + (t > 60 ? 's' : '');
				} else {
					timeLive = Math.floor(t) + ' day' + (t > 2 ? 's' : '');
				}

				$("#liveStatsRegisteredUserValue").text(response[0]);
				$("#liveStatsPlayingSinceValue").text(timeLive);
				$("#liveStatsTournamentPrizeValue").text('' + response[2]);
				$("#liveStatsLiveQuizzesValue").text(response[3]);
			   // displayMessage('info', '', response[3]);
			}, 'json').fail(function (request, textStatus, errorThrown) {
		//displayMessage('error', 'Error', "Err or: Something went wrong with updateLiveStats function");
	});
}

function addPromotions() {
	$.post('./php/promotions/getallpromotions.php', {
	}, function (response) {
		if (response[0] == 'success') {
			var html = '';

			for (var i = 0; response[1] !== null && i < response[1].length; i += 1) {
				html += '    <div class="item ">';
				html += '        <div class="col-md-4">';
				if (sessionStorage.loggedIn == 'true') {
					html += '        <a href="quizinfo.php?id=' + response[1][i].quizID + '">';
				} else {
					html += '        <a href="letsplayfree.php?id=' + response[1][i].quizID + '">';
				}
				html += '            <img class="promotionImage img-responsive" src="./php/promotions/uploads/' + response[1][i].imageURL + '">';
				html += '            </a>';
				html += '        </div>';
				html += '    </div>';
			}

			$("#promotionCarousel .carousel-inner").empty().append(html);
			$("#promotionCarousel .carousel-inner :nth-child(1)").addClass('active');

			if (response.length === 0) {
				$("#promotions").hide();
			}

			$('#promotionCarousel').carousel({
				interval: 7000
			});

			$('#promotionCarousel.carousel .item').each(function() {
				var next = $(this).next();
				if (!next.length) {
					next = $(this).siblings(':first');
				}
				next.children(':first-child').clone().appendTo($(this));

				if (next.next().length > 0) {
					next.next().children(':first-child').clone().appendTo($(this));
				}
				else {
					$(this).siblings(':first').children(':first-child').clone().appendTo($(this));
				}
			});
		} else {
			displayMessage('error', '', "Promotions failed to load. Please use the contact form to inform us of this problem.")
		}
	}, 'json').fail(function (request, textStatus, errorThrown) {
		//displayMessage('error', 'Error', "Err or: Something went wrong with addPromotions function");
	});
}

function addTestimonials() {
	$.post('./php/testimonials/getalltestimonials.php', {
	}, function (response) {
		if (response[0] == 'success') {
			var html = '';
			 html += '<ol class="carousel-indicators">';
			for (var i = 0; response[1] != null && i < response[1].length; i += 1) {
				html += '<li data-target="#testimonialCarousel" data-slide-to="'+i+'" class="active"></li>';
			}
			html += '</ol>';
			html += '<div class="carousel-inner" role="listbox">';

			for (var i = 0; response[1] != null && i < response[1].length; i += 1) {

				html += '   <div class="item ">';
				html += '       <div class="test1" >';
				html += '            <img style="width:100px; height:100px;" class="testimonialImages img-circle" src="./php/testimonials/uploads/' + response[1][i].imageURL + '">';
				html += '       </div>';
				html += '       <div class="test2"><span class="span1">' + response[1][i].username + ' </span> <br/> <span class="student"></span></div>';
				html += '       <blockquote>';
				html += '           <p>' + response[1][i].message + '</p>';
				html += '       </blockquote>';
				html += '   </div>';

				/* html += '<div class="item">';
				 html += '    <blockquote>';
				 html += '        <img class="testimonialImages" src="./php/testimonials/uploads/' + response[1][i].imageURL + '">';
				 html += '        <p>' + response[1][i].message + '</p>';
				 html += '        <footer>' + response[1][i].username + '</footer>';
				 html += '    </blockquote>';
				 html += '</div>';*/
			}

			html += '</div>';

			$("#testimonialCarousel").empty().append(html);
			$("#testimonialCarousel > div > :nth-child(1)").addClass('active');

			if (response.length == 0) {
				$("#testimonials").hide();
			}
		} else {
			displayMessage('error', '', "Testimonials failed to load. Please use the contact form to inform us of this problem.")
		}
	}, 'json').fail(function (request, textStatus, errorThrown) {
		//displayMessage('error', 'Error', "Err or: Something went wrong with addPromotions function");
	});
}
