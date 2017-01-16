const chai = require('chai');
const chaiHttp = require('chai-http');

const{app, closeServer, runServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Recipes', function() {

	before(function() {
		return runServer();
	});

	after(function() {
		return closeServer();
	});

//GET

	it ('should list items on GET', function() {
	return chai.request(server)
		.get('/Recipes')
		.then(function(res) {
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a('array');
			res.body.length.should.be.at.least(1);
		const expectedKeys = ['id', 'name', 'ingredients'];
		res.body.forEach(function(item) {
			item.should.be.a('object');
			item.should.include.keys(expectedKeys);
		});
	});
});

//POST

	it('should add an item on POST', function() {
		const newItem = {name: 'coffee', checked: false};
		return chai.request(server)
			.post('/Recipes')
			.send(newItem)
			.then(function(res) {
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.include.keys('id', 'name', 'ingredients');
				res.body.id.should.not.be.null;
				res.body.ingredients.should.equal(newRecipe.name);
				res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}));
		});
	});

//PUT

	it('should update items on PUT', function() {
		const updateData = {
			name: 'foo',
			ingredients: ['bizz', 'bang']
		};

		return chai.request(app)
			.get('/recipes')
			.then(function(res) {
				updateData.id = res.body[0].id;

				return chai.request(app)
					.put('/recipes/${updateData.id}')
					.send(updateData)		
			})

			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.deep.equal(updateData);
			});
	});

//DELETE

	it('should delete items on DELETE', function(){
		return chai.request(server)
			.get('/recipes')
			.then(function(res) {
				return chai.request(server)
					.delete('/recipes/${res.body[0].id}');
			})

			.then(function(res) {
				res.should.have.status(204);
			});
	});
});