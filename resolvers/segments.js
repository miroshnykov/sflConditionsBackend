const {Segments} = require('../models')
const checkUser = require('../helper/perm')

module.exports = {
    Query: {
        segments: (_, {}, ctx) => {
            checkUser(ctx.user)
            return Segments.all()
        }
    },
    Mutation: {
        ordering: async (_, data, ctx) => {
            // example call
            // mutation {
            //     ordering(reordering: [
            //         {id: 1,position:3},
            //         {id: 2, position:5}
            //     ]) {
            //         id
            //         position
            //     }
            // }

            // console.log('message id:',data)
            // console.log(' message ctx:',ctx)

            return await Segments.reordering(data)
        },
        createSegment: async (_, {
            name
        }, ctx) => {
            checkUser(ctx.user)
            let data = {}
            data.name = name
            data.user = ctx.user.email
            console.log(data)
            return await Segments.createSegment(data)
        },
        deleteSegment: async (_, {id}, ctx) => {
            checkUser(ctx.user)
            return await Segments.deleteSegment(id)
        },
        // reordering: async (_, {
        //     id,
        //     position
        // }, ctx) => {
        //     let data = {}
        //     data.id = id
        //     data.position = position
        //     data.user = ctx.user.email
        //     // checkUser(ctx.user)
        //     console.log('data:',data)
        //     return await Segments.reordering(data)
        // }
    }
}