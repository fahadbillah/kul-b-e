import { version } from '../../../package.json';
import { Router } from 'express';
import uuidv4 from 'uuid/v4';
const jsonfile = require('jsonfile')
const file = './db.json';

class Pet {
	test() {

	}

	createPet(req, res){
		let db = jsonfile.readFileSync(file); 
		let statusCode = 200;
		let error = false;
		let responseData;
		let formData = req.body;
		formData._id = uuidv4();

		formData.type = formData.type.toLowerCase().trim()
		if (db[formData.type] === undefined) {
			error = true;
			statusCode = 400;
			responseData = {message: "Pet type not matched"};
		} else {
			let breed = db[formData.type].filter(breed => {
				if (breed._id === formData.breed) {
					formData.breed = breed.name;
					return breed.name;
				}
			});
		
			if (!breed.length) {
				error = true;
				statusCode = 400;
				responseData = {message: "Breed not found"};
			}
		}


		let petShortInfo = {
			"_id": formData._id,
			"info": formData.type+" : "+formData.name+" ("+formData.breed+")"
		}
		
		let owner = db.owner.filter(owner => {
			if (owner._id === formData.owner) {
				// formData.owner = breed.name;
				if (owner.pets) {
					owner.pets.push(petShortInfo)
				} else {
					owner.pets = [petShortInfo];
				}
				return owner;
			}
		});
		
		if (!owner.length) {
			error = true;
			statusCode = 400;
			responseData = {message: "Owner not found"};
		}
		
		if (!error) {
			db.pet.push(formData);
			statusCode = 201;
			responseData = {message: "Pet inserted", data: formData};
			jsonfile.writeFile(file, db, err => {
				console.error(err)
			})
		}

		res
		.status(statusCode)
		.json(responseData)
		.end();
	}
}

export default ({ config }) => {
	let api = Router();
	let pet = new Pet()
	// mount the facets resource
	// api.use('/facets', facets({ config }));

	// perhaps expose some API metadata at the root
	api.get('/owners', (req, res) => {
		let db = jsonfile.readFileSync(file); 
		res.json(db.owner);
	});
	api.get('/pets', (req, res) => {
		let db = jsonfile.readFileSync(file); 
		res.json(db.pet);
	});
	api.post('/pet', pet.createPet);

	return api;
}
