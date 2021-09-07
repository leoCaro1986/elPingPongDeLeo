//Modelo
(function(){
    self.Board = function(width, height){
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars =[];
        this.ball = null;
        this.playing = false;
    }

    self.Board.prototype = {
        get elements(){
            var elements =this.bars.map(function(bar){return bar;});
            elements.push(this.ball);
            return elements;
        }
    }
})();

(function(){
    self.ball = function(x,y,radius,board){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed_y = 0;
        this.speed_x = 3;
        this.board = board;
        this.direction = 1;

        board.ball= this;
        this.kind = "circle";

        
    }

    self.ball.prototype = {
        move: function(){
            this.x +=(this.speed_x * this.direction );
            this.y +=(this.speed_y);
        }
    }

})();

(function(){
    self.Bar=function(x,y,width,height,board){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed=10;
    }

    self.Bar.prototype = {
      down: function(){
        this.y +=this.speed;
      },
      collision: function(bar){
        //reacciona a la colisión con una barra que recibe como parametro
      },
      up: function(){
        this.y -=this.speed;
      },
      toString: function(){
        return "x: "+ this.x +" y: "+ this.y;  
      }  
    }
})();

//Vista
(function(){
    self.BoardView = function(canvas,board){
      this.canvas = canvas;
      this.canvas.width = board.width;
      this.canvas.height = board.height;  
      this.board = board;
      this.ctx = canvas.getContext("2d");
    }

    self.BoardView.prototype ={
        clean: function(){
            this.ctx.clearRect(0,0,this.board.width,this.board.height);
        },
        draw: function(){
            for (var i = this.board.elements.length - 1; i >= 0; i--){
                var el = this.board.elements[i];

                draw(this.ctx, el);
            };
        },
        check_collisions: function(){
            for (var i = this.board.bars.length - 1; i >= 0; i--){
                var bar = this.board.bars[i];

               if(hit(bar, this.board.ball)){
                 this.board.ball.collision(bar);
               } 
            };
        },
        play: function(){
            if(this.board.playing){
                this.clean();
                this.draw();
                this.board.ball.move();
            }
            
        }
    }

    function hit(a,b){
        //revisa si a coliciona con b

    }

function draw(ctx,element){
  //if(element != null && element.hasOwnProperty("kind")){
    switch(element.kind){
        case "rectangle":
            ctx.fillRect(element.x, element.y,element.width,element.height);
            break;
        case "circle":
            ctx.beginPath();
            ctx.arc(element.x, element.y, element.radius, 0, 7); 
            ctx.fill();
            ctx.closePath();    
            break;   
      } 
  //}  
   
}    
})();

var board = new Board(800,400);
var bar = new Bar(20,100,40,100,board);
var bar_2 = new Bar(740,100,40,100,board);
var canvas = document.getElementById("canvas");
var board_view = new BoardView(canvas,board);
var ball = new ball(400, 80, 10, board);


/*Evento que escucha el movimiento detectado con el movimiento de las teclas
para el desplazamiento de las barras*/
document.addEventListener("keydown",function(ev){
    //ev.preventDefault();
    if(ev.keyCode==38){
        ev.preventDefault();
        bar.up();
    }
    else if(ev.keyCode==40){
        bar.down();
    }else if(ev.keyCode===87){
        //w
        bar_2.up();
    }else if(ev.keyCode===83){
        //s
        bar_2.down();
    }else if(ev.keyCode===32){
        ev.preventDefault();
        board.playing = !board.playing;
    }
});

board_view.draw();

//self.addEventListener("load", main);
window.requestAnimationFrame(controller);


//Controlador
function controller(){
    board_view.play();
    window.requestAnimationFrame(controller);
}