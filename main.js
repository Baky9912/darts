$(document).ready(function(){
	var currentMoveScore=0;
	var currentPlayer=0;
	var players=['Default'];
	var p=501;
	var scores=[p];
	var thrown = [false,false,false];
	var green = [0,0];
	var speed = [-1,-1];
	var direction = [1,1];
	var fields = [13,4,18,1,20,5,12,9,14,11,8,16,7,19,3,17,2,15,10,6];
	var boardX = 700;
	var dartX = 115;

	function set(){
		for(var i=0;i<3;++i){
			var d = '#d'+i;
			var dart = $(d);
			$(d).css({top: 733, left: boardX/2 - dartX*3/2 + (dartX*i)});
			thrown[i]=false;
		}
	}
	function updateScores(){
		$('.points').each(function(index, el) {
			$(this).html(String(scores[index]));
		});
	}
	function updateCMove(){
		$('#cmove').html('<tr><td>'+ players[currentPlayer] +'</td></tr>'+'<tr><td>'+ currentMoveScore +'</td></tr>');
	}
	function setup(){
		for(var i=0;i<players.length;++i)scores[i]=p;
		
		$('#scores').html("");
		function addPlayer(player){
			$('#scores').append('<tr><td>'+player+'</td><td class="points">'+p+'</td></tr>');
		}
		players.forEach(addPlayer);
		updateScores();
		updateCMove();
		set();
	}
	setup();
	
	function addPlayer(){
		var s = $('#addP').val();
		if(players[0]=='Default'){
			players[0]=s;
		}
		else if(players.length<10){
			players.push(s);
			scores.push(p);
		}
	}
	
	function removePlayers(){
		players = ['Default'];
		scores = [p];
		setup();
	}
	function setBasePoints(){
		p = Number($('#basePoints').val());
		setup();
	}

	function win(index){
		$('#winner').html('Winner: ' + players[index]);
		$('#gameover').css({
			display: 'block'
		});
		setup();
	}

	function passMove(){
		if(scores[currentPlayer]-currentMoveScore>=0){
			scores[currentPlayer]-=currentMoveScore;
			updateScores();
		}
		if(scores[currentPlayer]==0)win(currentPlayer);
		
		currentPlayer = (currentPlayer+1) % players.length;
		currentMoveScore = 0;
		updateCMove();
	}

	

	function getScore(){
		function angle(x,y){
			var angle = Math.atan2(y, x);
	 	   	var degrees = 180*angle/Math.PI;
	    	return (360+Math.round(degrees))%360;
		}

		function magnitude(x,y){
			return Math.sqrt(x*x+y*y);
		}
		var mag = magnitude(x,y);
		var ang = angle(x,y);
		var multiplier;
		
		if(mag<=5)return 50;
		if(mag<=15)return 25;
		if(mag<=240 && mag>=230)multiplier=2;
		else if(mag<=150 && mag>=140)multiplier=3;
		else if(mag>240)multiplier = 0;
		else multiplier = 1;

		var field;
		if((ang<9 && ang>=0) || ang>=360-9)field=6;
		else field = fields[Math.floor(((ang-9)%360)/18)]; 
		return field*multiplier;
	}

	

	function move(){
		function rand(y, x){
			return y + Math.random() * (x-y);
		}

		for(var i=0;i<2;++i){
			green[i]+=speed[i]*direction[i];
			if(green[i]>boardX){
				speed[i]=rand(4,7.6);
				green[i]=boardX-speed[i];
				direction[i]*= -1;
			}
			else if(green[i]<0){
				speed[i]=rand(4,7.6);
				green[i]=speed[i];
				direction[i]*= -1;
			}
		}
		$('#barHorizontal').css({
			width: Math.floor(green[0])
		});
		$('#barVertical').css({
			height: Math.floor(green[1])
		});
	}

	function throwDart(ind){
		var id = '#d'+ind;
		if(!thrown[ind]){
    		$(id).animate({
    			left: green[0],
    			top: green[1] - dartX
    		}, 230);

    		x = green[0] - boardX/2;
			y = boardX - green[1] - boardX/2;
			currentMoveScore+=getScore(x,y);
    		updateCMove();
    		thrown[ind]=true;
		}
	}

	$(document).on('keypress',function(e) {
	    if(e.which == 120 || e.which == 88) {
	        for(var i=0;i<3;++i){
	        	if(!thrown[i]){
	        		throwDart(i);
	        		break;
	        	}
	        }
	    }
	    else if(e.which == 114 || e.which == 84){
	    	set();
	    	passMove();
	    }
    });
	$('.dart').click(function(){
		var i = $('.dart').index(this);
		throwDart(i);
	});
	$('#butt').click(function(){
		set();
		passMove();
	});
	$('#add').click(function() {
		addPlayer();
		setup();
	});
	$('#base').click(function() {
		setBasePoints();
		setup();
	});
	$('#rem').click(function() {
		removePlayers();
		setup();
	});
	$('#restart').click(function() {
		$('#gameover').css({
			display: 'none'
		});
		setup();
	});

	set();
	setInterval(function(){move()},8);
});