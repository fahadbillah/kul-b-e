import { Router } from 'express';
import uuidv4 from 'uuid/v4';
const jsonfile = require('jsonfile')
const file = './db.json';

class Pet {
	savePet(req, res){
		let db = jsonfile.readFileSync(file); 
		let statusCode = 200;
		let error = false;
		let responseData;
		let formData = req.body;
		const actionType = formData._id && (req.method === 'PUT') ? 'edit':'add';
		formData._id = formData._id || uuidv4();

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
				if (actionType === 'add') {
					if (owner.pets) {
						owner.pets.push(petShortInfo)
					} else {
						owner.pets = [petShortInfo];
					}
				} else if (actionType === 'edit') {
					if (owner.pets) {
						owner.pets
						.map(pet => {
							if (pet._id === formData._id) {
								pet.info = formData.type+" : "+formData.name+" ("+formData.breed+")"
							}
						})
					}
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
			if (actionType === 'add') {
				db.pet.push(formData);
				responseData = {message: "Pet inserted", data: formData};
				statusCode = 201;
			} else if (actionType === 'edit') {
				db.pet.map((pet, index) => {
					if(pet._id === formData._id){
						db.pet[index] = formData
					}
				})
				responseData = {message: "Pet updated", data: formData};
			}
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

	api.get('/owners', (req, res) => {
		let db = jsonfile.readFileSync(file); 
		res.json(db.owner);
	});

	api.get('/pets', (req, res) => {
		let db = jsonfile.readFileSync(file); 
		res.json(db.pet);
	});

	api.post('/pet', pet.savePet);
	api.put('/pet', pet.savePet);

	return api;
}
