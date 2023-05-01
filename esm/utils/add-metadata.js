export const AddMetadata = (metadataKey, metadataValue) => {
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
//# sourceMappingURL=add-metadata.js.map