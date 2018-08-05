import { Router } from 'express';
import { buildSchema } from 'graphql';
import graphqlHTTP from 'express-graphql';
const jsonfile = require('jsonfile')
const file = './db.json';

export default ({ config }) => {
    let graphQL = Router();

    const schema = buildSchema(`
        type Query {
            hello: String
            ownerList: [String]
            petList(type: String): [String]
        }
        type Pet {
            name: String
            breed: String
        }
    `);

    // The root provides a resolver function for each API endpoint
    const root = {
        hello: () => {
            const db = jsonfile.readFileSync(file)
            return db.owner
        },
        ownerList: () => {
            const db = jsonfile.readFileSync(file)
            return db.owner.map(owner => {
                return owner.name
            })
        },
        petList: (type) => {
            console.log(type);
            const db = jsonfile.readFileSync(file)
            return db.pet.filter(pet => {
                console.log(pet.type);
                if (pet.type === type.type) {
                    console.log(pet);
                    return {
                        name: pet.name,
                        breed: pet.breed,
                    }
                    // return pet
                }
            })
        },
    };

    graphQL.post('/',  graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
        pretty: true,
    }));

    return graphQL;
}
