// eventEmitter.ts
const EventEmitter = require('events');

const Events = {
  USER_REGISTRATION : 'user-registered',
  WORKSPACE_TRANSLATION: 'workspace-translation',
  GATEWAY_SUBSCRIPTION_UPDATE: 'gateway-subscription-update'
}

class Emmitter extends EventEmitter {
  emit(type, ...args) {
    super.emit('*', ...args);
    return super.emit(type, ...args) || super.emit('', ...args);
  }
}



const eventEmitter = new Emmitter();

module.exports = { eventEmitter, Events };
