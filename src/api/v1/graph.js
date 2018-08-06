import { Router } from 'express';
import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList } from 'graphql';
import graphqlHTTP from 'express-graphql';
const jsonfile = require('jsonfile')
const file = './db.json';

export default ({ config }) => {
    let graphQL = Router();
    const CatType = new GraphQLObjectType({
        name: 'Cat',
        fields:() => ({
            _id: {type: GraphQLString},
            name: {type: GraphQLString},
        })
    })
    const DogType = new GraphQLObjectType({
        name: 'Dog',
        fields:() => ({
            _id: {type: GraphQLString},
            name: {type: GraphQLString},
        })
    })
    const PetType = new GraphQLObjectType({
        name: 'Pet',
        fields:() => ({
            _id: {type: GraphQLString},
            name: {type: GraphQLString},
            color: {type: GraphQLString},
            breed: {type: GraphQLString},
            owner: {type: GraphQLString},
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
                type: new GraphQLList(PetType),
                args: {
                    end: {
                      type: GraphQLInt
                    },
                    start: {
                      type: GraphQLInt
                    }
                },
                resolve(parentValue, args) {
                    return parentValue.pets ? parentValue.pets.slice(args.start, args.end) : null
                }
            }
        })
    })

    const RootQuery = new GraphQLObjectType({
        name: 'RootQueryType',
        fields:{
            pets:{
                type: new GraphQLList(PetType),
                args: {
                    end: {
                      type: GraphQLInt
                    },
                    start: {
                      type: GraphQLInt
                    }
                },
                resolve(parentValue, args) {
                    const fullDB = jsonfile.readFileSync(file)
                    return fullDB.pet.slice(args.start, args.end);
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
            },
            owners:{
                type: new GraphQLList(OwnerType),
                args: {
                    end: {
                      type: GraphQLInt
                    },
                    start: {
                      type: GraphQLInt
                    }
                },
                resolve(parentValue, args) {
                    const fullDB = jsonfile.readFileSync(file)
                    return fullDB.owner.slice(args.start, args.end);
                }
            },
            cats:{
                type: new GraphQLList(CatType),
                args: {
                    end: {
                      type: GraphQLInt
                    },
                    start: {
                      type: GraphQLInt
                    }
                },
                resolve(parentValue, args) {
                    const fullDB = jsonfile.readFileSync(file)
                    return fullDB.cat.slice(args.start, args.end);
                }
            },
            dogs:{
                type: new GraphQLList(DogType),
                args: {
                    end: {
                      type: GraphQLInt
                    },
                    start: {
                      type: GraphQLInt
                    }
                },
                resolve(parentValue, args) {
                    const fullDB = jsonfile.readFileSync(file)
                    return fullDB.dog.slice(args.start, args.end);
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
