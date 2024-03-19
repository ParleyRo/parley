module.exports = {
    app:{
      redirect: {
        default: '/'
      }
    },
    jwt : {
      secret : 'xxxx'
    },
    cookie : {
      secret : 'xxx'
    },
    db: {
      host:'127.0.0.1',
      username:'xxx',
      password:'xxx',
      database:'xxx',
      port:'3306',
    },
    aws:{
      accessKeyId: "xxx",
      secretAccessKey: "xxx",
      region: "xxx"
    },
    subdomains: {
      eficienta: {
        port: 1234
      },
      facturamea: {
        port: 1234
      }
    }
  };