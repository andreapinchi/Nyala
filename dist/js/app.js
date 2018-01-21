$(document).ready(function() {
	
	//setInterval(function () {run()}, 500)
					
	var bgPos = 0;				
	var prepareToStand;
	var mvmt = 80;
	var front_mvmt = 260; //simulate parallax
	var windWidth = $( window ).width();

	//init game
	var gameStarted = false;
	var gameFinished = false;
	var progress = 0;
	var progress_km = 0;
	var timerInterval;
	var totalMetres = 6000; //6000 = 6Km
	
	var $front_elements = $('#front_elements');
	var $back_elements = $('#back_elements');

	var waitingTime = 5, //seconds until gameover
		display = $('#chrono');
	

	var elements = ['elements_sudan-01.png','elements_sudan-02.png','elements_sudan-03.png','elements_sudan-04.png'];
	var baloon = ["Hurry Up!","Don't stop","Already tired?","Need water!", "Hey there?","Keep running!"];
	var baloon_count = 0;

	$('#play_btn').click(function (event){
		showInstructions();
	})
	
	$('#trigger').click(function (event) {
		run();
		if(!gameStarted){
			startGame();
			gameStarted = true;
		}
			
	});

	updateProgress();

	TweenMax.set($('#runner_stand'), {left:'150vw'});
	TweenMax.set($('#bg_terrain'), {'background-position-x':'150vw'});

	function showInstructions(){
		$('#title_container').fadeOut('slow');
		TweenMax.to($('#bg_terrain'), 2, {'background-position-x':0});
		TweenMax.to($('#runner_stand'), 2, {left:'0', onComplete: readyToStart});
	}

	var readyToStart = function(){
		$('#instruction_container').fadeIn('slow', function(){
			$('#bg_terrain').css('transition', 'all .5s ease-out');
			$('#trigger').show();
		});
	}


	function startGame(){
		$('#instruction_container').fadeOut('slow');
		$('#interface_container').fadeIn('slow');
	}

	function gameOver(){
		gameFinished = true;
		$('#interface_container').hide();
		$('#baloon').hide();
		$('#chrono_container').hide();
		$('#trigger').hide();
		
		$('#gameover_text').fadeIn(150, function(){	});
		$('#gameover_text').click(function(e){
			e.preventDefault();
			gameOverPanel();
		})
	}

	function gameOverPanel(){
		$('#runner_stand').fadeOut(1000);
		$('#gameover_text').fadeOut(1000, function(){ });
		$('#gameover_container').fadeIn(1000, function(){
			setTimeout(function () {
			gameOverAnimation()
		},1000)
		});
	}

	function gameOverAnimation(){
		TweenMax.set($('#gameover_desc p.appear'), {'opacity':0});
		$('#gameover_desc').fadeIn(1000, function(){
			$('#gameover_desc p.appear').each(function(i,el){
				TweenMax.to(el, 2, {'opacity':1, delay: 1+(i*2.5)});
			})
		})
	}
	
	function finishGame () {
		$('#finish_text').text('FINISH!')
		$('#gameover_text h2').html('YOU<br>WIN');

		gameOver();
	}

	function run() {
		clearTimeout(prepareToStand);
		clearInterval(timerInterval);
		
		//move bg
		bgPos -= mvmt;
		$('#bg_terrain').css('background-position-x', bgPos);
		//move elements
		moveFrontEl();
		moveBackEl();
		
		//show correct gif
		$('#runner_run').show();
		$('#runner_stand').hide();

		progress += 100/totalMetres; 
		progress_km += .001; //each click is 1m
		updateProgress();

		$('#baloon').hide();
		$('#chrono_container').hide();
		
		//stop if user is not clicking
		prepareToStand = setTimeout(function () {
			stand(); 
		}, 500);

	}

	function updateProgress(){
		remaining_km = ((totalMetres/1000)-progress_km).toFixed(3);
		km = Math.floor(remaining_km)
		m = (remaining_km-km).toFixed(3)*1000;
		$('#progress_km').text(km);
		$('#progress_m').text(m);

		$('#bar').css('width', progress+"%");
		if (progress >= 100) { //check progress: if 100% game is finished
			finishGame();
		}
	}


	
	function moveFrontEl() {
		if($front_elements.position().left > -500){
			$front_elements.show();
			$front_elements.css({left: '-='+front_mvmt+'px'});
		}else{
			$front_elements.hide();
			$front_elements.css({left: windWidth + Math.random()*1000+'px'});

			el = Math.floor(Math.random() * elements.length);
			$front_elements.css('background-image', 'url(img/'+elements[el])
		}
	}
	
	function moveBackEl() {
		if($back_elements.position().left > -500){
			$back_elements.show();
			$back_elements.css({left: '-='+(mvmt+40)+'px'});
		}else{
			$back_elements.hide();
			$back_elements.css({left: windWidth + Math.random()*1000+'px'});

			el = Math.floor(Math.random() * elements.length);
			$back_elements.css('background-image', 'url(img/'+elements[el])
		}
	}
	
	function stand(){
		$('#runner_run').hide();
		$('#runner_stand').show();

		//prepare for Game Over
		if(!gameFinished){
			display.text(waitingTime);	
			
			$('#baloon').text(baloon[baloon_count])
			baloon_count++;
			if(baloon_count >= baloon.length) baloon_count = 0;

			$('#baloon').fadeIn(450, function(){
				startTimer(waitingTime, display);
				$('#chrono_container').fadeIn('fast');
			});
		}					
	}

	function startTimer(duration, display) {
		
	    var timer = duration, hours, minutes, seconds;
	    timerInterval = setInterval(function () {
	    	timer --;
	    	//hours = "0"+parseInt( timer / 3600 ) % 24;
			//minutes = parseInt( timer / 60 ) % 60;
			seconds = timer % 60;

	        //minutes = minutes < 10 ? "0" + minutes : minutes;
	        seconds = seconds < 10 ? seconds : seconds;

	        //display.text(hours + ':' + minutes + ":" + seconds);
	        display.text(seconds);
	        
	        if (timer < 0) {
	        	gameOver();
	        	
	        	display.text('0');
	        	clearInterval(timerInterval);
	            //timer = duration;
	        }

		}, 1000);
	}		
	
});