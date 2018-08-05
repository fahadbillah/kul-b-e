import { Router } from 'express';
import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList } from 'graphql';
import graphqlHTTP from 'express-graphql';
const jsonfile = require('jsonfile')
const file = './db.json';

export default ({ config }) => {
    let graphQL = Router();
    const PetType = new GraphQLObjectType({
        name: 'Pet',
        fields:() => ({
            _id: {type: GraphQLString},
            name: {type: GraphQLString},
            color: {type: GraphQLString},
            breed: {type: GraphQLString},
            info: {type: GraphQLString},
            age: {type: GraphQLInt}
        })
    })
    const OwnerType = new GraphQLObjectType({
        name: 'Owner',
        fields:() => ({
            _id: {type: GraphQLString},
            name: {type: GraphQLString},
            email: {type: GraphQLString},
            address: {type: GraphQLString},
            phone: {type: GraphQLString},
            pets: {
                type: new GraphQLList(PetType)
            }
        })
    })

    const RootQuery = new GraphQLObjectType({
        name: 'RootQueryType',
        fields:{
            pets:{
                type: new GraphQLList(PetType),
                resolve(){
                    const fullDB = jsonfile.readFileSync(file)
                    console.log(fullDB.pet);
                    return fullDB.pet
                }
            },
            pet:{
                type: PetType,
                args: {
                    _id: {type:GraphQLString}
                },
                resolve(parentValue, args){
                    const fullDB = jsonfile.readFileSync(file)
                    return fullDB.pet.find(pet => {
                        return pet._id === args._id;
                    })
                }
            },
            owner:{
                type: OwnerType,
                args: {
                    _id: {type:GraphQLString}
                },
                resolve(parentValue, args){
                    const fullDB = jsonfile.readFileSync(file)
                    return fullDB.owner.find(owner => {
                        return owner._id === args._id;
                    })
                }
            }
        }
    })

    const test = new GraphQLSchema({
        query: RootQuery,
    })

    graphQL.all('/',  graphqlHTTP({
        schema: test,
        graphiql: true,
    }));

    return graphQL;
}
