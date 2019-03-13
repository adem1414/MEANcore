'use strict';
var async = require('async'),
  errorHandler = require('../../errors.server.controller.js'),
  rolesModel = require('./roles.server.model');

exports.getRoles = function (req, res) {
  rolesModel.getAll(function (err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to retrieve roles'
      });
    }

    res.status(200).send(result);
  });
};

exports.createRole = function (req, res) {
  rolesModel.create(req.body.role, function (err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to create role'
      });
    }

    res.status(200).send(result);
  });
};

exports.updateRole = function (req, res) {
  rolesModel.update(req.params.role_id, req.body.role, function (err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to modify role'
      });
    }

    res.status(200).send(result);
  });
};

exports.deleteRole = function (req, res) {
  rolesModel.delete(req.params.role_id, function (err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to delete role'
      });
    }

    res.status(200).send(result);
  });
};

exports.connectPermissionWithRole = function (req, res) {
  rolesModel.connectPermission(req.params.role_id, req.params.perm_id, function (err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to connect permission'
      });
    }

    res.status(200).send(result);
  });
};

exports.disconnectPermissionFromRole = function (req, res) {
  rolesModel.disconnectPermission(req.params.role_id, req.params.perm_id, function (err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to disconnect permission'
      });
    }

    res.status(200).send(result);
  });
};

exports.addUserToRole = function (req, res) {
  rolesModel.addUser(req.body.user, req.params.role_id, function (err, result) {
    if (err) {
      return res.status(500).send({
        error: errorHandler.getErrorMessage(err)
      });
    }

    res.status(200).send(result);
  });
};

exports.addUsersToRole = function (req, res) {
  let response = {
    users: [],
    errors: [],
    added: 0,
    failed: 0
  };
  async.eachSeries(req.body.users, function (user, callback) {
    rolesModel.addUser(user, req.params.role_id, function (err, result) {
      if (err) {
        response.errors.push({
          error: err.message,
          user: user
        });
        response.failed++;
      } else {
        response.users.push(result.user);
        response.added++;
      }
      callback();
    });
  }, function (err) {
    if (err) {
      return res.status(500).send({
        error: errorHandler.getErrorMessage(err)
      });
    }

    res.status(200).send(response);
  });
};

exports.removeUserFromRole = function (req, res) {
  rolesModel.removeUser(req.params.user_id, req.params.role_id, function (err, response) {
    if (err) {
      return res.status(500).send({
        error: errorHandler.getErrorMessage(err)
      });
    }

    res.status(200).send(response);
  });
};
