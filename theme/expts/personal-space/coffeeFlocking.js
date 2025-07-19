(function() {
  var GameEngine, Person, Renderer, engine, player;

  Renderer = (function() {

    function Renderer(canvasId, people) {
      this.canvasId = canvasId;
      this.canvas = jQuery('#' + this.canvasId)[0];
      this.ctx = this.canvas.getContext('2d');
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.people = people;
    }

    Renderer.prototype.update = function() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      return this.drawPeople();
    };

    Renderer.prototype.drawPeople = function() {
      var person, _i, _len, _ref, _results;
      _ref = this.people;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        person = _ref[_i];
        this.ctx.fillStyle = person.colour;
        this.ctx.beginPath();
        this.ctx.arc(person.x, person.y, person.size, 0, Math.PI * 2, true);
        this.ctx.closePath();
        _results.push(this.ctx.fill());
      }
      return _results;
    };

    return Renderer;

  })();

  Person = (function() {

    function Person() {
      this.colour = '#5050ff';
      this.size = 7;
      this.personalSpace = 20;
      this.x = 0;
      this.y = 0;
      this.xdir = 0;
      this.ydir = 0;
      this.neighbours = [];
      this.name = '';
    }

    Person.prototype.move = function() {
      var dx, dy, fx, fy, otherPerson, px, xd, yd, _i, _len, _ref;
      xd = 0;
      yd = 0;
      _ref = this.neighbours;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        otherPerson = _ref[_i];
        dx = this.x - otherPerson.x;
        dy = this.y - otherPerson.y;
        px = Math.sqrt((dx * dx) + (dy * dy));
        fx = (dx && dx / Math.abs(dx)) * (Math.abs((this.personalSpace - Math.abs(dx)) / this.personalSpace)) * (Math.abs((this.personalSpace - px) / this.personalSpace));
        fy = (dy && dy / Math.abs(dy)) * (Math.abs((this.personalSpace - Math.abs(dy)) / this.personalSpace)) * (Math.abs((this.personalSpace - px) / this.personalSpace));
        xd += fx;
        yd += fy;
      }
      this.x += xd;
      this.y += yd;
      this.x += this.xdir;
      return this.y += this.ydir;
    };

    return Person;

  })();

  GameEngine = (function() {

    function GameEngine(canvasId, playId, stepId) {
      var _this = this;
      this.people = [];
      this.timer = null;
      this.playBtn = jQuery('#' + playId);
      this.stepBtn = jQuery('#' + stepId);
      this.renderer = new Renderer(canvasId, this.people);
      this.playBtn.bind('click', function(event) {
        return _this.togglePlay();
      });
      this.stepBtn.bind('click', function(event) {
        return _this.update();
      });
    }

    GameEngine.prototype.start = function() {
      var _this = this;
      return this.timer = setInterval(function() {
        return _this.update();
      }, 20);
    };

    GameEngine.prototype.togglePlay = function() {
      if ((this.timer != null)) {
        clearInterval(this.timer);
        this.timer = null;
        return this.playBtn.html("START");
      } else {
        this.playBtn.html("STOP");
        return this.start();
      }
    };

    GameEngine.prototype.update = function() {
      var dist, dx, dy, otherPerson, person, _i, _j, _len, _len2, _ref, _ref2;
      _ref = this.people;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        person = _ref[_i];
        person.neighbours = [];
        _ref2 = this.people;
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          otherPerson = _ref2[_j];
          if (otherPerson !== person) {
            dx = person.x - otherPerson.x;
            dy = person.y - otherPerson.y;
            dist = Math.sqrt((dx * dx) + (dy * dy));
            if (dist < person.personalSpace) person.neighbours.push(otherPerson);
          }
        }
        person.move();
        if(person.name == 'p1' && person.x > this.renderer.width) {
        	person.x = 0;
        }
      }
      return this.renderer.update();
    };

    GameEngine.prototype.addPerson = function(person) {
      return this.people.push(person);
    };

    GameEngine.prototype.addRandomPeople = function(numPeople) {
      var i, person, _ref, _results;
      _results = [];
      for (i = 0, _ref = numPeople - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        person = new Person();
        person.x = (Math.random() * (this.renderer.width / 1.25)) + this.renderer.width / 8;
        person.y = (Math.random() * (this.renderer.height / 1.25)) + this.renderer.height / 8;
        _results.push(this.people.push(person));
      }
      return _results;
    };

    return GameEngine;

  })();

  engine = new GameEngine('cnvs', 'play', 'step');

  engine.addRandomPeople(200);

  player = new Person();

  player.colour = '#ff5050';

  player.y = engine.renderer.height / 2;

  player.xdir = 1;

  player.ydir = 0;

  player.name = 'p1';

  engine.addPerson(player);

  engine.renderer.update();

}).call(this);
