import {SimplePool} from 'nostr-tools'
import {
    get,
    write,
  } from 'piconuro'

const pool = new SimplePool()

let relays = ['wss://nos.lol', 'wss://eden.nostr.land']

let sub = pool.sub(
    relays,
  [
    {
      authors: [
        /* '32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245', */
        '0149170fe78b061ce6c7295fff2daa303f710ba17efd8fafd8343292b4295e84', 
        /* 'fd681d432d0bd7371ee7d06f35784ac7653e79a39a3d178873a14a98e29c4ae0' */
      ]
    }
  ]
)


export function getArticles(){
    const [articles, setArticles] = write([]);
    sub.on('event', event => {
      // this will only be called once the first time the event is received
      // ...
      // console.log(event)
      
      if(event.kind === 1 && event.content.match('nostr')) {
          setArticles([...get(articles), event])
      }
    })

    return articles
}

/* let events = await pool.list(relays, [{kinds: [0, 1]}])
let event = await pool.get(relays, {
  ids: ['44e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245']
})

let relaysForEvent = pool.seenOn(
  '44e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245'
) */
// relaysForEvent will be an array of URLs from relays a given event was seen on

