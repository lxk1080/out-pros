/* SET RANDOM LOADER COLORS FOR DEMO PURPOSES */	
	//var demoColorArray = ['red','blue','green','yellow','purple','gray'];
	var demoColorArray = ['yellow'];
	var colorIndex = Math.floor(Math.random()*demoColorArray.length);
	setSkin(demoColorArray[colorIndex]);
	/* RANDOM LARGE IMAGES FOR DEMO PURPOSES */	
	
	// Stripes interval
	var stripesAnim;
	var calcPercent;
	
	$progress = $('.progress-bar');
	$percent = $('.percentage');
	$stripes = $('.progress-stripes');
	$stripes.text(' ');
	
	/* CHANGE LOADER SKIN */
	$('.skin').click(function(){
		var whichColor = $(this).attr('id');
		setSkin(whichColor);
	});
	
	// Call function to load array of images
	preload(demoImgArray);
	
	// Call function to animate stripes
	stripesAnimate(); 
	
	/* WHEN LOADED */
	$(window).load(function() {
		loaded = true;
		$progress.animate({
			width: "100%"
		}, 100, function() {
			$('.loader_text').text('Loaded!').addClass('loaded');
			$(".loader_box").remove();
			home_ac();
			$percent.text('100%');
			clearInterval(calcPercent);
			clearInterval(stripesAnim);
		});
	});
	
	/*** FUNCTIONS ***/
	
	/* LOADING */
	function preload(imgArray) {
		var increment = Math.floor(100 / imgArray.length);
		$(imgArray).each(function() {
			$('<img>').attr("src", this).load(function() {
				$progress.animate({
					width: "+=" + increment + "%"
				}, 100);
			});
		});
		calcPercent = setInterval(function() {
			
			//loop through the items
			$percent.text(Math.floor(($progress.width() / $('.loader').width()) * 100) + '%');
			
		});
	}
	
	/* STRIPES ANIMATION */
	function stripesAnimate() {
		animating();
		stripesAnim = setInterval(animating, 2500);
	}

	function animating() {
		$stripes.animate({
			marginLeft: "-=30px"
		}, 2500, "linear").append('');
	} 
	
	function setSkin(skin){
		$('.loader').attr('class', 'loader '+skin);
		$('.loader span').hasClass('loaded') ? $('.loader span').attr('class', 'loaded '+skin) : $('.loader span').attr('class', skin);
	}