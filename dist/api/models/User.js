'use strict';

var _ = require('lodash');
var crypto = require('crypto');

/** @module User */
module.exports = {
  // primaryKey: '_id',

  attributes: {

    // _id: {
    //   type: 'string',
    //   unique: true,
    //   columnName: '_id'
    // },

    username: {
      type: 'string',
      unique: true,
      required: true
    },
    email: {
      type: 'string',
      unique: true,
      required: true,
      isEmail: true
    },
    passports: {
      collection: 'Passport',
      via: 'user'
    }
  },

  getGravatarUrl: function getGravatarUrl() {
    var md5 = crypto.createHash('md5');
    md5.update(this.email || '');
    return 'https://gravatar.com/avatar/' + md5.digest('hex');
  },

  toJSON: function toJSON() {
    var user = this.toObject();
    delete user.password;
    user.gravatarUrl = this.getGravatarUrl();
    return user;
  },

  beforeCreate: function beforeCreate(user, next) {
    if (_.isEmpty(user.username)) {
      user.username = user.email;
    }
    next();
  },

  /**
   * Register a new User with a passport
   */
  register: function register(user) {
    return new Promise(function (resolve, reject) {
      sails.services.passport.protocols.local.createUser(user, function (error, created) {
        if (error) return reject(error);

        resolve(created);
      });
    });
  }
};