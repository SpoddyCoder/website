class Renderer
	constructor: (@canvasId, people) ->
		@canvas = $('#' + @canvasId)[0]
		@ctx = @canvas.getContext('2d')
		@width = @canvas.width
		@height = @canvas.height
		@people = people

	update: () ->
		@ctx.clearRect(0, 0, @width, @height);
		@drawPeople()

	drawPeople: () ->
		for person in @people
			#@ctx.fillStyle = 'rgba(255,50,50,0.1)'
			#@ctx.beginPath()
			#@ctx.arc(person.x, person.y, person.personalSpace, 0, Math.PI*2, true)
			#@ctx.closePath()
			#@ctx.fill()
			@ctx.fillStyle = person.colour
			@ctx.beginPath()
			@ctx.arc(person.x, person.y, person.size, 0, Math.PI*2, true)
			@ctx.closePath()
			@ctx.fill()


class Person
	constructor: () ->
		@colour = '#5050ff'
		@size = 7
		@personalSpace = 20
		@x = 0
		@y = 0
		@xdir = 0
		@ydir = 0
		@neighbours = []
		@name = ''

	move: () ->
		# calculate movement direction based on neighbours
		xd = 0
		yd = 0
		for otherPerson in @neighbours
			dx = @x - otherPerson.x
			dy = @y - otherPerson.y
			px = Math.sqrt((dx*dx)+(dy*dy))
			fx = (dx && dx / Math.abs(dx)) * (Math.abs((@personalSpace - Math.abs(dx)) / @personalSpace)) * (Math.abs((@personalSpace - px) / @personalSpace))
			fy = (dy && dy / Math.abs(dy)) * (Math.abs((@personalSpace - Math.abs(dy)) / @personalSpace)) * (Math.abs((@personalSpace - px) / @personalSpace))
			xd += fx
			yd += fy
		@x += xd
		@y += yd
		@x += @xdir
		@y += @ydir


class GameEngine
	constructor: (canvasId, playId, stepId) ->
		@people = []
		@timer = null
		@playBtn = $('#' + playId)
		@stepBtn = $('#' + stepId)
		@renderer = new Renderer(canvasId, @people)
		@playBtn.bind('click', (event) => @togglePlay())
		@stepBtn.bind('click', (event) => @update())

	start: () ->
		@timer = setInterval =>
		  @update()
		, 20
	
	togglePlay: ->
		if(@timer?)
			clearInterval(@timer)
			@timer = null
			@playBtn.html("START")
		else 
			@playBtn.html("STOP")
			@start()

	update: () ->
		# update people
		for person in @people
			# first, assess the neighbours
			person.neighbours = []
			for otherPerson in @people
				if otherPerson != person
					dx = person.x - otherPerson.x
					dy = person.y - otherPerson.y
					dist = Math.sqrt((dx*dx) + (dy*dy))
					if dist < person.personalSpace
						person.neighbours.push(otherPerson)
			person.move()
			# put p1 back at start if he's off the screen
			if(person.name == 'p1' && person.x > @renderer.width)
				person.x = 0;
		# draw
		@renderer.update()

	addPerson: (person) ->
		@people.push(person)

	addRandomPeople: (numPeople) ->
		for i in [0..(numPeople-1)]
			person = new Person()
			person.x = (Math.random() * (@renderer.width / 1.75)) + @renderer.width / 8
			person.y = (Math.random() * (@renderer.height / 1.75)) + @renderer.height / 8
			@people.push(person)


# init
engine = new GameEngine('cnvs', 'play', 'step')
engine.addRandomPeople(200)

player = new Person()
player.colour = '#ff5050'
player.y = engine.renderer.height / 2
player.xdir = 1
player.ydir = 0
player.name = 'p1'
engine.addPerson(player)
engine.renderer.update()