"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genSalt = exports.compare = exports.hash = void 0;
exports.hash = jest.fn().mockImplementation((password) => {
    return Promise.resolve(`hashed_${password}`);
});
exports.compare = jest.fn().mockImplementation((password, hashedPassword) => {
    return Promise.resolve(hashedPassword === `hashed_${password}`);
});
exports.genSalt = jest.fn().mockResolvedValue('mock_salt');
const bcrypt = {
    hash: exports.hash,
    compare: exports.compare,
    genSalt: exports.genSalt,
};
exports.default = bcrypt;
//# sourceMappingURL=bcrypt.js.map