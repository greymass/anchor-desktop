/* eslint-disable @typescript-eslint/consistent-type-imports */

interface Exposed {
    readonly nodeCrypto: Readonly<typeof import('./src/nodeCrypto').nodeCrypto>
    readonly versions: Readonly<typeof import('./src/versions').versions>
    readonly anchor: Readonly<typeof import('./src/index').anchor>
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Window extends Exposed {}
