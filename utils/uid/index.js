"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUID = void 0;
function generateUID() {
    return 'xxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16).toUpperCase();
    });
}
exports.generateUID = generateUID;
//# sourceMappingURL=index.js.map