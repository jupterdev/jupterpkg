"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command =
  exports.chatBot =
  exports.StarboardClient =
  exports.ModMailClient =
  exports.pagination =
  exports.generateTranscript =
  exports.GiveawayClient =
  exports.jupterDB =
    void 0;
// jupterDB
var jupterDB_1 = require("./database/jupterDB");
Object.defineProperty(exports, "jupterDB", {
  enumerable: true,
  get: function () {
    return jupterDB_1.jupterDB;
  },
});
// structures
var command_1 = require("./structures/command");
Object.defineProperty(exports, "Command", {
  enumerable: true,
  get: function () {
    return command_1.Command;
  },
});
//# sourceMappingURL=index.js.map
