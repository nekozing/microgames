(function(global){
    var FPS = 60;
    var Game = new Object();
    var context;
    var graphics;
    var COLOR = {
        BLACK : "#000000",
        RED   : "#880000",
        GREEN : "#008800",
        BLUE  : "#000088",
    };
    var text = "WAIT";
    
    var Item = function(color, interval, text) {
        this.color = color;
        this.timeToFire = 0;
        this.interval = interval;
        this.text = text;
    };
    
    Item.prototype.notifyAllListeners = function() {
        // badly implemented dummy observer
        text = this.text;
    };
    
    Game.init = function(canvas) {
        graphics = new Graphics(canvas);
        var queue = new Queue();
        queue.enqueue(new Item(COLOR.RED, 180, "RED"));
        queue.enqueue(new Item(COLOR.BLUE, 300, "BLUE"));
        queue.enqueue(new Item(COLOR.GREEN, 420, "GREEN"));
        this.queue = queue;
    };
    
    Game.run = function() {
        setInterval(function(){
           Game.update();
           Game.render();
        }, 1000/FPS);
        Game.debug();
    };
    
    Game.update = function() {
        // console.log("update");
        this.queue.update();
    };
    
    Game.render = function() {
        graphics.clear();
        this.renderBar();
        this.queue.arr.forEach(function(item){
            var x = item.timeToFire / item.interval * 800;
            graphics.rect(x ,301, 20, 48, item.color); 
        });
        graphics.simpleText(text);
    };
    
    Game.renderBar = function() {
        graphics.rect(0, 300, 800, 50, COLOR.BLACK);
    };
    
    Game.debug = function() {
        console.log(graphics);  
    };
    
    var Graphics = function(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
    };
    Graphics.prototype.rect = function(x, y, w, h, color) {
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.rect(x, y, w, h);
        this.context.stroke();
    }
    Graphics.prototype.clear = function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    Graphics.prototype.simpleText = function(text) {
        this.context.fillText(text, 10, 10);
    }
    
    var Queue = function() {
        this.arr = new Array();
    };
    
    Queue.prototype.enqueue = function(item) {
        // SUPER HACKY QUICK IMPLEMENTATION
        this.arr.push(item);
        this.arr.sort(function(a, b){
            return a.timeToFire < b.timeToFire;
        });
    };
    
    Queue.prototype.dequeue = function() {
        return this.arr.pop();
    };
    
    Queue.prototype.poll = function() {
        // NO BOUNDARY CHECK
        return this.arr[this.arr.length - 1];
    };
    
    Queue.prototype.update = function() {
        if(this.poll().timeToFire <= 0) {
            var item = this.dequeue();
            item.notifyAllListeners();
            item.timeToFire = item.interval;
            this.enqueue(item);
        }
        
        this.arr.forEach(function(item){
            item.timeToFire --;
        });
    };
    
    
    global.Game = Game;
}(this));