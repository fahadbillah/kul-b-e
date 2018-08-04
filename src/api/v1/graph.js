import { Router } from 'express';
import { buildSchema } from 'graphql';
import graphqlHTTP from 'express-graphql';
const jsonfile = require('jsonfile')
const file = './db.json';
const fullDB = jsonfile.readFileSync(file)

export default ({ config }) => {
    let graphQL = Router();

    const schema = buildSchema(`
        type Query {
            hello: String
            ownerList: String
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
            return db.owner;
            // return db.owner.map(owner => {
            //     return owner.name
            // })
        },
        petList: (type) => {
            console.log(type);
            const db = jsonfile.readFileSync(file)
            return db.pet.filter(pet => {
                if (pet.type === type) {
                    return pet
                }
            })
        },
    };

    graphQL.post('/',  graphqlHTTP({
        rootValue: fullDB,
        graphiql: true,
    }));

    return graphQL;
}
