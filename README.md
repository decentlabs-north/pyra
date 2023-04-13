[`pure | 📦`](https://github.com/telamon/create-pure)
[`code style | standard`](https://standardjs.com/)
```
._   .__.
|_)\/|(_|
|  /
```

> Tiny Pyramid / Toy Platform / [Pico Silo](https://github.com/decentlabs-north/pops)

## Use

```bash
$ yarn
yarn start # Start backend on port 5000
yarn designer # Start frontend on port 5001
```
Point your browser to localhost:5001 and enjoy!


## Run production
If you're running your own, [let's link up!](https://discord.gg/8RMRUPZ9RS)

Launch-script with defaults:

```bash
#!/bin/sh
echo "Launching pyra"

NODE_ENV=production \
  PORT=5000 \
  STATIC=pub/ \
  DATA=data/ \
  MAINTAINER=your.email@tld.com \
  OPENAI_API_KEY=sk-XXXXX \
  npm start
```

## License

[AGPL-3.0-or-later](./LICENSE)

2023 &#x1f12f; Tony Ivanov
