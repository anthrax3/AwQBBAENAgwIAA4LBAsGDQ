# AwQBBAENAgwIAA4LBAsGDQ

**Notes:**

This projects uses the free version of
[currencylayer](https://currencylayer.com/) API for  fetching the exchange
rate. But there's a limitation that the source country must be 'USD' or the
request will get an error.

## Design

WIP

## Getting Started

### Development

Pre-requsites:

- [Node 4.2.1+](https://nodejs.org/dist/)
- [Beanstalkd](http://kr.github.io/beanstalkd/)
- [mongoDB](https://www.mongodb.com/) 

Optional:

- [Docker Compose](https://www.docker.com/products/docker-compose) 
  - for running mongoDB using project's docker-compose filel
- [aurora](https://xuri.me/aurora/)
  - Beanstalk queue server console

## Tasks

### To seed initial data to mongoDB

```
npm run seed
```

### To run a beanstalk jobs worker

```
npm run worker
```

## TODO

- [ ] remove the API access key 
- [ ] code coverage
- [ ] better logging
- [ ] more validation for (e.g., the size of the job, tube name length)

## Reference

[currencylater API](https://currencylayer.com/documentation)
