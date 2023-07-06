
export const getId = (url: string) => {
    const [ _, __, id ] = url.split("/").filter(Boolean);
    return id
};