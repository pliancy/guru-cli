import Conf from 'conf'

export const conf = new Conf({
  schema: {
    auth: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
        },
        token: {
          type: 'string',
        },
      },
    },
  },
})

export default conf
