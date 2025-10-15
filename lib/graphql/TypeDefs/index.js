import {  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLFloat,
  GraphQLList} from "graphql"


export const UserType = new GraphQLObjectType({
    name:"User",
    fields:() => ({
        id : {type:GraphQLString},
        name: {type:GraphQLString},
        email:{type:GraphQLString},
        age:{type:GraphQLInt}
    })  
})

export const PostType = new GraphQLObjectType({
    name:"Post",
    fields:() => ({
        id:{type:GraphQLString},
        title:{type:GraphQLString},
        content:{type:GraphQLString},
        authoId:{type:GraphQLString},
    })
})

