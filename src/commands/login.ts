import cliux from 'cli-ux'

import config from '../config'
import { Guru } from '../lib/guru'

export default async (cli: any): Promise<void> => {
    cli.command('login', 'login and save credentials for guru cli').action(async () => {
        config.clear()
        console.log('Login to Guru API\n------------------------')
        const email = await cliux.prompt('Guru Admin Email')
        const token = await cliux.prompt('Admin API Token')
        const g = new Guru({
            email,
            token,
        })
        const checkAuth = await g.authenticated()
        if (!checkAuth.authenticated) {
            console.log(checkAuth.message)
            return
        }
        config.set({
            auth: {
                email,
                token,
            },
        })
        console.log('✅ Successfully authenticated to Guru API. You can now run guru-cli commands.')
    })
}
