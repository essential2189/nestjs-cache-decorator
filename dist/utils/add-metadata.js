"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMetadata = void 0;
const AddMetadata = (metadataKey, metadataValue) => {
    const decoratorFactory = (_, __, descriptor) => {
        if (!Reflect.hasMetadata(metadataKey, descriptor.value)) {
            Reflect.defineMetadata(metadataKey, [], descriptor.value);
        }
        const metadataValues = Reflect.getMetadata(metadataKey, descriptor.value);
        metadataValues.push(metadataValue);
        return descriptor;
    };
    decoratorFactory.KEY = metadataKey;
    return decoratorFactory;
};
exports.AddMetadata = AddMetadata;
//# sourceMappingURL=add-metadata.js.map